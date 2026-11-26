import { useState } from 'react';
import { whatsappLink, bookingMessage } from '../config.js';
import { BOT_SERVICES, serviceType } from '../chatbot/engine.js';

// "Book Now": collects name, email, address and type of service, then opens WhatsApp with the message filled in.
export default function BookingForm() {
  const [form, setForm] = useState({ name: '', email: '', address: '', type: '' });
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => {
    setForm({ ...form, [k]: e.target.value });
    if (errors[k]) setErrors({ ...errors, [k]: undefined });
  };

  const submit = (e) => {
    e.preventDefault();
    const found = {};
    if (form.name.trim().length < 2) found.name = 'Enter your name.';
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) found.email = 'Enter a valid email address.';
    if (form.address.trim().length < 5) found.address = 'Enter your address.';
    if (!form.type) found.type = 'Select a service.';
    setErrors(found);
    if (Object.keys(found).length) return;
    window.location.href = whatsappLink(
      bookingMessage({ name: form.name.trim(), email: form.email.trim(), address: form.address.trim(), type: form.type })
    );
  };

  const Err = ({ k }) => (errors[k] ? <span className="field-error" role="alert">{errors[k]}</span> : null);
  const optionsFor = (from, to) => BOT_SERVICES.map((_, i) => i).filter((i) => i >= from && i < to);

  return (
    <section className="manager booking" id="booking" aria-labelledby="booking-title">
      <div className="manager-head">
        <h2 id="booking-title">Book a Service</h2>
        <p>Your details will be passed to WhatsApp for you to review and send. Booking is confirmed only after Helppora responds.</p>
      </div>
      <form onSubmit={submit} noValidate>
        <div className="form-grid">
          <div className={`field ${errors.name ? 'has-error' : ''}`}>
            <label htmlFor="b-name">Customer name</label>
            <input id="b-name" value={form.name} onChange={set('name')} autoComplete="name" />
            <Err k="name" />
          </div>
          <div className={`field ${errors.email ? 'has-error' : ''}`}>
            <label htmlFor="b-email">Customer email</label>
            <input id="b-email" type="email" value={form.email} onChange={set('email')} autoComplete="email" />
            <Err k="email" />
          </div>
          <div className={`field ${errors.address ? 'has-error' : ''}`}>
            <label htmlFor="b-address">Address</label>
            <textarea id="b-address" rows={3} value={form.address} onChange={set('address')} autoComplete="street-address" />
            <Err k="address" />
          </div>
          <div className={`field ${errors.type ? 'has-error' : ''}`}>
            <label htmlFor="b-type">Type of service</label>
            <select id="b-type" value={form.type} onChange={set('type')}>
              <option value="">Select a service</option>
              <optgroup label="Inside House Manager">
                {optionsFor(0, 4).map((i) => <option key={i} value={serviceType(i)}>{serviceType(i)}</option>)}
              </optgroup>
              <optgroup label="Outside House Manager">
                {optionsFor(4, 8).map((i) => <option key={i} value={serviceType(i)}>{serviceType(i)}</option>)}
              </optgroup>
            </select>
            <Err k="type" />
          </div>
        </div>
        <button type="submit" className="action-btn whatsapp booking-submit">Send Booking via WhatsApp</button>
      </form>
    </section>
  );
}
