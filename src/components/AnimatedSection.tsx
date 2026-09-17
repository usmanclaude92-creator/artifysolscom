import React from 'react';
import { motion, useScroll, useSpring, type Variants } from 'framer-motion';

export type AnimationVariant =
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'fade'
  | 'scale-up'
  | 'blur-up';

export interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  variant?: AnimationVariant;
  delay?: number;
  duration?: number;
  distance?: number;
  amount?: number | 'some' | 'all';
  once?: boolean;
  style?: React.CSSProperties;
}

const getVariants = (variant: AnimationVariant, distance: number): Variants => {
  switch (variant) {
    case 'fade-up':
      return {
        hidden: { opacity: 0, y: distance },
        visible: { opacity: 1, y: 0 },
      };
    case 'fade-down':
      return {
        hidden: { opacity: 0, y: -distance },
        visible: { opacity: 1, y: 0 },
      };
    case 'fade-left':
      return {
        hidden: { opacity: 0, x: distance },
        visible: { opacity: 1, x: 0 },
      };
    case 'fade-right':
      return {
        hidden: { opacity: 0, x: -distance },
        visible: { opacity: 1, x: 0 },
      };
    case 'fade':
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      };
    case 'scale-up':
      return {
        hidden: { opacity: 0, scale: 0.96, y: distance / 2 },
        visible: { opacity: 1, scale: 1, y: 0 },
      };
    case 'blur-up':
      return {
        hidden: { opacity: 0, y: distance, filter: 'blur(8px)' },
        visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
      };
    default:
      return {
        hidden: { opacity: 0, y: distance },
        visible: { opacity: 1, y: 0 },
      };
  }
};

/**
 * AnimatedSection triggers a refined entry animation using framer-motion
 * as the section enters the viewport, enhancing the visual flow between
 * homepage components.
 */
export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = '',
  id,
  variant = 'fade-up',
  delay = 0,
  duration = 0.65,
  distance = 32,
  amount = 0.08,
  once = true,
  style,
}) => {
  const variants = getVariants(variant, distance);

  return (
    <motion.div
      id={id}
      className={`w-full ${className}`}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // Smooth cubic-bezier curve
      }}
    >
      {children}
    </motion.div>
  );
};

export interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  delayChildren?: number;
  staggerChildren?: number;
  amount?: number | 'some' | 'all';
  once?: boolean;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  className = '',
  delayChildren = 0.1,
  staggerChildren = 0.08,
  amount = 0.12,
  once = true,
}) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            delayChildren,
            staggerChildren,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

export interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  distance?: number;
}

export const StaggerItem: React.FC<StaggerItemProps> = ({
  children,
  className = '',
  distance = 24,
}) => {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: distance },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

/**
 * ScrollProgressBar gives subtle visual feedback at the top of the viewport
 * showing reading/scroll progress through homepage components.
 */
export const ScrollProgressBar: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-violet-500 via-indigo-400 to-sky-400 z-50 origin-left pointer-events-none"
      style={{ scaleX }}
    />
  );
};
