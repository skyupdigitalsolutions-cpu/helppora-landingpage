export function validateBooking(body = {}) {
  const errors = {};
  const str = (v) => (typeof v === 'string' ? v.trim() : '');

  const name = str(body.name);
  const mobile = str(body.mobile).replace(/[\s-]/g, '');
  const location = str(body.location);
  const date = str(body.date);
  const time = str(body.time);
  const notes = str(body.notes);

  if (name.length < 2) errors.name = 'Enter your full name.';
  if (!/^[6-9]\d{9}$/.test(mobile)) errors.mobile = 'Enter a valid 10-digit mobile number.';
  if (location.length < 3) errors.location = 'Enter the location where you need assistance.';

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    errors.date = 'Choose a preferred date.';
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(`${date}T00:00:00`) < today) errors.date = 'Choose today or a future date.';
  }
  if (!/^\d{2}:\d{2}$/.test(time)) errors.time = 'Choose a preferred time.';
  if (notes.length > 500) errors.notes = 'Keep additional requirements under 500 characters.';
  if (body.termsAccepted !== true) errors.termsAccepted = 'Please accept the service terms and disclaimer.';

  return { errors, valid: Object.keys(errors).length === 0, data: { name, mobile, location, date, time, notes } };
}
