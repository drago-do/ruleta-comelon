"use client";

import { useSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";

interface RateLimitInfo {
  remaining: number;
  total: number;
  resetAt: string;
}

export default function RateLimitBadge() {
  const { data: session } = useSession();
  const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitInfo | null>(
    null,
  );

  useEffect(() => {
    if (session) {
      const updateRateLimit = () => {
        const stored = localStorage.getItem("rateLimitInfo");
        if (stored) {
          try {
            setRateLimitInfo(JSON.parse(stored));
          } catch (e) {
            console.error("Error parsing rateLimitInfo", e);
          }
        }
      };

      updateRateLimit();

      // Escuchar cambios en localStorage (disparados manualmente por page.tsx)
      window.addEventListener("storage", updateRateLimit);
      return () => window.removeEventListener("storage", updateRateLimit);
    }
  }, [session]);

  if (!session || !rateLimitInfo) {
    return null;
  }

  const used = rateLimitInfo.total - rateLimitInfo.remaining;
  const percentage = (used / rateLimitInfo.total) * 100;

  let bgColor = "bg-green-400";
  if (percentage >= 80) bgColor = "bg-red-400";
  else if (percentage >= 60) bgColor = "bg-yellow-400";

  return (
    <div
      className={`inline-block ${bgColor} px-4 py-2 border-4 border-black shadow-[4px_4px_0_#000] rounded-xl`}
    >
      <div className="text-center">
        <div className="text-2xl font-black text-black">
          {used} / {rateLimitInfo.total}
        </div>
        <div className="text-xs font-bold text-black uppercase">
          Menus cargados
        </div>
      </div>
    </div>
  );
}
