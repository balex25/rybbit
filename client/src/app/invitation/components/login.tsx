"use client";

import { useTurnstile } from "@/hooks/useTurnstile";
import { Turnstile } from "@/components/auth/Turnstile";

import { useExtracted } from "next-intl";
import { useState } from "react";
import { authClient } from "../../../lib/auth";
import { userStore } from "../../../lib/userStore";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthButton } from "@/components/auth/AuthButton";
import { AuthError } from "@/components/auth/AuthError";
import { SocialButtons } from "@/components/auth/SocialButtons";

interface LoginProps {
  callbackURL: string;
}

export function Login({ callbackURL }: LoginProps) {
  const t = useExtracted();
  const { turnstileToken, setTurnstileToken, turnstileResetKey, turnstileEnabled, turnstilePending, resetTurnstile } =
    useTurnstile();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (turnstilePending || (turnstileEnabled && !turnstileToken)) {
      setError(t("Please complete the captcha verification"));
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await authClient.signIn.email(
        {
          email,
          password,
        },
        {
          onRequest: context => {
            if (turnstileEnabled && turnstileToken) context.headers.set("x-captcha-response", turnstileToken);
          },
        }
      );

      if (data?.user) {
        userStore.setState({
          user: data.user,
        });
        // Force reload to show the AcceptInvitationInner component
        window.location.reload();
      }

      if (error) {
        setError(error.message || t("An error occurred during login"));
      }
    } catch (error) {
      setError(String(error));
    } finally {
      resetTurnstile();
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div className="flex flex-col gap-4">
        <SocialButtons onError={setError} callbackURL={callbackURL} />
        <AuthInput
          id="email"
          label={t("Email")}
          type="email"
          placeholder="example@email.com"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <AuthInput
          id="password"
          label={t("Password")}
          type="password"
          placeholder="••••••••"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {turnstileEnabled && (
          <Turnstile
            key={turnstileResetKey}
            onSuccess={setTurnstileToken}
            onError={() => setTurnstileToken("")}
            onExpire={() => setTurnstileToken("")}
            className="flex justify-center"
          />
        )}
        <AuthButton
          isLoading={isLoading}
          loadingText={t("Logging in...")}
          disabled={isLoading || turnstilePending || (turnstileEnabled && !turnstileToken)}
        >
          {t("Login to Accept Invitation")}
        </AuthButton>
        <AuthError error={error} />
      </div>
    </form>
  );
}
