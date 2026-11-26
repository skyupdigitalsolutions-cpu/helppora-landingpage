import { MessageCircle, Phone, CalendarCheck, Bot } from 'lucide-react';
import { whatsappLink, bookingMessage, PHONE_NUMBER } from '../config.js';

// WhatsApp, Call Now, Book Now and Chatbot buttons shown under the heading.
export default function ActionBar({ onChatbot }) {
  return (
    <nav className="actions" aria-label="Contact options">
      <a className="action-btn whatsapp" href={whatsappLink(bookingMessage())} target="_blank" rel="noopener noreferrer">
        <MessageCircle size={18} aria-hidden="true" /> WhatsApp
      </a>
      <a className="action-btn call" href={`tel:${PHONE_NUMBER}`}>
        <Phone size={18} aria-hidden="true" /> Call Now
      </a>
      <a className="action-btn call" href="#booking">
        <CalendarCheck size={18} aria-hidden="true" /> Book Now
      </a>
      <button type="button" className="action-btn call" onClick={onChatbot}>
        <Bot size={18} aria-hidden="true" /> Chatbot
      </button>
    </nav>
  );
}
