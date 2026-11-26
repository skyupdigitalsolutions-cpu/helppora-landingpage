# Helppora (classic landing page + chatbot): React + Node/Express

Inside House Manager and Outside House Manager cards with the service popup (details, disclaimer, form),
mock payment and booking confirmation, plus:

- WhatsApp, Call Now, Book Now and Chatbot buttons under the heading
- Helppora chatbot (no server, no API key) that answers questions about all services, booking,
  pricing, contact details and terms
- "Book a Service" form: customer name, email, address and type of service open in WhatsApp
- Contact footer: +91 9187133115 and helpporahelpyourself@gmail.com
- The Helppora logo (client/public/logo.png)

## Run on your computer
Open two terminals in this folder.

    npm run install:all        (once)

Terminal 1 (backend):

    npm run dev:server

Terminal 2 (frontend):

    npm run dev:client

Open http://localhost:5173

## Where to change things
- Phone, WhatsApp number, email: client/src/config.js and client/src/chatbot/engine.js
- Chatbot answers: client/src/chatbot/engine.js
- Service cards, descriptions and prices: server/src/services.js
- Logo: replace client/public/logo.png

## Publish on Netlify
netlify.toml builds the React app (client/dist) and publishes the booking API as a Netlify Function.
In Netlify leave "Base directory" empty, Publish directory = client/dist, Functions directory = netlify/functions.

## Notes
- Payment is a simulation only. No real money moves.
- Booking and payment logic is in server/src/core.js and needs no database.
