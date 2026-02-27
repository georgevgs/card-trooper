import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer
      className="mt-8 pb-6 text-center text-[11px] select-none"
      style={{
        color: 'var(--mac-section)',
        paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))',
      }}
    >
      © 2026 Card Trooper
    </footer>
  );
};

export default Footer;
