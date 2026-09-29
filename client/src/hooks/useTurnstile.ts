import { useState } from "react";
import { useConfigs } from "@/lib/configs";

export function useTurnstile() {
  const { configs, isLoading, error } = useConfigs();
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const turnstileEnabled = Boolean(configs?.turnstileSiteKey);
  const turnstilePending = isLoading || Boolean(error) || !configs;

  const resetTurnstile = () => {
    setTurnstileToken("");
    setTurnstileResetKey(key => key + 1);
  };

  return { turnstileToken, setTurnstileToken, turnstileResetKey, turnstileEnabled, turnstilePending, resetTurnstile };
}
