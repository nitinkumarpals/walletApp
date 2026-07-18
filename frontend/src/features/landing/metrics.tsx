"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const STATS = [
  { value: 10, suffix: "M+", label: "active accounts" },
  { value: 50, prefix: "$", suffix: "B", label: "moved in 2025" },
  { value: 100, suffix: "+", label: "countries" },
  { value: 99.99, suffix: "%", label: "uptime" },
];

function useCountUp(target: number, active: boolean, dur = 1400) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, dur]);
  return n;
}

const Stat: React.FC<{ value: number; prefix?: string; suffix?: string; label: string; active: boolean }>
= ({ value, prefix = "", suffix = "", label, active }) => {
  const n = useCountUp(value, active);
  const display = value % 1 === 0 ? Math.round(n).toLocaleString() : n.toFixed(2);
  return (
    <div className="p-8 md:p-10 border-t md:border-t-0 md:border-l border-border first:border-l-0 first:border-t-0">
      <div className="num text-4xl md:text-5xl lg:text-6xl text-foreground">
        {prefix}{display}{suffix}
      </div>
      <div className="label-mono mt-3">{label}</div>
    </div>
  );
};

const Metrics: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <section ref={ref} className="px-4 md:px-8 py-24">
      <div className="max-w-7xl mx-auto">
        <div className="label-mono mb-6">// signal</div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 border border-border rounded-[20px] bg-surface/60 backdrop-blur"
        >
          {STATS.map((s, i) => (
            <Stat key={i} {...s} active={inView} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Metrics;