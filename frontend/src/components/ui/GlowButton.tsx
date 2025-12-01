import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export function GlowButton({ 
  children, 
  className, 
  variant = 'primary',
  disabled,
  ...props 
}: GlowButtonProps) {
  return (
    <motion.button
      className={cn(
        'relative px-6 py-3.5 rounded-xl font-medium transition-all duration-300',
        'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-dark-400',
        variant === 'primary' && [
          'bg-gradient-to-r from-primary to-accent text-white',
          'shadow-lg shadow-primary/25',
          !disabled && 'hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02]',
          !disabled && 'active:scale-[0.98]',
        ],
        variant === 'secondary' && [
          'glass-card text-white border-2 border-glass-border',
          !disabled && 'hover:bg-white/10 hover:border-primary/30',
        ],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
}
