import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-8 pb-safe text-center text-[12px] text-[#3C3C43]/30"
      style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
    >
      © 2026 Card Trooper
    </footer>
  );
};

export default Footer;
