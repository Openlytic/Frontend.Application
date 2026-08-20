"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Result, Button } from "antd";
import {
  requestForVerify,
  requestForResendOtp,
  requestForVerifyForgotPassCode,
  requestForRetryForgotPassword,
} from "@/helpers/restApiRequests";
import { getSignupUser, getResetEmail, setResetToken } from "@/helpers/token";
import AuthShell from "@/components/auth/AuthShell";
import VerificationForm from "@/components/auth/VerificationForm";

const AccountVerificationPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const signupUser = getSignupUser();
  const resetEmail = getResetEmail();

  const email = mode === "forgot" ? resetEmail : (signupUser?.email ?? null);
  const userId = mode === "forgot" ? null : (signupUser?.id ?? null);

  const [loading, setLoading] = React.useState(false);
  const [resendLoading, setResendLoading] = React.useState(false);

  const onVerify = async (token: string) => {
    setLoading(true);
    try {
      if (mode === "forgot") {
        await requestForVerifyForgotPassCode({ email: email as string, token });
        setResetToken(token);
        router.push("/create-new-password");
      } else {
        await requestForVerify({ user_id: userId as string, token });
        router.push("/create-account");
      }
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    setResendLoading(true);
    try {
      if (mode === "forgot") {
        await requestForRetryForgotPassword({ email: email as string });
      } else {
        await requestForResendOtp({ email: email as string, user_id: userId });
      }
    } finally {
      setResendLoading(false);
    }
  };

  if (!email) {
    return (
      <AuthShell title="Verify your email">
        <Result
          status="info"
          title="Missing verification context"
          subTitle="Start the flow again to get a fresh verification code."
          extra={
            <Button
              type="primary"
              onClick={() =>
                router.push(mode === "forgot" ? "/forgot-password" : "/signup")
              }
            >
              Start over
            </Button>
          }
        />
      </AuthShell>
    );
  }

  const title = mode === "forgot" ? "Check your email" : "Verify your email";
  const subtitle =
    mode === "forgot"
      ? "Enter the code we sent to reset your password."
      : "Enter the code we sent to confirm your email address.";

  return (
    <AuthShell title={title} subtitle={subtitle}>
      <VerificationForm
        email={email}
        onVerify={onVerify}
        onResend={onResend}
        loading={loading}
        resendLoading={resendLoading}
      />
    </AuthShell>
  );
};

export default AccountVerificationPage;
