<?php
declare(strict_types=1);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/database.php';
header('Cache-Control: no-store, private');
header('Pragma: no-cache');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') sendJsonResponse(false, 'Only POST requests are accepted.', [], 405);
$input = json_decode(file_get_contents('php://input') ?: '', true);
if (!is_array($input)) sendJsonResponse(false, 'Invalid request.', [], 400);
$isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
ini_set('session.use_strict_mode', '1');
ini_set('session.use_only_cookies', '1');
session_name('OANK_JOB_ADMIN');
session_set_cookie_params(['lifetime'=>0,'path'=>'/','secure'=>$isHttps,'httponly'=>true,'samesite'=>'Strict']);
session_start();
function jaInput(array $a,string $k,int $max=200): string { $v=$a[$k]??''; return is_string($v)?substr(trim($v),0,$max):''; }
function jaIpHash(): string { return hash_hmac('sha256',(string)($_SERVER['REMOTE_ADDR']??'unknown'),appEnv('JOB_OTP_PEPPER',DB_PASS)); }
function jaAuth(array $a): void {
  if (empty($_SESSION['admin_ok']) || (int)($_SESSION['admin_expires']??0)<time()) { $_SESSION=[]; sendJsonResponse(false,'Your admin session has expired. Sign in again.',[],401); }
  if (!isset($_SESSION['csrf']) || !is_string($a['csrf']??null) || !hash_equals($_SESSION['csrf'],$a['csrf'])) sendJsonResponse(false,'Security check failed. Refresh and try again.',[],403);
}
function jaIssue(PDO $pdo,string $purpose,?int $jobId=null): void {
  $ip=jaIpHash(); $q=$pdo->prepare("SELECT COUNT(*) FROM job_admin_otp WHERE ip_hash=? AND purpose=? AND created_at>DATE_SUB(UTC_TIMESTAMP(),INTERVAL 15 MINUTE)"); $q->execute([$ip,$purpose]);
  if ((int)$q->fetchColumn()>=3) sendJsonResponse(false,'Too many code requests. Wait 15 minutes before trying again.',[],429);
  $code=(string)random_int(100000,999999); $hash=password_hash($code,PASSWORD_DEFAULT); $expiry=gmdate('Y-m-d H:i:s',time()+600);
  $q=$pdo->prepare('INSERT INTO job_admin_otp (ip_hash,purpose,enquiry_id,otp_hash,expires_at) VALUES (?,?,?,?,?)'); $q->execute([$ip,$purpose,$jobId,$hash,$expiry]);
  $subject=$purpose==='login'?'OANK Cleaning admin sign-in code':'OANK Cleaning delivery confirmation code';
  $body="Your OANK Cleaning one-time code is: {$code}\n\nIt expires in 10 minutes and can only be used once. If you did not request it, ignore this email.\n";
  if (!@mail(NOTIFICATION_EMAIL,$subject,$body,'From: OANK Cleaning <'.NOTIFICATION_EMAIL.">\r\nContent-Type: text/plain; charset=UTF-8")) { oankLog('Job OTP email dispatch failed.','ERROR',['purpose'=>$purpose]); sendJsonResponse(false,'We could not send the security code. Please try again later.',[],503); }
}
function jaVerify(PDO $pdo,string $purpose,string $code,?int $jobId=null): bool {
  if (!preg_match('/^\d{6}$/',$code)) return false;
  $pdo->beginTransaction();
  try {
    $sql='SELECT * FROM job_admin_otp WHERE ip_hash=? AND purpose=? AND '.($jobId===null?'enquiry_id IS NULL':'enquiry_id=?').' AND expires_at>=UTC_TIMESTAMP() AND attempts<5 ORDER BY id DESC LIMIT 1 FOR UPDATE';
    $args=[$_SERVER['REMOTE_ADDR']??'unknown']; $args=[jaIpHash(),$purpose]; if($jobId!==null)$args[]=$jobId;
    $q=$pdo->prepare($sql);$q->execute($args);$r=$q->fetch(PDO::FETCH_ASSOC);
    if(!$r){$pdo->commit();return false;}
    if(!password_verify($code,$r['otp_hash'])){$u=$pdo->prepare('UPDATE job_admin_otp SET attempts=attempts+1 WHERE id=?');$u->execute([$r['id']]);$pdo->commit();return false;}
    $d=$pdo->prepare('DELETE FROM job_admin_otp WHERE id=?');$d->execute([$r['id']]);$pdo->commit();return true;
  } catch(Throwable $e){if($pdo->inTransaction())$pdo->rollBack();throw $e;}
}
$action=jaInput($input,'action',40);
try {
 $pdo=getDbConnection();
 if($action==='request_login_code'){jaIssue($pdo,'login');sendJsonResponse(true,'A sign-in code has been sent to the company mailbox.');}
 if($action==='verify_login_code'){
   if(!jaVerify($pdo,'login',jaInput($input,'code',6)))sendJsonResponse(false,'The code is incorrect, expired or already used.',[],400);
   session_regenerate_id(true);$_SESSION['admin_ok']=true;$_SESSION['admin_expires']=time()+1800;$_SESSION['csrf']=bin2hex(random_bytes(32));
   sendJsonResponse(true,'Admin access verified.',['csrf'=>$_SESSION['csrf'],'expiresIn'=>1800]);
 }
 jaAuth($input);$_SESSION['admin_expires']=time()+1800;
 if($action==='logout'){$_SESSION=[];session_destroy();sendJsonResponse(true,'Signed out.');}
 $ref=strtoupper(jaInput($input,'reference',32));
 if($action==='lookup_job'){
   if(!preg_match('/^[A-Z0-9-]{6,32}$/',$ref))sendJsonResponse(false,'Enter a valid job reference.',[],400);
   $q=$pdo->prepare('SELECT id,reference_no,name,service,preferred_date,status,created_at,delivered_at FROM enquiries WHERE reference_no=? LIMIT 1');$q->execute([$ref]);$job=$q->fetch(PDO::FETCH_ASSOC);
   if(!$job)sendJsonResponse(false,'No job was found with that reference.',[],404);
   sendJsonResponse(true,'Job found.',['job'=>$job]);
 }
 if($action==='request_delivery_code'||$action==='confirm_delivery'){
   $q=$pdo->prepare('SELECT id,status FROM enquiries WHERE reference_no=? LIMIT 1');$q->execute([$ref]);$job=$q->fetch(PDO::FETCH_ASSOC);
   if(!$job)sendJsonResponse(false,'Job not found.',[],404);
   if(strcasecmp((string)$job['status'],'Pending')!==0)sendJsonResponse(false,'Only jobs currently marked Pending can be changed to Delivered.',[],409);
   if($action==='request_delivery_code'){jaIssue($pdo,'delivery',(int)$job['id']);sendJsonResponse(true,'A delivery confirmation code has been sent to the company mailbox.');}
   if(!jaVerify($pdo,'delivery',jaInput($input,'code',6),(int)$job['id']))sendJsonResponse(false,'The code is incorrect, expired or already used.',[],400);
   $pdo->beginTransaction();
   try{
     $u=$pdo->prepare("UPDATE enquiries SET status='Delivered',delivered_at=NOW(),updated_at=NOW() WHERE id=? AND status='Pending'");$u->execute([$job['id']]);
     if($u->rowCount()!==1){$pdo->rollBack();sendJsonResponse(false,'The job status has changed. Look it up again.',[],409);}
     $h=$pdo->prepare("INSERT INTO job_status_history(enquiry_id,old_status,new_status,changed_by) VALUES(?,?,'Delivered',?)");$h->execute([$job['id'],(string)$job['status'],NOTIFICATION_EMAIL]);$pdo->commit();
   }catch(Throwable $e){if($pdo->inTransaction())$pdo->rollBack();throw $e;}
   sendJsonResponse(true,'Job status changed to Delivered.',['status'=>'Delivered','deliveredAt'=>date('c')]);
 }
 sendJsonResponse(false,'Unknown action.',[],400);
}catch(Throwable $e){oankLog('Job administration API error.','ERROR',['error'=>$e->getMessage()]);sendJsonResponse(false,'The job administration service is temporarily unavailable.',[],500);}
