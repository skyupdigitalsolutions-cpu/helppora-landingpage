// Helppora predefined chatbot: matches a question to the best answer. No server and no API key.
export const PHONE_DISPLAY = '+91 9187133115';
export const EMAIL = 'helpporahelpyourself@gmail.com';

// The eight services Helppora offers (index 0-3 inside the home, 4-7 outside).
export const BOT_SERVICES = [
  { e: '🧹', n: 'Housekeeping Assistance', d: 'A helping hand for the daily upkeep of your home, so the house stays comfortable without the effort.', l: ['Home cleaning assistance', 'Everyday household support', 'Basic housekeeping services'] },
  { e: '🍲', n: 'Food Assistance', d: 'Support for getting good food to your table, from home meals to ordering on your behalf.', l: ['Home food assistance', 'Meal ordering support', 'Everyday food requirements'] },
  { e: '🩺', n: 'Medical Assistance', d: 'Practical help with medical needs at home, so you can focus on rest and recovery.', l: ['Help arranging medical needs at home', 'Medicine ordering support', 'Appointment booking support'] },
  { e: '🛠️', n: 'Miscellaneous Assistance', d: 'Support for the small tasks that do not fit anywhere else, from gadgets to paperwork.', l: ['Mobile repair assistance', 'Insurance-related support', 'Document-related assistance'] },
  { e: '🏥', n: 'Medical Assistance', d: 'Reliable help with hospital trips and appointments, including collecting medicines.', l: ['Hospital visit assistance', 'Medical appointment assistance', 'Medicine pickup assistance'] },
  { e: '🏦', n: 'Bank and Government Documentation', d: 'Support with the practical side of bank visits and government documentation.', l: ['Bank visit assistance', 'Government documentation support', 'Help with general banking-related visits'] },
  { e: '🛍️', n: 'Shopping Assistance', d: 'Shop with confidence with someone who helps you carry, compare and get around.', l: ['Shopping assistance', 'Assistance during shopping visits'] },
  { e: '🚗', n: 'Travel Assistance', d: 'Help for your regular trips around town and beyond.', l: ['Travel assistance', 'Support during everyday travel'] },
];
export const serviceType = (i) => `${i < 4 ? 'Inside' : 'Outside'} – ${BOT_SERVICES[i].n}`;
const inr = (n) => '₹' + Number(n).toLocaleString('en-IN');

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
function lev(a, b) {
  const m = a.length, n = b.length, d = [];
  for (let i = 0; i <= m; i++) d[i] = [i];
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++)
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[m][n];
}
function score(text, keys) {
  const pad = ` ${text} `, toks = text.split(' ');
  let s = 0;
  for (const k of keys) {
    if (k.includes(' ')) { if (pad.includes(` ${k} `)) s += 2; }
    else if (toks.includes(k)) s += 1;
    else if (k.length >= 5 && toks.some((t) => t.length >= 5 && !keys.includes(t) && Math.abs(t.length - k.length) <= 1 && lev(t, k) <= 1)) s += 0.7;
  }
  return s;
}

const WA = { t: 'wa' }, CALL = { t: 'call' }, MAIL = { t: 'mail' }, BOOK = { t: 'book' };
const say = (t, a) => () => ({ t, a });

// ctx.price(i) returns the starting amount for service i, or null when there is no fixed price.
function svc(i, ctx) {
  const s = BOT_SERVICES[i], p = ctx.price(i);
  const cost = p ? `Starts at ${inr(p)}; our team confirms the final quotation.` : 'Our team will share a quotation on WhatsApp or phone.';
  return { t: `${s.e} ${s.n} (${i < 4 ? 'Inside' : 'Outside'} House Manager)\n${s.d}\nIncludes: ${s.l.join(', ')}.\n${cost}`, a: [{ t: 'svc', i }, { t: 'wa', type: serviceType(i) }] };
}
function prices(ctx) {
  const line = (idx) => idx.map((i) => { const p = ctx.price(i); return `${BOT_SERVICES[i].n.replace(' Assistance', '').replace(' and Government Documentation', ' & Govt Docs')} ${p ? inr(p) : '(on request)'}`; }).join(', ');
  return { t: `Starting amounts:\n🏠 Inside: ${line([0, 1, 2, 3])}\n🚶 Outside: ${line([4, 5, 6, 7])}\nThese are starting prices. Our team confirms the final quotation on WhatsApp or phone.`, a: [WA, CALL] };
}

const INTENTS = [
  { id: 'distress', w: 3, k: ['suicide', 'kill myself', 'want to die', 'end my life', 'self harm'], r: say('I’m really sorry you’re going through this. Please reach out to someone you trust right now, or call 112 (or your local emergency number) if you might be in danger. You don’t have to face this alone.') },
  { id: 'emergency', w: 3, k: ['emergency', 'urgent', 'ambulance', 'accident', 'heart attack', 'chest pain', 'bleeding', 'unconscious'], r: say('If this is an emergency, please call 112 or your local emergency number right now. Helppora is an assistance service, not an emergency service.', [CALL]) },
  { id: 'bank', k: ['bank', 'banking', 'government', 'govt', 'documentation', 'gov'], r: (c) => svc(5, c) },
  { id: 'outsideMedical', k: ['hospital', 'clinic', 'doctor visit', 'medical visit', 'medical visits', 'medical appointment', 'medicine pickup', 'pickup medicine', 'pick up medicine', 'consultation'], r: (c) => svc(4, c) },
  { id: 'homeMedical', k: ['home medical', 'medical at home', 'medicine order', 'medicine ordering', 'order medicine', 'medicines at home'], r: (c) => svc(2, c) },
  { id: 'medical', k: ['medical', 'medicine', 'medicines', 'doctor', 'health', 'healthcare', 'sick'], r: () => ({ t: '🩺 Medical Assistance comes in two ways:\n• At home (Inside House Manager): help arranging medical needs at home, medicine ordering support and appointment booking support.\n• Outside the home (Outside House Manager): hospital visit assistance, medical appointment assistance and medicine pickup assistance.\nWhich one would you like to know more about?', a: [{ t: 'svc', i: 2 }, { t: 'svc', i: 4 }] }) },
  { id: 'housekeeping', k: ['housekeeping', 'house keeping', 'cleaning', 'clean', 'maid', 'sweeping', 'mopping', 'household', 'chores', 'housework'], r: (c) => svc(0, c) },
  { id: 'food', k: ['food', 'meal', 'meals', 'cook', 'cooking', 'tiffin', 'lunch', 'dinner', 'breakfast', 'order food', 'eat'], r: (c) => svc(1, c) },
  { id: 'misc', k: ['miscellaneous', 'misc', 'mobile repair', 'phone repair', 'repair', 'repairs', 'insurance', 'document', 'documents', 'paperwork'], r: (c) => svc(3, c) },
  { id: 'shopping', k: ['shopping', 'shop', 'shops', 'market', 'mall', 'buy', 'buying'], r: (c) => svc(6, c) },
  { id: 'travel', k: ['travel', 'travelling', 'traveling', 'trip', 'journey', 'tour', 'airport', 'station', 'commute'], r: (c) => svc(7, c) },
  { id: 'change', k: ['cancel', 'cancellation', 'reschedule', 'change', 'modify', 'postpone'], r: say('For changes or cancellations, please message our team on WhatsApp or call +91 9187133115 and they will help you.', [WA, CALL]) },
  { id: 'booking', k: ['book', 'booking', 'reserve', 'schedule', 'appointment', 'hire', 'order', 'request', 'how to book', 'how to order', 'get started'], r: say('Booking is easy:\n1. Tap Book Now.\n2. Fill in your name, email, address and the type of service.\n3. Your details open in WhatsApp, ready to send to us.\n4. Our team replies to confirm. A booking is confirmed only after Helppora responds.\nTapping a service card also shows its details and a demo booking and payment screen.', [BOOK, WA]) },
  { id: 'price', k: ['price', 'prices', 'pricing', 'cost', 'costs', 'charge', 'charges', 'fee', 'fees', 'rate', 'rates', 'how much', 'quotation', 'quote', 'amount', 'cheap', 'kitna', 'kimat', 'paisa', 'rupees', 'kharcha', 'daam'], r: prices },
  { id: 'payment', k: ['pay', 'payment', 'upi', 'card', 'netbanking', 'net banking', 'credit', 'debit', 'refund', 'invoice', 'receipt', 'advance', 'deposit', 'prepay', 'prepaid'], r: say('The payment screen in the service popup is a demonstration only, and no real money is taken there. Please confirm payment details with our team on WhatsApp or phone.', [WA, CALL]) },
  { id: 'contact', k: ['contact', 'phone', 'call', 'number', 'whatsapp', 'email', 'mail', 'reach'], r: say(`You can reach Helppora here:\n📞 Phone / WhatsApp: ${PHONE_DISPLAY}\n✉️ Email: ${EMAIL}`, [WA, CALL, MAIL]) },
  { id: 'hours', k: ['hours', 'timing', 'timings', 'open', 'available', 'availability', 'area', 'areas', 'city', 'cities', 'location', 'located', 'where', 'office', 'weekend', 'sunday'], r: say('Our timings, service areas and office address aren’t listed on this page. Please message or call our team and they’ll confirm availability for your location and time.', [WA, CALL]) },
  { id: 'terms', k: ['terms', 'disclaimer', 'policy', 'policies', 'responsible', 'responsibility', 'liability', 'guarantee', 'safe', 'safety', 'trust', 'trusted', 'secure', 'privacy', 'condition', 'conditions'], r: say('Terms and disclaimer: Helppora acts as an assistance and companion service provider. We facilitate assistance for everyday activities. Customers are responsible for their personal belongings, financial transactions, medical decisions and interactions with third parties. Helppora does not guarantee outcomes from external services or third-party providers.') },
  { id: 'human', k: ['agent', 'human', 'representative', 'person', 'someone', 'support', 'staff', 'team', 'executive', 'talk to', 'speak to', 'speak with', 'talk with'], r: say(`Of course! You can chat with our team on WhatsApp or call ${PHONE_DISPLAY}.`, [WA, CALL]) },
  { id: 'complaint', k: ['complaint', 'complain', 'feedback', 'review', 'problem', 'issue', 'not happy', 'unhappy', 'bad service'], r: say(`We’re sorry to hear that, and we’d love your feedback. Please share the details with our team on WhatsApp or by email at ${EMAIL} so they can look into it.`, [WA, MAIL]) },
  { id: 'jobs', k: ['job', 'jobs', 'career', 'careers', 'vacancy', 'hiring', 'work with you', 'work for you', 'join your team', 'partner', 'partnership', 'franchise'], r: say(`For careers or partnership enquiries, please message our team on WhatsApp or email ${EMAIL}.`, [WA, MAIL]) },
  { id: 'senior', k: ['elderly', 'senior', 'senior citizen', 'old age', 'parents', 'mother', 'father', 'grandparents', 'grandmother', 'grandfather'], r: say('Helppora provides everyday assistance. For specific needs, such as help for an elderly family member, please share the details with our team on WhatsApp or by phone and they will confirm how we can help.', [WA, CALL]) },
  { id: 'timing', k: ['how long', 'duration', 'same day', 'how soon', 'quickly', 'fast', 'immediately', 'right now', 'today'], r: say('Timing depends on the service and your location. Please share your preferred date and time, and our team will confirm availability.', [BOOK, WA]) },
  { id: 'language', k: ['language', 'languages', 'hindi', 'kannada', 'tamil', 'telugu', 'malayalam', 'english'], r: say('Please tell our team your preferred language on WhatsApp and they can confirm what they can support. I understand English best.', [WA]) },
  { id: 'smalltalk', k: ['how are you', 'how r u', 'whats up', 'what s up', 'how do you do', 'kaise ho'], r: say('I’m doing well, thank you! How can I help you with Helppora today?') },
  { id: 'identity', k: ['your name', 'who made you', 'are you a bot', 'are you human', 'are you real', 'are you ai', 'robot', 'who am i talking to'], r: say('I’m the Helppora assistant, an automated chatbot. I can answer questions about our services, booking, pricing, contact details and terms, and connect you with our team on WhatsApp.', [WA]) },
  { id: 'inside', k: ['inside', 'inside home manager', 'inside house manager', 'home manager', 'house manager', 'indoors', 'home services'], r: say('🏠 Inside House Manager helps with everyday needs at home:\n• Housekeeping Assistance\n• Food Assistance\n• Medical Assistance\n• Miscellaneous Assistance\nTell me which one you would like to know more about.') },
  { id: 'outside', k: ['outside', 'outside home manager', 'outside house manager', 'outside manager', 'outdoor', 'go out', 'out of home', 'errand', 'errands', 'companion'], r: say('🚶 Outside House Manager helps with errands outside your home:\n• Medical Assistance\n• Bank and Government Documentation\n• Shopping Assistance\n• Travel Assistance\nTell me which one you would like to know more about.') },
  { id: 'services', k: ['services', 'service', 'offer', 'offers', 'provide', 'provides', 'what do you do', 'what can you do', 'list', 'categories', 'options'], r: say('We offer two groups of services:\n🏠 Inside House Manager: Housekeeping, Food, Medical and Miscellaneous Assistance.\n🚶 Outside House Manager: Medical Assistance, Bank and Government Documentation, Shopping Assistance and Travel Assistance.\nAsk me about any of them for details.', [BOOK]) },
  { id: 'about', k: ['who are you', 'what is helppora', 'about helppora', 'who is helppora', 'tell me about', 'company', 'tagline', 'mission'], r: say('Helppora is an everyday assistance service: “Helping today, empowering tomorrow.” We help with everyday needs inside your home (Inside House Manager) and help with errands outside it (Outside House Manager).', [BOOK, WA]) },
  { id: 'thanks', w: 0.9, k: ['thanks', 'thank', 'thankyou', 'thx', 'dhanyavad', 'shukriya', 'great', 'awesome', 'nice', 'ok', 'okay', 'cool', 'no problem'], r: say('You’re welcome! Is there anything else I can help you with?') },
  { id: 'bye', w: 0.9, k: ['bye', 'goodbye', 'see you', 'later', 'cya', 'good night'], r: say('Thank you for visiting Helppora. Have a wonderful day!') },
  { id: 'yes', w: 0.8, k: ['yes', 'yeah', 'yep', 'sure', 'please'], r: say('Great! What would you like to know: our services, booking, pricing or contact details?') },
  { id: 'no', w: 0.8, k: ['no', 'nope', 'nothing', 'nah'], r: say('No problem! Let me know if you need anything else.') },
  { id: 'help', w: 0.85, k: ['help', 'assist', 'assistance'], r: say('Sure, I’m happy to help! You can ask about our services, booking, pricing, contact details and terms, or tap a button below.') },
  { id: 'greet', w: 0.9, k: ['hi', 'hello', 'hey', 'hii', 'namaste', 'hola', 'good morning', 'good afternoon', 'good evening'], r: say('Hello! Welcome to Helppora. I can tell you about our services, how to book, pricing, contact details and terms. What would you like to know?') },
];

export const FALLBACK = { id: 'fallback', t: 'Sorry, I didn’t quite get that. Try one of these, or chat with our team on WhatsApp for anything else.', a: [{ t: 'ask', q: 'What services do you offer?' }, { t: 'ask', q: 'How do I book?' }, { t: 'ask', q: 'How much does it cost?' }, WA] };
export const GREETING = 'Hello! I’m the Helppora assistant. Ask me about our services, booking, pricing or contact details, or tap a button below.';
export const CHIPS = ['Our services', 'How to book', 'Pricing', 'Contact us', 'Terms', 'Talk to the team'];

export function botReply(q, ctx = { price: () => null }) {
  const text = norm(q);
  let best = null, bs = 0.69;
  for (const it of INTENTS) {
    const s = score(text, it.k) * (it.w || 1);
    if (s > bs) { bs = s; best = it; }
  }
  if (!best) return FALLBACK;
  const r = best.r(ctx);
  return { id: best.id, t: r.t, a: r.a };
}
