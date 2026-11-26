import { useState } from 'react';
import { Smartphone, CreditCard, Landmark, Building2, ShieldAlert } from 'lucide-react';
import { api, rupees } from '../api';

const METHODS = [
  { id: 'UPI', label: 'UPI', icon: Smartphone },
  { id: 'CREDIT_CARD', label: 'Credit Card', icon: CreditCard },
  { id: 'DEBIT_CARD', label: 'Debit Card', icon: CreditCard },
  { id: 'NET_BANKING', label: 'Net Banking', icon: Landmark },
];
const BANKS = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank', 'Canara Bank'];
const isCard = (m) => m === 'CREDIT_CARD' || m === 'DEBIT_CARD';

function validate(method, v) {
  const e = {};
  if (method === 'UPI' && !/^[\w.-]{2,}@[a-zA-Z]{2,}$/.test(v.upi.trim())) e.upi = 'Enter a valid UPI ID, e.g. name@upi';
  if (isCard(method)) {
    if (v.card.replace(/\s/g, '').length !== 16 || /\D/.test(v.card.replace(/\s/g, ''))) e.card = 'Enter a 16-digit card number.';
    const m = v.expiry.match(/^(\d{2})\/(\d{2})$/);
    const now = new Date();
    if (!m || +m[1] < 1 || +m[1] > 12 || new Date(2000 + +m[2], +m[1], 0, 23, 59) < now) e.expiry = 'Enter a valid expiry (MM/YY).';
    if (!/^\d{3,4}$/.test(v.cvv)) e.cvv = 'Enter the 3 or 4 digit CVV.';
    if (v.holder.trim().length < 2) e.holder = 'Enter the name on the card.';
  }
  if (method === 'NET_BANKING' && !v.bank) e.bank = 'Choose your bank.';
  return e;
}

function Row({ label, value, strong }) {
  return (
    <div className={`sum-row ${strong ? 'strong' : ''}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

export default function PaymentStep({ booking, onResult, setBusy }) {
  const [method, setMethod] = useState('UPI');
  const [v, setV] = useState({ upi: '', card: '', expiry: '', cvv: '', holder: '', bank: '' });
  const [outcome, setOutcome] = useState('success');
  const [errors, setErrors] = useState({});
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');

  const set = (k, fn = (x) => x) => (e) => {
    setV({ ...v, [k]: fn(e.target.value) });
    if (errors[k]) setErrors({ ...errors, [k]: undefined });
  };
  const fmtCard = (s) => s.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const fmtExpiry = (s) => {
    const d = s.replace(/\D/g, '').slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const pay = async (e) => {
    e.preventDefault();
    const found = validate(method, v);
    setErrors(found);
    setError('');
    if (Object.keys(found).length) return;
    setPaying(true);
    setBusy(true);
    try {
      const res = await api.payMock({ bookingToken: booking.token, method, outcome });
      onResult(res.booking, res.success);
    } catch (err) {
      setError(err.message || 'Payment could not be processed.');
      setPaying(false);
      setBusy(false);
    }
  };

  const c = booking.customer;
  const Err = ({ k }) => (errors[k] ? <span className="field-error" role="alert">{errors[k]}</span> : null);

  return (
    <form onSubmit={pay} noValidate>
      <h2 id="modal-title" className="step-title">Complete your payment</h2>

      <div className="demo-banner">
        <ShieldAlert size={18} aria-hidden="true" />
        <span>Demo payment only. No real money moves, so please don’t enter real card or bank details.</span>
      </div>

      <div className="summary">
        <h3>Booking summary</h3>
        <Row label="Service" value={booking.serviceName} />
        <Row label="Customer" value={`${c.name} · ${c.mobile}`} />
        <Row label="Location" value={c.location} />
        <Row label="Preferred slot" value={`${new Date(`${c.date}T00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}, ${c.time}`} />
        <hr />
        <Row label="Service amount" value={rupees(booking.amount)} />
        <Row label="Convenience fee" value={rupees(booking.convenienceFee)} />
        <Row label="Total payable" value={rupees(booking.total)} strong />
      </div>

      <fieldset className="methods">
        <legend>Payment method</legend>
        <div className="method-grid">
          {METHODS.map(({ id, label, icon: Icon }) => (
            <label key={id} className={`method ${method === id ? 'selected' : ''}`}>
              <input type="radio" name="method" value={id} checked={method === id} onChange={() => { setMethod(id); setErrors({}); }} />
              <Icon size={18} aria-hidden="true" /> {label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="method-fields">
        {method === 'UPI' && (
          <div className={`field ${errors.upi ? 'has-error' : ''}`}>
            <label htmlFor="p-upi">UPI ID</label>
            <input id="p-upi" value={v.upi} onChange={set('upi')} placeholder="name@upi" autoComplete="off" />
            <Err k="upi" />
          </div>
        )}
        {isCard(method) && (
          <>
            <div className={`field ${errors.card ? 'has-error' : ''}`}>
              <label htmlFor="p-card">Card number</label>
              <input id="p-card" value={v.card} onChange={set('card', fmtCard)} inputMode="numeric" placeholder="0000 0000 0000 0000" autoComplete="off" />
              <Err k="card" />
            </div>
            <div className="row-2">
              <div className={`field ${errors.expiry ? 'has-error' : ''}`}>
                <label htmlFor="p-exp">Expiry</label>
                <input id="p-exp" value={v.expiry} onChange={set('expiry', fmtExpiry)} inputMode="numeric" placeholder="MM/YY" autoComplete="off" />
                <Err k="expiry" />
              </div>
              <div className={`field ${errors.cvv ? 'has-error' : ''}`}>
                <label htmlFor="p-cvv">CVV</label>
                <input id="p-cvv" type="password" value={v.cvv} onChange={set('cvv', (s) => s.replace(/\D/g, '').slice(0, 4))} inputMode="numeric" placeholder="•••" autoComplete="off" />
                <Err k="cvv" />
              </div>
            </div>
            <div className={`field ${errors.holder ? 'has-error' : ''}`}>
              <label htmlFor="p-holder">Name on card</label>
              <input id="p-holder" value={v.holder} onChange={set('holder')} autoComplete="off" />
              <Err k="holder" />
            </div>
          </>
        )}
        {method === 'NET_BANKING' && (
          <div className={`field ${errors.bank ? 'has-error' : ''}`}>
            <label htmlFor="p-bank">Select your bank</label>
            <select id="p-bank" value={v.bank} onChange={set('bank')}>
              <option value="">Choose a bank</option>
              {BANKS.map((b) => <option key={b}>{b}</option>)}
            </select>
            <Err k="bank" />
          </div>
        )}
      </div>

      <fieldset className="simulate">
        <legend>Demo result</legend>
        <label><input type="radio" name="outcome" checked={outcome === 'success'} onChange={() => setOutcome('success')} /> Simulate success</label>
        <label><input type="radio" name="outcome" checked={outcome === 'failure'} onChange={() => setOutcome('failure')} /> Simulate failure</label>
      </fieldset>

      {error && <p className="form-error" role="alert">{error}</p>}
      <button type="submit" className="btn btn-primary btn-block" disabled={paying}>
        {paying ? (<><span className="spinner" aria-hidden="true" /> Processing payment…</>) : `Pay Now · ${rupees(booking.total)}`}
      </button>
    </form>
  );
}
