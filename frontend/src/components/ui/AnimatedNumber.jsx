import React, { useState, useEffect } from 'react';

export function AnimatedNumber({
  value,
  duration = 800,
  formatter = (v) => v.toLocaleString(),
  className = ''
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const target = typeof value === 'number' ? value : parseFloat(value) || 0;

  useEffect(() => {
    let startTimestamp = null;
    const startValue = displayValue;
    const diff = target - startValue;

    if (diff === 0) return;

    let animationFrameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = startValue + diff * easeOut;

      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setDisplayValue(target);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [target, duration]);

  return <span className={className}>{formatter(displayValue)}</span>;
}
