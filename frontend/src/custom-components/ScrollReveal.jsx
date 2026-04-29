import React from "react";
import { motion, useInView } from "framer-motion";

const ScrollReveal = ({
  children,
  delay = 0,
  y = 24,
  duration = 0.45,
  once = true,
  amount = 0.2,
  as = "div",
  style,
  className,
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once, amount });
  const MotionTag = motion[as] || motion.div;

  return (
    // Lightweight viewport-triggered reveal for section/card entrances.
    <MotionTag
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      style={style}
      className={className}
    >
      {children}
    </MotionTag>
  );
};

export default ScrollReveal;
