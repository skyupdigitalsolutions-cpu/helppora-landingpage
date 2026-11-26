// Cloudflare Worker: serves the booking and payment API at /api/*.
// Everything else (the React page, logo, etc.) is served from client/dist by Cloudflare's static assets.
import { getCatalog, createBooking, pay } from '../server/src/core.js';

const json = (status, data) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

export default {
  async fetch(request, env) {
    // Use the BOOKING_SECRET variable from Cloudflare when it is set (optional).
    try {
      if (env.BOOKING_SECRET && globalThis.process?.env) process.env.BOOKING_SECRET = env.BOOKING_SECRET;
    } catch {
      /* the built-in demo secret is used instead */
    }

    const { pathname } = new URL(request.url);
    try {
      if (request.method === 'GET' && pathname === '/api/services') return json(200, getCatalog());
      if (request.method === 'POST' && pathname === '/api/bookings') {
        const r = createBooking(await request.json().catch(() => ({})));
        return json(r.status, r.data);
      }
      if (request.method === 'POST' && pathname === '/api/payments/mock') {
        const r = await pay(await request.json().catch(() => ({})));
        return json(r.status, r.data);
      }
      if (pathname.startsWith('/api/')) return json(404, { message: 'Not found.' });
    } catch (err) {
      console.error(err);
      return json(500, { message: 'Something went wrong. Please try again.' });
    }
    // Anything that is not /api goes to the website files.
    return env.ASSETS.fetch(request);
  },
};
