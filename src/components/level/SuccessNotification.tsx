'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessNotificationProps {
  show: boolean;
  message?: string;
}

const SuccessNotification: React.FC<SuccessNotificationProps> = ({ 
  show, 
  message = "Level completed successfully! Great job!" 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      // Optional: auto-hide after a few seconds
      // const timer = setTimeout(() => {
      //   setIsVisible(false);
      // }, 3000); // Hides after 3 seconds
      // return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [show]);

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      className={`
        fixed top-6 left-1/2 transform -translate-x-1/2 
        bg-gradient-to-r from-[#14b8a6]/90 to-[#5eead4]/90 backdrop-blur-md 
        text-white px-6 py-3.5 
        rounded-full shadow-2xl shadow-[#14b8a6]/40 
        flex items-center gap-3 
        z-50
        transition-all duration-500 ease-out
        ${show ? 'opacity-100 translate-y-0 animate-fadeInDown' : 'opacity-0 -translate-y-10'}
      `}
      style={{ fontFamily: 'Montserrat, sans-serif' }}
    >
      <CheckCircle className="h-6 w-6 text-white flex-shrink-0" />
      <span className="text-sm font-medium">{message}</span>
      {/* Optional: Add a close button if not auto-hiding */}
      {/* <button onClick={() => setIsVisible(false)} className="ml-auto -mr-1 p-1 rounded-full hover:bg-white/20">
        <X className="h-4 w-4" />
      </button> */}
      <style jsx global>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translate(-50%, -30px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .animate-fadeInDown {
          animation: fadeInDown 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SuccessNotification;
