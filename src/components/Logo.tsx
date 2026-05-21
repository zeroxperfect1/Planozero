import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-center gap-1.5 ${className}`}
    >
      <Link to="/" className="flex items-center group">
        <img 
          src="/logo-planozero.svg" 
          alt="PLANOZERO" 
          className="h-8 md:h-10 w-auto object-contain transition-transform group-hover:scale-105" 
          referrerPolicy="no-referrer"
        />
      </Link>
    </motion.div>
  );
};

export default Logo;
