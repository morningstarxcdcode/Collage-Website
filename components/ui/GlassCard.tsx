import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import { twMerge } from "tailwind-merge";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  hoverEffect = true,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={
        hoverEffect
          ? {
              y: -5,
              boxShadow: "0 20px 40px -10px rgba(6, 182, 212, 0.2)",
              borderColor: "rgba(6, 182, 212, 0.4)",
            }
          : {}
      }
      className={twMerge(
        "bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl transition-all duration-300",
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
