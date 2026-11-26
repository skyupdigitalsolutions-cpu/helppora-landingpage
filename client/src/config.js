// Helppora contact details (used by the WhatsApp, Call Now, Chatbot and footer).
export const WHATSAPP_NUMBER = '919187133115';
export const PHONE_NUMBER = '+919187133115';
export const PHONE_DISPLAY = '+91 9187133115';
export const EMAIL = 'helpporahelpyourself@gmail.com';

export const whatsappLink = (text = '') =>
  `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

// WhatsApp message layout: customer name, customer email, address, type of service
export const bookingMessage = ({ name = '', email = '', address = '', type = '' } = {}) =>
  `Hello Helppora,\nCustomer name: ${name}\nCustomer email: ${email}\nAddress: ${address}\nType of service: ${type}`;
