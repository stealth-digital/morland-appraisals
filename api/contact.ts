import { checkBotId } from 'botid/server';

/**
 * Contact form handler. Runs as a Vercel Function (Node.js runtime) and emails
 * the office through Resend's HTTP API. No SDK needed.
 *
 * Environment variables (set in Vercel → Project → Settings → Environment Variables):
 *   RESEND_API_KEY   required
 *   CONTACT_TO       comma-separated recipients (default info@morlandappraisals.org)
 *   CONTACT_FROM     verified sender, e.g. "Morland Website <website@morlandappraisals.org>"
 */

const TO = (process.env.CONTACT_TO ?? 'info@morlandappraisals.org').split(',').map((s) => s.trim()).filter(Boolean);
const FROM = process.env.CONTACT_FROM ?? 'Morland Website <website@morlandappraisals.org>';
const RESEND_URL = 'https://api.resend.com/emails';

/** A person takes longer than this to fill in the form. Scripts usually don't. */
const MIN_FILL_MS = 3000;

const MAX = { name: 100, phone: 40, email: 254, comment: 5000, page: 200 };

function field(form: FormData, name: string, max: number): string {
  const v = form.get(name);
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

/**
 * Hosts allowed to post to this form. The deployment's own host is always
 * allowed too, which covers Vercel preview URLs.
 */
const ALLOWED_HOSTS = new Set([
  'morlandappraisals.org',
  'www.morlandappraisals.org',
  'morland-appraisals.vercel.app',
  'localhost:4321',
]);

/**
 * Browsers send Origin (or at least Referer) on form POSTs. Reject requests
 * whose source is another site, or that carry neither header, which is typical
 * of a bare script. Not a substitute for rate limiting: a script can forge
 * these headers, so the Vercel Firewall rule on this path does the real work.
 */
function fromOwnSite(request: Request): { ok: boolean; host: string } {
  const origin = request.headers.get('origin');
  const source = origin && origin !== 'null' ? origin : request.headers.get('referer');
  if (!source) return { ok: false, host: '(none)' };
  let host: string;
  try {
    host = new URL(source).host;
  } catch {
    return { ok: false, host: '(invalid)' };
  }
  return { ok: host === new URL(request.url).host || ALLOWED_HOSTS.has(host), host };
}

/**
 * The form script posts with fetch and asks for JSON, then navigates to
 * `redirect` itself. Anything else gets a normal 303.
 */
function redirect(request: Request, path: string): Response {
  if (request.headers.get('accept')?.includes('application/json')) return Response.json({ redirect: path });
  return Response.redirect(new URL(path, request.url).href, 303);
}

export async function POST(request: Request): Promise<Response> {
  const source = fromOwnSite(request);
  if (!source.ok) {
    console.warn('contact: rejected post from', source.host);
    return redirect(request, '/contact-us#form-error');
  }

  // Vercel BotID. The form script adds the headers this checks; a post without
  // them, or from a headless browser, is classed as a bot.
  const verification = await checkBotId();
  if (verification.isBot) {
    console.warn('contact: BotID rejected post');
    return redirect(request, '/contact-us#form-error');
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return new Response('Bad request', { status: 400 });
  }

  // Honeypot: real users never see this field. Pretend it worked.
  if (field(form, 'bot-field', 200)) return redirect(request, '/thank-you');

  // Filled in faster than a person could. Also pretend it worked.
  const elapsed = Number(field(form, 'elapsed', 20));
  if (!(elapsed >= MIN_FILL_MS)) {
    console.warn('contact: dropped post filled in', elapsed, 'ms');
    return redirect(request, '/thank-you');
  }

  const first = field(form, 'first_name', MAX.name);
  const last = field(form, 'last_name', MAX.name);
  const phone = field(form, 'phone', MAX.phone);
  const email = field(form, 'email', MAX.email);
  const comment = field(form, 'comment', MAX.comment);
  const page = field(form, 'page', MAX.page) || '/';

  // Send failures back to the page the form was on, at its error message.
  const back = /^\/[a-z0-9/-]*$/.test(page) ? `${page}#form-error` : '/contact-us#form-error';

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!first || !last || !phone || !emailOk) return redirect(request, back);

  if (!process.env.RESEND_API_KEY) {
    console.error('contact: RESEND_API_KEY is not set');
    return redirect(request, back);
  }

  const name = `${first} ${last}`;
  const text = [
    `New appraisal request from the website (${page})`,
    '',
    `Name:    ${name}`,
    `Phone:   ${phone}`,
    `Email:   ${email}`,
    '',
    'Comment:',
    comment || '(none)',
  ].join('\n');

  const res = await fetch(RESEND_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: FROM,
      to: TO,
      reply_to: email,
      subject: `Appraisal request from ${name}`,
      text,
    }),
  });

  if (!res.ok) {
    console.error('contact: Resend responded', res.status, await res.text());
    return redirect(request, back);
  }

  return redirect(request, '/thank-you');
}

export function GET(): Response {
  return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });
}
