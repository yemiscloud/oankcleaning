<?php
declare(strict_types=1);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/database.php';
header('Cache-Control: no-store, private');
header('Pragma: no-cache');
if($_SERVER['REQUEST_METHOD']!=='POST')sendJsonResponse(false,'Only POST requests are accepted.',[],405);
$input=json_decode(file_get_contents('php://input')?:'',true);
if(!is_array($input))sendJsonResponse(false,'Invalid request.',[],400);
$ref=strtoupper(trim((string)($input['reference']??'')));
if(preg_match('/^(OANK|QUOTE)-\d{6}$/',$ref))sendJsonResponse(false,'This is an older reference format. Please contact info@oankcleaning.co.uk for help tracking this existing enquiry.',[],400);
if(!preg_match('/^OANK-[A-F0-9]{24}$/',$ref))sendJsonResponse(false,'Enter the secure job reference code sent with your new enquiry or quote.',[],400);
try{
 $pdo=getDbConnection();$q=$pdo->prepare('SELECT reference_no,name,service,preferred_date,status,created_at,delivered_at FROM enquiries WHERE reference_no=? LIMIT 1');$q->execute([$ref]);$job=$q->fetch(PDO::FETCH_ASSOC);
 if(!$job)sendJsonResponse(false,'We could not find a job with that reference. Check the code and try again.',[],404);
 sendJsonResponse(true,'Your job details are below.',['job'=>$job]);
}catch(Throwable $e){oankLog('Customer job tracking lookup failed.','ERROR',['error'=>$e->getMessage()]);sendJsonResponse(false,'Job tracking is temporarily unavailable. Please try again later.',[],500);}
