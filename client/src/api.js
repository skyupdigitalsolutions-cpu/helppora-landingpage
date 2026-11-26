const BASE = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw { message: 'Cannot reach the server. Check your connection and try again.' };
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) throw { status: res.status, message: 'Something went wrong. Please try again.', ...(data || {}) };
  if (data === null) throw { message: 'The server sent an unexpected response. Please try again.' };
  return data;
}

export const api = {
  getServices: () => request('/api/services'),
  createBooking: (payload) => request('/api/bookings', { method: 'POST', body: JSON.stringify(payload) }),
  // Mock gateway: a 402 still carries the booking, so we treat it as a normal (failed) result.
  payMock: async (payload) => {
    try {
      return await request('/api/payments/mock', { method: 'POST', body: JSON.stringify(payload) });
    } catch (err) {
      if (err.status === 402) return err;
      throw err;
    }
  },
};

export const rupees = (n) => `₹${Number(n).toLocaleString('en-IN')}`;
