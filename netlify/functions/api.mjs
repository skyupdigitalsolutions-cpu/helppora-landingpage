import { getCatalog, createBooking, pay } from '../../server/src/core.js';

const json = (status, data) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

export default async (req) => {
  const { pathname } = new URL(req.url);
  try {
    if (req.method === 'GET' && pathname === '/api/services') return json(200, getCatalog());
    if (req.method === 'POST' && pathname === '/api/bookings') {
      const r = createBooking(await req.json().catch(() => ({})));
      return json(r.status, r.data);
    }
    if (req.method === 'POST' && pathname === '/api/payments/mock') {
      const r = await pay(await req.json().catch(() => ({})));
      return json(r.status, r.data);
    }
    return json(404, { message: 'Not found.' });
  } catch (err) {
    console.error(err);
    return json(500, { message: 'Something went wrong. Please try again.' });
  }
};

export const config = { path: '/api/*' };
