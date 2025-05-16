
import React from 'react';

const LoginImagePanel: React.FC = () => {
  return (
    <div className="hidden md:block md:w-1/2 relative">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1595131264179-84bb2f9e17b9?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Fundo de login"
          className="object-cover w-full h-full object-center"
          style={{ minWidth: '100%', minHeight: '100%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-primary/20 mix-blend-multiply" />
      </div>
    </div>
  );
};

export default LoginImagePanel;
