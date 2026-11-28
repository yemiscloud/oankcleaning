import React, { useState } from 'react';

type Job = {
  reference_no: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  service: string;
  postcode?: string | null;
  preferred_date: string;
  preferred_days?: string | null;
  property_type?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  frequency?: string | null;
  frequency_count?: number | null;
  frequency_discount_rate?: string | number | null;
  add_ons?: string | null;
  living_room_dining_room?: number | boolean | null;
  materials_discount_rate?: string | number | null;
  quote_estimate?: string | number | null;
  original_estimate?: string | number | null;
  savings_amount?: string | number | null;
  price_per_visit?: string | number | null;
  message?: string | null;
  status: string;
  created_at: string;
  delivered_at?: string | null;
};

const formatMoney = (value: string | number | null | undefined): string | null => {
  if (value === null || value === undefined || value === '') return null;
  const num = Number(value);
  return Number.isFinite(num) ? `£${num.toFixed(2)}` : null;
};

export const AdminJobsPage: React.FC = () => {
  const [stage, setStage] = useState<'login' | 'verify' | 'jobs'>('login');
  const [code, setCode] = useState('');
  const [reference, setReference] = useState('');
  const [job, setJob] = useState<Job | null>(null);
  const [csrf, setCsrf] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [deliveryCode, setDeliveryCode] = useState('');
  const [deliveryRequested, setDeliveryRequested] = useState(false);

  async function call(action: string, extra: Record<string, string> = {}) {
    const r = await fetch('/api/job-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ action, ...(csrf ? { csrf } : {}), ...extra }),
    });
    const p = await r.json();
    if (!r.ok || !p.success) throw new Error(p.message || 'Request failed.');
    return p;
  }

  async function run(fn: () => Promise<void>) {
    setBusy(true);
    setMessage('');
    try {
      await fn();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }

  const internalQuotePerVisit = formatMoney(job?.price_per_visit);
  const internalQuoteTotal = formatMoney(job?.quote_estimate);
  const internalOriginal = formatMoney(job?.original_estimate);
  const internalSavings = formatMoney(job?.savings_amount);
  const hasInternalQuote = Boolean(internalQuotePerVisit || internalQuoteTotal);

  return (
    <main className="min-h-[70vh] bg-slate-50 px-4 py-12">
      <section className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-600">
          OANK Cleaning · Restricted admin area
        </p>
        <h1 className="mt-2 text-3xl font-serif font-bold text-[#0F382C]">Job &amp; Quote Administration</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Admin access is verified by a one-time code sent to the company mailbox.
        </p>

        {message && (
          <p role="alert" className="mt-5 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
            {message}
          </p>
        )}

        {stage === 'login' && (
          <button
            disabled={busy}
            onClick={() =>
              run(async () => {
                await call('request_login_code');
                setStage('verify');
                setMessage('A sign-in code has been sent to info@oankcleaning.co.uk.');
              })
            }
            className="mt-7 w-full rounded-xl bg-[#0F382C] px-5 py-3 font-semibold text-white disabled:opacity-50"
          >
            {busy ? 'Sending…' : 'Send admin sign-in code'}
          </button>
        )}

        {stage === 'verify' && (
          <div className="mt-7 space-y-4">
            <label className="block text-sm font-semibold text-slate-700">
              Six-digit sign-in code
              <input
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-lg tracking-[0.35em]"
              />
            </label>
            <button
              disabled={busy || code.length !== 6}
              onClick={() =>
                run(async () => {
                  const p = await call('verify_login_code', { code });
                  setCsrf(p.data.csrf);
                  setStage('jobs');
                  setCode('');
                  setMessage('Admin access verified.');
                })
              }
              className="w-full rounded-xl bg-[#0F382C] px-5 py-3 font-semibold text-white disabled:opacity-50"
            >
              Verify and continue
            </button>
            <button
              onClick={() => {
                setStage('login');
                setCode('');
              }}
              className="text-sm font-semibold text-[#0F382C] underline"
            >
              Request another code
            </button>
          </div>
        )}

        {stage === 'jobs' && (
          <div className="mt-7 space-y-5">
            <div className="flex justify-end">
              <button
                onClick={() =>
                  run(async () => {
                    await call('logout');
                    setStage('login');
                    setJob(null);
                    setCsrf('');
                  })
                }
                className="text-sm text-slate-600 underline"
              >
                Sign out
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                run(async () => {
                  const p = await call('lookup_job', { reference });
                  setJob(p.data.job);
                  setDeliveryRequested(false);
                  setDeliveryCode('');
                });
              }}
              className="space-y-3"
            >
              <label className="block text-sm font-semibold text-slate-700">
                Job / Quote reference
                <input
                  value={reference}
                  onChange={(e) => setReference(e.target.value.toUpperCase())}
                  placeholder="OANK-…"
                  required
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </label>
              <button
                disabled={busy}
                className="w-full rounded-xl bg-[#0F382C] px-5 py-3 font-semibold text-white disabled:opacity-50"
              >
                Find job
              </button>
            </form>

            {job && (
              <div className="space-y-5 rounded-2xl border border-slate-200 p-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Job details</p>
                  <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-slate-500">Customer</dt>
                      <dd className="font-semibold">{job.name}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Reference</dt>
                      <dd className="font-semibold">{job.reference_no}</dd>
                    </div>
                    {job.email && (
                      <div>
                        <dt className="text-slate-500">Email</dt>
                        <dd className="font-semibold">{job.email}</dd>
                      </div>
                    )}
                    {job.phone && (
                      <div>
                        <dt className="text-slate-500">Phone</dt>
                        <dd className="font-semibold">{job.phone}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-slate-500">Job type</dt>
                      <dd className="font-semibold">{job.service}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Preferred date</dt>
                      <dd className="font-semibold">{job.preferred_date || 'Not specified'}</dd>
                    </div>
                    {job.postcode && (
                      <div>
                        <dt className="text-slate-500">Postcode</dt>
                        <dd className="font-semibold">{job.postcode}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-slate-500">Current status</dt>
                      <dd className="font-semibold">{job.status}</dd>
                    </div>
                  </dl>
                </div>

                {hasInternalQuote && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#0F382C]">
                      Internal Quote Overview (Admin Only)
                    </p>
                    <p className="mt-1 text-xs text-slate-600">
                      Not shown to the customer. Review and adjust as needed before sending the quote to the client.
                    </p>
                    <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                      {internalQuotePerVisit && (
                        <div>
                          <dt className="text-slate-600">Suggested Quote (Per Visit)</dt>
                          <dd className="text-lg font-extrabold text-[#0F382C]">{internalQuotePerVisit}</dd>
                        </div>
                      )}
                      {internalQuoteTotal && (
                        <div>
                          <dt className="text-slate-600">Suggested Quote Total</dt>
                          <dd className="text-lg font-extrabold text-[#0F382C]">{internalQuoteTotal}</dd>
                        </div>
                      )}
                      {internalOriginal && (
                        <div>
                          <dt className="text-slate-600">Standard (Before Discounts)</dt>
                          <dd className="font-semibold text-slate-800">{internalOriginal}</dd>
                        </div>
                      )}
                      {internalSavings && Number(job.savings_amount) > 0 && (
                        <div>
                          <dt className="text-slate-600">Discounts Applied</dt>
                          <dd className="font-semibold text-emerald-800">
                            -{internalSavings}
                            {Number(job.frequency_discount_rate) > 0
                              ? ` (${job.frequency_discount_rate}% freq)`
                              : ''}
                            {Number(job.materials_discount_rate) > 0
                              ? ` (${job.materials_discount_rate}% own materials)`
                              : ''}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                )}

                {job.message && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Submitted Scope &amp; Notes
                    </p>
                    <pre className="mt-2 whitespace-pre-wrap font-sans text-xs leading-relaxed text-slate-700">
                      {job.message}
                    </pre>
                  </div>
                )}

                {job.status.toLowerCase() === 'pending' &&
                  (!deliveryRequested ? (
                    <button
                      disabled={busy}
                      onClick={() =>
                        run(async () => {
                          await call('request_delivery_code', { reference: job.reference_no });
                          setDeliveryRequested(true);
                          setMessage('A delivery confirmation code has been sent to info@oankcleaning.co.uk.');
                        })
                      }
                      className="w-full rounded-xl bg-amber-500 px-5 py-3 font-semibold text-slate-950 disabled:opacity-50"
                    >
                      Request delivery confirmation code
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-slate-700">
                        Delivery confirmation code
                        <input
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          maxLength={6}
                          value={deliveryCode}
                          onChange={(e) => setDeliveryCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-lg tracking-[0.35em]"
                        />
                      </label>
                      <button
                        disabled={busy || deliveryCode.length !== 6}
                        onClick={() =>
                          run(async () => {
                            await call('confirm_delivery', {
                              reference: job.reference_no,
                              code: deliveryCode,
                            });
                            setJob({
                              ...job,
                              status: 'Delivered',
                              delivered_at: new Date().toISOString(),
                            });
                            setDeliveryCode('');
                            setDeliveryRequested(false);
                            setMessage('Job marked as Delivered.');
                          })
                        }
                        className="w-full rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white disabled:opacity-50"
                      >
                        Confirm and mark Delivered
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        <p className="mt-8 border-t border-slate-100 pt-5 text-xs leading-5 text-slate-500">
          Keep this page for authorised OANK Cleaning administrators. Both sign-in and delivery confirmation require email verification.
        </p>
      </section>
    </main>
  );
};
