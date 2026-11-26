import { serviceIcons } from '../icons.jsx';

// The whole card is clickable; the button inside is the keyboard-accessible control (click bubbles up).
export default function ServiceCard({ service, onSelect }) {
  const Icon = serviceIcons[service.id];
  return (
    <article className="service-card" onClick={() => onSelect(service)}>
      <span className="icon-badge" aria-hidden="true">
        <Icon size={24} strokeWidth={1.8} />
      </span>
      <h3>{service.name}</h3>
      <p>{service.short}</p>
      <button type="button" className="btn btn-primary" aria-label={`Select service: ${service.name}`}>
        Select Service
      </button>
    </article>
  );
}
