import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { botReply, BOT_SERVICES, CHIPS, GREETING } from '../chatbot/engine.js';
import { whatsappLink, bookingMessage, PHONE_NUMBER } from '../config.js';
import { EMAIL } from '../chatbot/engine.js';
import './chatbot.css';

// Which chatbot service (0-7) opens which service card popup.
const CARD_IDS = ['housekeeping', 'food', 'home-medical', 'miscellaneous', 'medical', 'bank', 'shopping', 'travel'];

export default function Chatbot({ open, onOpen, onClose, catalog, onOpenService, onBook }) {
  const [msgs, setMsgs] = useState([{ id: 0, who: 'bot', text: GREETING }]);
  const [q, setQ] = useState('');
  const logRef = useRef(null);
  const inputRef = useRef(null);
  const nextId = useRef(1);

  const ctx = {
    price: (i) => {
      const s = catalog?.services.find((x) => x.id === CARD_IDS[i]);
      return s ? s.amount : null;
    },
  };

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => { clearTimeout(t); document.removeEventListener('keydown', onKey); };
  }, [open, onClose]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [msgs, open]);

  const ask = (text) => {
    const meId = nextId.current++, typingId = nextId.current++;
    setMsgs((m) => [...m, { id: meId, who: 'me', text }, { id: typingId, who: 'bot', text: 'Typing…', typing: true }]);
    setTimeout(() => {
      const r = botReply(text, ctx);
      setMsgs((m) => m.map((x) => (x.id === typingId ? { id: typingId, who: 'bot', text: r.t, acts: r.a } : x)));
    }, 400);
  };

  const submit = (e) => {
    e.preventDefault();
    const v = q.trim();
    if (!v) return;
    setQ('');
    ask(v);
  };

  const renderAct = (a, k) => {
    if (a.t === 'wa') return <a key={k} className="hpc-b" href={whatsappLink(bookingMessage({ type: a.type || '' }))} target="_blank" rel="noopener noreferrer">💬 {a.type ? 'Book on WhatsApp' : 'Chat on WhatsApp'}</a>;
    if (a.t === 'call') return <a key={k} className="hpc-b" href={`tel:${PHONE_NUMBER}`}>📞 Call us</a>;
    if (a.t === 'mail') return <a key={k} className="hpc-b" href={`mailto:${EMAIL}`}>✉️ Email us</a>;
    if (a.t === 'ask') return <button key={k} type="button" className="hpc-b" onClick={() => ask(a.q)}>{a.q}</button>;
    if (a.t === 'book') return <button key={k} type="button" className="hpc-b" onClick={() => { onClose(); onBook(); }}>📅 Go to booking form</button>;
    if (a.t === 'svc') {
      const id = CARD_IDS[a.i];
      if (!id || !catalog) return null;
      return <button key={k} type="button" className="hpc-b" onClick={() => { onClose(); onOpenService(id); }}>Open {catalog.services.find((x) => x.id === id)?.name || BOT_SERVICES[a.i].n}{BOT_SERVICES[a.i].n === 'Medical Assistance' ? ` (${a.i < 4 ? 'Inside' : 'Outside'})` : ''}</button>;
    }
    return null;
  };

  return (
    <>
      {!open && (
        <button type="button" className="hpc-fab" onClick={onOpen} aria-label="Open Helppora chat">💬 Ask Helppora</button>
      )}
      {open && (
        <div className="hpc-panel" role="dialog" aria-label="Helppora chat">
          <div className="hpc-head">
            <div><strong>Helppora Assistant</strong><span>Ask about services, booking, pricing and contact</span></div>
            <button type="button" className="hpc-x" onClick={onClose} aria-label="Close chat"><X size={20} /></button>
          </div>
          <div className="hpc-log" ref={logRef} aria-live="polite">
            {msgs.map((m) => (
              <div key={m.id} className={`hpc-m hpc-${m.who} ${m.typing ? 'hpc-typing' : ''}`}>
                {m.text}
                {m.acts && m.acts.length > 0 && <div className="hpc-acts">{m.acts.map(renderAct)}</div>}
              </div>
            ))}
          </div>
          <div className="hpc-chips">
            {CHIPS.map((c) => <button key={c} type="button" onClick={() => ask(c)}>{c}</button>)}
          </div>
          <form className="hpc-form" onSubmit={submit} autoComplete="off">
            <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Type your question…" aria-label="Your question" maxLength={300} />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </>
  );
}
