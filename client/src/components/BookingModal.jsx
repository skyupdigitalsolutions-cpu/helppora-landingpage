import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import DetailsStep from './DetailsStep.jsx';
import PaymentStep from './PaymentStep.jsx';
import ResultStep from './ResultStep.jsx';

const STEPS = [
  { id: 'details', label: 'Details' },
  { id: 'payment', label: 'Payment' },
  { id: 'result', label: 'Confirmation' },
];

export default function BookingModal({ service, convenienceFee, onClose }) {
  const [step, setStep] = useState('details'); // details | payment | success | failed
  const [booking, setBooking] = useState(null);
  const [busy, setBusy] = useState(false); // blocks closing while a payment is processing
  const dialogRef = useRef(null);

  const close = () => !busy && onClose();

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && close();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  });

  const activeIndex = step === 'details' ? 0 : step === 'payment' ? 1 : 2;

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" tabIndex={-1} ref={dialogRef}>
        <button className="modal-close" onClick={close} aria-label="Close" disabled={busy}>
          <X size={20} />
        </button>

        <ol className="stepper" aria-label="Booking progress">
          {STEPS.map((s, i) => (
            <li key={s.id} className={i === activeIndex ? 'active' : i < activeIndex ? 'done' : ''}>
              <span>{i + 1}</span> {s.label}
            </li>
          ))}
        </ol>

        {step === 'details' && (
          <DetailsStep
            service={service}
            onDone={(b) => {
              setBooking(b);
              setStep('payment');
            }}
          />
        )}
        {step === 'payment' && (
          <PaymentStep
            booking={booking}
            setBusy={setBusy}
            onResult={(b, ok) => {
              setBooking(b);
              setStep(ok ? 'success' : 'failed');
            }}
          />
        )}
        {(step === 'success' || step === 'failed') && (
          <ResultStep
            booking={booking}
            success={step === 'success'}
            onRetry={() => setStep('payment')}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
}
