import { useState } from 'react';

// Uses /logo.png (client/public). If the file is missing, the original text logo is shown instead.
export default function Logo() {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="logo" aria-label="Helppora">
        <svg width="40" height="40" viewBox="0 0 32 32" aria-hidden="true">
          <rect width="32" height="32" rx="10" fill="var(--orange)" />
          <path d="M9 23V9h3.2v5.4h7.6V9H23v14h-3.2v-5.8h-7.6V23z" fill="#fff" />
        </svg>
        <span>Helppora</span>
      </div>
    );
  }
  return (
    <img className="logo-img" src="/logo.png" alt="Helppora" width="700" height="366" onError={() => setFailed(true)} />
  );
}
