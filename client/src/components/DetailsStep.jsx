import { useState } from 'react';
import { Check } from 'lucide-react';
import { api, rupees } from '../api';
import { serviceIcons } from '../icons.jsx';

export const DISCLAIMER =
  'Helppora acts as an assistance and companion service provider. We facilitate assistance for everyday activities. Customers are responsible for their personal belongings, financial transactions, medical decisions and interactions with third parties. Helppora does not guarantee outcomes from external services or third-party providers.';

const todayStr = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

function Field({ label, error, children, id }) {
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error && <span className="field-error" role="alert">{error}</span>}
    </div>
  );
}

// Same rules as the server, so people get instant feedback.
function validate(f, accepted) {
  const e = {};
  if (f.name.trim().length < 2) e.name = 'Enter your full name.';
  if (!/^[6-9]\d{9}$/.test(f.mobile.replace(/[\s-]/g, ''))) e.mobile = 'Enter a valid 10-digit mobile number.';
  if (f.location.trim().length < 3) e.location = 'Enter the location where you need assistance.';
  if (!f.date) e.date = 'Choose a preferred date.';
  else if (f.date < todayStr()) e.date = 'Choose today or a future date.';
  if (!f.time) e.time = 'Choose a preferred time.';
  if (f.notes.length > 500) e.notes = 'Keep additional requirements under 500 characters.';
  if (!accepted) e.termsAccepted = 'Please accept the service terms and disclaimer.';
  return e;
}

export default function DetailsStep({ service, onDone }) {
  const Icon = serviceIcons[service.id];
  const [form, setForm] = useState({ name: '', mobile: '', location: '', date: '', time: '', notes: '' });
  const [accepted, setAccepted] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const set = (k) => (e) => {
    setForm({ ...form, [k]: e.target.value });
    if (errors[k]) setErrors({ ...errors, [k]: undefined });
  };

  const submit = async (e) => {
    e.preventDefault();
    const found = validate(form, accepted);
    setErrors(found);
    setServerError('');
    if (Object.keys(found).length) {
      document.querySelector('.has-error input, .has-error textarea, .terms.has-error input')?.focus();
      return;
    }
    setSubmitting(true);
    try {
      const booking = await api.createBooking({ serviceId: service.id, ...form, termsAccepted: accepted });
      onDone(booking);
    } catch (err) {
      if (err.errors) setErrors(err.errors);
      setServerError(err.message || 'Could not save your booking.');
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate>
      <div className="service-summary">
        <span className="icon-badge" aria-hidden="true"><Icon size={26} strokeWidth={1.8} /></span>
        <div>
          <h2 id="modal-title">{service.name}</h2>
          <p>{service.description}</p>
        </div>
      </div>

      <div className="included">
        <h3>What’s included</h3>
        <ul>
          {service.details.map((d) => (
            <li key={d}><Check size={16} strokeWidth={2.4} aria-hidden="true" /> {d}</li>
          ))}
        </ul>
        <p className="price-note">Starts at {rupees(service.amount)}</p>
      </div>

      <div className="form-grid">
        <Field id="f-name" label="Customer name" error={errors.name}>
          <input id="f-name" value={form.name} onChange={set('name')} autoComplete="name" placeholder="Your full name" />
        </Field>
        <Field id="f-mobile" label="Mobile number" error={errors.mobile}>
          <input id="f-mobile" value={form.mobile} onChange={set('mobile')} inputMode="numeric" autoComplete="tel-national" maxLength={13} placeholder="10-digit number" />
        </Field>
        <Field id="f-location" label="Location" error={errors.location}>
          <input id="f-location" value={form.location} onChange={set('location')} autoComplete="street-address" placeholder="Area, city or address" />
        </Field>
        <div className="row-2">
          <Field id="f-date" label="Preferred date" error={errors.date}>
            <input id="f-date" type="date" min={todayStr()} value={form.date} onChange={set('date')} />
          </Field>
          <Field id="f-time" label="Preferred time" error={errors.time}>
            <input id="f-time" type="time" value={form.time} onChange={set('time')} />
          </Field>
        </div>
        <Field id="f-notes" label="Additional requirements (optional)" error={errors.notes}>
          <textarea id="f-notes" rows={3} value={form.notes} onChange={set('notes')} maxLength={500} placeholder="Anything we should know?" />
        </Field>
      </div>

      <div className="disclaimer">
        <h3>Service terms and disclaimer</h3>
        <p>{DISCLAIMER}</p>
      </div>
      <div className={`terms ${errors.termsAccepted ? 'has-error' : ''}`}>
        <label>
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => {
              setAccepted(e.target.checked);
              setErrors({ ...errors, termsAccepted: undefined });
            }}
          />
          <span>I have read and agree to the service terms and disclaimer.</span>
        </label>
        {errors.termsAccepted && <span className="field-error" role="alert">{errors.termsAccepted}</span>}
      </div>

      {serverError && <p className="form-error" role="alert">{serverError}</p>}
      <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
        {submitting ? 'Saving…' : 'Continue'}
      </button>
    </form>
  );
}
