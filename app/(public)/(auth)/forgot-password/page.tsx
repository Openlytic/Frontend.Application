'use client';

import React from 'react';
import { Form, Input, Button, Alert } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { requestForForgotPassword } from '@/helpers/restApiRequests';
import { setResetEmail } from '@/helpers/token';
import { getErrorMessage } from '@/helpers/errors';
import AuthShell, { AuthFooterLink } from '@/components/auth/AuthShell';

interface ForgotPasswordFormValues {
  email: string;
}

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values: ForgotPasswordFormValues) => {
    setError(null);
    setLoading(true);
    try {
      await requestForForgotPassword({ email: values.email });
      setResetEmail(values.email);
      router.push('/account-verification?mode=forgot');
    } catch (err) {
      setError(getErrorMessage(err) || 'Unable to send reset code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter your email and we'll send you a one-time verification code."
      footer={<AuthFooterLink text="Remembered it?" href="/login" label="Back to sign in" />}
    >
      {error && (
        <Alert type="error" message={error} showIcon closable onClose={() => setError(null)} className="mb-4" />
      )}
      <Form layout="vertical" onFinish={onFinish} requiredMark={false} size="large">
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Please enter your email' }, { type: 'email', message: 'Enter a valid email' }]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email address" />
        </Form.Item>
        <Button type="primary" htmlType="submit" block size="large" loading={loading}>
          Send verification code
        </Button>
      </Form>
    </AuthShell>
  );
};

export default ForgotPasswordPage;