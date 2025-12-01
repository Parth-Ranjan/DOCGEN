import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

export function AnimatedInput({ label, icon, className, ...props }: AnimatedInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <motion.div
        className="relative group"
        animate={{ scale: isFocused ? 1.01 : 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {icon && (
          <div className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300",
            isFocused ? "text-primary" : "text-gray-500"
          )}>
            {icon}
          </div>
        )}
        <input
          className={cn(
            'w-full glass-card px-4 py-3.5 text-white placeholder:text-gray-500',
            'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50',
            'transition-all duration-300',
            'hover:bg-white/5',
            icon && 'pl-12',
            className
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </motion.div>
    </div>
  );
}
