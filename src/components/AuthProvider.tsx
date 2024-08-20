import React from 'react';

type AppProps = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: AppProps) => {
  return <>{children}</>;
};

export default AuthProvider;
