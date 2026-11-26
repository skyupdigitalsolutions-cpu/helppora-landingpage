import { Check, X } from 'lucide-react';
import { rupees } from '../api';

export default function ResultStep({ booking, success, onRetry, onClose }) {
  const p = booking.payment;
  return (
    <div className="result" aria-live="polite">
      <span className={`result-mark ${success ? 'ok' : 'fail'}`} aria-hidden="true">
        {success ? <Check size={34} strokeWidth={2.6} /> : <X size={34} strokeWidth={2.6} />}
      </span>
      <h2 id="modal-title">{success ? 'Booking confirmed' : 'Payment failed'}</h2>
      <p className="result-sub">
        {success
          ? `Thank you, ${booking.customer.name}. Your assistance request has been received.`
          : p?.failureReason || 'Your payment did not go through. No amount was charged.'}
      </p>

      {success && (
        <div className="booking-id">
          <span>Booking ID</span>
          <strong>{booking.bookingId}</strong>
        </div>
      )}

      <div className="summary">
        <div className="sum-row"><span>Service</span><span>{booking.serviceName}</span></div>
        <div className="sum-row"><span>Customer</span><span>{booking.customer.name}</span></div>
        <div className="sum-row">
          <span>Booking status</span>
          <span className={`status ${success ? 'ok' : 'fail'}`}>{booking.status}</span>
        </div>
        {success && (
          <>
            <div className="sum-row"><span>Amount paid</span><span>{rupees(booking.total)}</span></div>
            <div className="sum-row"><span>Transaction ID</span><span>{p.transactionId}</span></div>
          </>
        )}
      </div>
      {success && <p className="demo-note">This is a demo booking created with a mock payment.</p>}

      {success ? (
        <button className="btn btn-primary btn-block" onClick={onClose}>Back to services</button>
      ) : (
        <div className="btn-pair">
          <button className="btn btn-primary" onClick={onRetry}>Try payment again</button>
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
        </div>
      )}
    </div>
  );
}
