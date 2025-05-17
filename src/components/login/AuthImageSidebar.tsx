
import React from 'react';

const AuthImageSidebar: React.FC = () => {
  return (
    <div className="hidden md:block md:w-1/2 relative">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1595131264264-377ba3b61f46?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Fundo de login"
          className="object-cover w-full h-full object-center"
          style={{ minWidth: '100%', minHeight: '100%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-blue-600/20 mix-blend-multiply" />
      </div>
    </div>
  );
};

export default AuthImageSidebar;
