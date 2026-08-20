"use client";

import React from "react";
import { Form, Input, Button, Alert } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useRouter, useSearchParams } from "next/navigation";
import { requestForLogin } from "@/helpers/restApiRequests";
import { setTokens } from "@/helpers/token";
import { getErrorMessage } from "@/helpers/errors";
import AuthShell, { AuthFooterLink } from "@/components/auth/AuthShell";

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values: LoginFormValues) => {
    setError(null);
    setLoading(true);
    try {
      const { data } = await requestForLogin({
        email: values.email,
        password: values.password,
      });
      setTokens(data.data);
      const from = searchParams.get("from");
      router.push(from || "/");
    } catch (err) {
      setError(getErrorMessage(err) || "Unable to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your Openlytic workspace and pick up where you left off."
      footer={
        <AuthFooterLink
          text="Don't have an account?"
          href="/signup"
          label="Sign up"
        />
      }
    >
      {error && (
        <Alert
          type="error"
          message={error}
          showIcon
          closable
          onClose={() => setError(null)}
          className="mb-4"
        />
      )}
      <Form
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
        size="large"
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Enter a valid email" },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email address" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>
        <div className="flex justify-end -mt-2 mb-5">
          <span
            className="text-sm text-brand hover:text-brand-hover cursor-pointer"
            onClick={() => router.push("/forgot-password")}
          >
            Forgot password?
          </span>
        </div>
        <Button
          type="primary"
          htmlType="submit"
          block
          size="large"
          loading={loading}
        >
          Sign in
        </Button>
      </Form>
    </AuthShell>
  );
};

export default LoginPage;
