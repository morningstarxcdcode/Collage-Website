import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { cn } from "../../lib/utils";

export const ServerStatus = () => {
  const [status, setStatus] = useState<"loading" | "online" | "offline">(
    "loading",
  );
  const [latency, setLatency] = useState<number | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      const start = Date.now();
      try {
        await api.get("/"); // NestJS default route returns "Hello World!"
        setLatency(Date.now() - start);
        setStatus("online");
      } catch (error) {
        console.error("Backend connection error:", error);
        setStatus("offline");
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-xs text-white backdrop-blur-md">
      <div
        className={cn(
          "h-2 w-2 rounded-full",
          status === "online"
            ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"
            : status === "loading"
              ? "bg-yellow-500"
              : "bg-red-500",
        )}
      />
      <span className="font-medium">
        {status === "online"
          ? `System Online (${latency}ms)`
          : status === "loading"
            ? "Connecting..."
            : "System Offline"}
      </span>
    </div>
  );
};
