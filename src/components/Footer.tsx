import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer
      className="mt-10 text-center text-[12px] select-none"
      style={{
        color: 'var(--c-ink-4)',
        paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))',
      }}
    >
      © 2026 Card Trooper
    </footer>
  );
};

export default Footer;
