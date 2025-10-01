import { motion } from 'framer-motion';
import { Crown, ChefHat } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'Loading...' 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        {/* Outer ring */}
        <motion.div
          className={`${sizeClasses[size]} rounded-full border-4 border-primary/20`}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner ring */}
        <motion.div
          className={`absolute inset-1 rounded-full border-4 border-transparent border-t-primary`}
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Center icon */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Crown className="w-4 h-4 text-primary" />
        </motion.div>
      </div>
      
      {text && (
        <motion.p
          className="text-sm text-muted-foreground"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export const FullPageLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 rounded-xl"
      >
        <div className="flex flex-col items-center space-y-6">
          {/* Animated logo */}
          <motion.div
            className="relative"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="w-20 h-20 rounded-full bg-gold-gradient flex items-center justify-center shadow-gold">
              <ChefHat className="w-10 h-10 text-primary-foreground" />
            </div>
            
            {/* Orbiting elements */}
            <motion.div
              className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-primary"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute -bottom-2 -left-2 w-3 h-3 rounded-full bg-success"
              animate={{ rotate: [360, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
          
          <div className="text-center space-y-2">
            <motion.h2
              className="text-xl font-bold text-foreground"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
            Xrt-tech Admin
            </motion.h2>
            <motion.p
              className="text-sm text-muted-foreground"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            >
              Preparing your dashboard...
            </motion.p>
          </div>
          
          {/* Progress bar */}
          <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gold-gradient rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};