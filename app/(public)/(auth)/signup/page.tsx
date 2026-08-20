"use client";

import React from "react";
import { Form, Input, Button, Alert } from "antd";
import { MailOutlined, UserOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { requestForPreRegister } from "@/helpers/restApiRequests";
import { setSignupUser } from "@/helpers/token";
import { getErrorMessage } from "@/helpers/errors";
import AuthShell, { AuthFooterLink } from "@/components/auth/AuthShell";

interface SignUpFormValues {
  email: string;
  first_name: string;
  last_name?: string;
}

const SignUpPage = () => {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values: SignUpFormValues) => {
    setError(null);
    setLoading(true);
    try {
      const { data } = await requestForPreRegister({
        email: values.email,
        first_name: values.first_name,
        last_name: values.last_name,
      });
      setSignupUser({ id: data.data.user.id, email: data.data.user.email });
      router.push("/account-verification");
    } catch (err) {
      setError(getErrorMessage(err) || "Unable to start sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start tracking opens and clicks on your emails in minutes."
      footer={
        <AuthFooterLink
          text="Already have an account?"
          href="/login"
          label="Sign in"
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
        <div className="grid grid-cols-2 gap-3">
          <Form.Item
            name="first_name"
            rules={[{ required: true, message: "First name required" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="First name" />
          </Form.Item>
          <Form.Item name="last_name">
            <Input placeholder="Last name" />
          </Form.Item>
        </div>
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Enter a valid email" },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email address" />
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          block
          size="large"
          loading={loading}
        >
          Continue
        </Button>
      </Form>
    </AuthShell>
  );
};

export default SignUpPage;
