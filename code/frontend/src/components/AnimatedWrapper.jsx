import { motion } from 'framer-motion';

export const FadeIn = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
    style={{ opacity: 1 }} // Fallback for immediate visibility
  >
    {children}
  </motion.div>
);

export const SlideUp = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
    style={{ opacity: 1 }} // Force visible state
  >
    {children}
  </motion.div>
);

export const KineticScale = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 1, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, delay }}
    className={className}
    style={{ opacity: 1 }}
  >
    {children}
  </motion.div>
);
