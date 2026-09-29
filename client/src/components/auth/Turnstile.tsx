"use client";

import { Turnstile as CloudflareTurnstile, TurnstileInstance } from "@marsidev/react-turnstile";
import { useTheme } from "next-themes";
import { useRef } from "react";
import { useConfigs } from "@/lib/configs";

interface TurnstileProps {
  onSuccess: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  className?: string;
}

export function Turnstile({ onSuccess, onError, onExpire, className = "" }: TurnstileProps) {
  const turnstileRef = useRef<TurnstileInstance>(null);
  const { configs } = useConfigs();
  const siteKey = configs?.turnstileSiteKey;
  const { theme } = useTheme();

  if (!siteKey) {
    return null;
  }

  return (
    <div className={className}>
      <CloudflareTurnstile
        ref={turnstileRef}
        siteKey={siteKey}
        onSuccess={onSuccess}
        onError={() => {
          console.error("Turnstile error");
          onError?.();
        }}
        onExpire={() => {
          console.warn("Turnstile token expired");
          onExpire?.();
        }}
        options={{
          theme: theme === "dark" ? "dark" : "auto",
          size: "normal",
        }}
      />
    </div>
  );
}
