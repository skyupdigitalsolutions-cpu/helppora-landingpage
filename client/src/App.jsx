import { useCallback, useEffect, useState } from 'react';
import { api } from './api';
import Logo from './components/Logo.jsx';
import ActionBar from './components/ActionBar.jsx';
import ManagerSection from './components/ManagerSection.jsx';
import BookingForm from './components/BookingForm.jsx';
import BookingModal from './components/BookingModal.jsx';
import Chatbot from './components/Chatbot.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const [catalog, setCatalog] = useState(null);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);

  const load = () => {
    setError('');
    api
      .getServices()
      .then(setCatalog)
      .catch((e) => setError(e.message || 'Could not load services. Please try again.'));
  };
  useEffect(load, []);

  const closeChat = useCallback(() => setChatOpen(false), []);
  const openService = (id) => {
    const s = catalog?.services.find((x) => x.id === id);
    if (s) setSelected(s);
  };
  const goBooking = () => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <>
      <header className="hero">
        <Logo />
        <h1>Everyday Assistance, Inside and Outside Your Home.</h1>
        <p className="hero-sub">
          Your trusted companion for everyday needs. Simple, convenient and reliable assistance whenever you need it.
        </p>
        <ActionBar onChatbot={() => setChatOpen(true)} />
      </header>

      <main className="managers">
        {error && (
          <div className="notice" role="alert">
            <p>{error}</p>
            <button className="btn btn-ghost" onClick={load}>Try again</button>
          </div>
        )}
        {!catalog && !error && <p className="loading">Loading services…</p>}
        {catalog &&
          catalog.managers.map((m) => (
            <ManagerSection
              key={m.id}
              manager={m}
              services={catalog.services.filter((s) => s.manager === m.id)}
              onSelect={setSelected}
            />
          ))}
        <BookingForm />
      </main>

      <Footer />

      {selected && (
        <BookingModal
          service={selected}
          convenienceFee={catalog.convenienceFee}
          onClose={() => setSelected(null)}
        />
      )}

      <Chatbot
        open={chatOpen}
        onOpen={() => setChatOpen(true)}
        onClose={closeChat}
        catalog={catalog}
        onOpenService={openService}
        onBook={goBooking}
      />
    </>
  );
}
