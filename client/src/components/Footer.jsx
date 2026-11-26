import { PHONE_NUMBER, PHONE_DISPLAY, EMAIL } from '../config.js';

export default function Footer() {
  return (
    <footer className="site-footer">
      <strong>Contact Helppora</strong>
      <p>
        <a href={`tel:${PHONE_NUMBER}`}>{PHONE_DISPLAY}</a> · <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
      </p>
    </footer>
  );
}
