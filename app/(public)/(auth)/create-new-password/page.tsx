'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Alert, Result } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { requestForVerifyForgotPass } from '@/helpers/restApiRequests';
import { getResetEmail, getResetToken, clearResetEmail, clearResetToken } from '@/helpers/token';
import { getErrorMessage } from '@/helpers/errors';
import AuthShell from '@/components/auth/AuthShell';

interface CreateNewPasswordFormValues {
  password: string;
  confirm_password: string;
}

const CreateNewPasswordPage = () => {
  const router = useRouter();
  const email = getResetEmail();
  const token = getResetToken();

  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values: CreateNewPasswordFormValues) => {
    setError(null);
    setLoading(true);
    try {
      await requestForVerifyForgotPass({
        email: email as string,
        password: values.password,
        token: token as string
      });
      clearResetEmail();
      clearResetToken();
      router.push('/login');
    } catch (err) {
      setError(getErrorMessage(err) || 'Could not reset your password');
    } finally {
      setLoading(false);
    }
  };

  if (!email || !token) {
    return (
      <AuthShell title="Reset your password">
        <Result
          status="info"
          title="No reset in progress"
          subTitle="Request a new verification code to continue."
          extra={
            <Button type="primary" onClick={() => router.push('/forgot-password')}>
              Start over
            </Button>
          }
        />
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create a new password"
      subtitle={`Set a new password for ${email}.`}
    >
      {error && (
        <Alert type="error" message={error} showIcon closable onClose={() => setError(null)} className="mb-4" />
      )}
      <Form layout="vertical" onFinish={onFinish} requiredMark={false} size="large">
        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Create a new password' },
            { min: 6, message: 'At least 6 characters' }
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="New password" />
        </Form.Item>
        <Form.Item
          name="confirm_password"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Confirm your new password' },
            ({ getFieldValue }) => ({
              validator: (_: unknown, value: string) =>
                !value || getFieldValue('password') === value
                  ? Promise.resolve()
                  : Promise.reject(new Error('Passwords do not match'))
            })
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Confirm new password" />
        </Form.Item>
        <Button type="primary" htmlType="submit" block size="large" loading={loading}>
          Reset password
        </Button>
      </Form>
    </AuthShell>
  );
};

export default CreateNewPasswordPage;