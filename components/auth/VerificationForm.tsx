'use client';

import React from 'react';
import { Form, Input, Button, Alert, Typography } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { getErrorMessage } from '@/helpers/errors';

const { Text } = Typography;

const OTP_DIGITS = 6;

interface VerificationFormProps {
  email: string;
  onVerify: (token: string) => Promise<void>;
  onResend: () => Promise<void>;
  resendLoading: boolean;
  loading: boolean;
}

const VerificationForm = ({ email, onVerify, onResend, resendLoading, loading }: VerificationFormProps) => {
  const [error, setError] = React.useState<string | null>(null);
  const [resendSent, setResendSent] = React.useState(false);

  const handleVerify = async (values: { token: string }) => {
    setError(null);
    try {
      await onVerify(values.token.trim());
    } catch (err) {
      setError(getErrorMessage(err) || 'Verification failed');
    }
  };

  const handleResend = async () => {
    setError(null);
    try {
      await onResend();
      setResendSent(true);
    } catch (err) {
      setError(getErrorMessage(err) || 'Could not resend the code');
    }
  };

  return (
    <div>
      <div className="mb-5 flex items-center gap-3 rounded-xl border border-line bg-subtle/60 px-4 py-3">
        <MailOutlined className="text-brand text-lg" />
        <Text className="text-sm text-muted">
          Code sent to <span className="font-medium text-ink">{email}</span>
        </Text>
      </div>

      {error && (
        <Alert type="error" message={error} showIcon closable onClose={() => setError(null)} className="mb-4" />
      )}

      <Form layout="vertical" onFinish={handleVerify} requiredMark={false} size="large">
        <Form.Item
          name="token"
          rules={[{ required: true, message: 'Enter the verification code' }]}
        >
          <Input
            placeholder={`${OTP_DIGITS}-digit code`}
            inputMode="numeric"
            maxLength={OTP_DIGITS}
            autoComplete="one-time-code"
            className="!text-center tracking-[0.5em] !text-xl font-semibold"
          />
        </Form.Item>
        <Button type="primary" htmlType="submit" block size="large" loading={loading}>
          Verify
        </Button>
      </Form>

      <div className="mt-6 text-center text-sm text-muted">
        Didn&apos;t get it?{' '}
        <Button type="link" className="!p-0 !h-auto text-brand font-medium" loading={resendLoading} onClick={handleResend}>
          Resend code
        </Button>
      </div>
      {resendSent && <p className="mt-2 text-center text-xs text-muted">A new code is on its way.</p>}
    </div>
  );
};

export default VerificationForm;