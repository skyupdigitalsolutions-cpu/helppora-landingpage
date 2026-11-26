import ServiceCard from './ServiceCard.jsx';

export default function ManagerSection({ manager, services, onSelect }) {
  return (
    <section className={`manager manager-${manager.id}`} aria-labelledby={`${manager.id}-title`}>
      <div className="manager-head">
        <h2 id={`${manager.id}-title`}>
          <span aria-hidden="true">{manager.emoji}</span> {manager.title}
        </h2>
        <p>{manager.tagline}</p>
      </div>
      <div className="service-grid">
        {services.map((s) => (
          <ServiceCard key={s.id} service={s} onSelect={onSelect} />
        ))}
      </div>
    </section>
  );
}
