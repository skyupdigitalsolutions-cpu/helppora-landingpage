// Stateless booking + mock-payment logic.
// Serverless platforms (Netlify) keep no memory between requests, so the booking travels with the
// client as a signed token. The signature stops anyone editing the amount or status.
import crypto from 'node:crypto';
import { managers, services, CONVENIENCE_FEE } from './services.js';
import { validateBooking } from './validate.js';

const PAYMENT_METHODS = ['UPI', 'CREDIT_CARD', 'DEBIT_CARD', 'NET_BANKING'];
const secret = () => process.env.BOOKING_SECRET || 'helppora-demo-secret';
const sign = (payload) => crypto.createHmac('sha256', secret()).update(payload).digest('base64url');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const makeId = (prefix, len = 6) => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (const byte of crypto.randomBytes(len)) out += chars[byte % chars.length];
  return `${prefix}-${out}`;
};

function withToken(booking) {
  const payload = Buffer.from(JSON.stringify(booking)).toString('base64url');
  return { ...booking, token: `${payload}.${sign(payload)}` };
}

function readToken(token) {
  if (typeof token !== 'string' || !token.includes('.')) return null;
  const [payload, sig] = token.split('.');
  const a = Buffer.from(sig || '');
  const b = Buffer.from(sign(payload));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    return JSON.parse(Buffer.from(payload, 'base64url').toString());
  } catch {
    return null;
  }
}

export const getCatalog = () => ({ managers, services, convenienceFee: CONVENIENCE_FEE });

export function createBooking(body = {}) {
  const service = services.find((s) => s.id === body.serviceId);
  if (!service) return { status: 404, data: { message: 'Service not found.' } };

  const { valid, errors, data } = validateBooking(body);
  if (!valid) return { status: 422, data: { message: 'Please fix the highlighted fields.', errors } };

  const booking = {
    bookingId: makeId('HLP'),
    serviceId: service.id,
    serviceName: service.name,
    manager: service.manager,
    customer: data,
    amount: service.amount,
    convenienceFee: CONVENIENCE_FEE,
    total: service.amount + CONVENIENCE_FEE,
    currency: 'INR',
    status: 'Awaiting Payment',
    payment: null,
    createdAt: new Date().toISOString(),
  };
  return { status: 201, data: withToken(booking) };
}

// MOCK gateway. body: { bookingToken, method, outcome: 'success' | 'failure' }. No real payment happens.
export async function pay(body = {}) {
  const booking = readToken(body.bookingToken);
  if (!booking) return { status: 404, data: { message: 'Booking not found. Please start again.' } };
  if (!PAYMENT_METHODS.includes(body.method)) return { status: 422, data: { message: 'Choose a payment method.' } };
  if (booking.status === 'Confirmed') return { status: 409, data: { message: 'This booking is already paid.', booking: withToken(booking) } };

  await wait(1500); // simulate gateway latency

  const success = body.outcome !== 'failure';
  booking.payment = {
    mock: true,
    method: body.method,
    transactionId: makeId('DEMO-TXN', 8),
    status: success ? 'SUCCESS' : 'FAILED',
    paidAt: success ? new Date().toISOString() : null,
    failureReason: success ? null : 'Payment declined by the demo gateway.',
  };
  booking.status = success ? 'Confirmed' : 'Payment Failed';
  return { status: success ? 200 : 402, data: { success, booking: withToken(booking) } };
}
