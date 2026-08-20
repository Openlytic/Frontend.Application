'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Select, Alert, Steps, message } from 'antd';
import { UserOutlined, LockOutlined, BankOutlined, GlobalOutlined } from '@ant-design/icons';
import {
  requestForRegister,
  requestForCreateOrganization,
  requestForGetOrgSubDomainAvailability
} from '@/helpers/restApiRequests';
import { getSignupUser, clearSignupUser, setTokens } from '@/helpers/token';
import { getErrorMessage } from '@/helpers/errors';
import AuthShell from '@/components/auth/AuthShell';

interface ProfileFormValues {
  first_name: string;
  last_name?: string;
  password: string;
  confirm_password: string;
}

interface OrgFormValues {
  org_name: string;
  sub_domain: string;
  time_zone: string;
  country_code?: string;
  country?: string;
}

const LOCATION_PRESETS = [
  { country: 'United States', country_code: 'US', city: 'New York' },
  { country: 'United Kingdom', country_code: 'GB', city: 'London' },
  { country: 'India', country_code: 'IN', city: 'Bangalore' }
];

const CreateAccountPage = () => {
  const router = useRouter();
  const signupUser = getSignupUser();

  const [step, setStep] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [profileForm] = Form.useForm<ProfileFormValues>();
  const [orgForm] = Form.useForm<OrgFormValues>();

  React.useEffect(() => {
    if (!signupUser?.id) router.replace('/signup');
  }, [signupUser?.id, router]);

  if (!signupUser?.id) {
    return null;
  }

  const handleProfile = async () => {
    await profileForm.validateFields();
    setError(null);
    setStep(1);
    orgForm.setFieldsValue({ time_zone: 'UTC' });
  };

  const handleSubmitOrg = async () => {
    await orgForm.validateFields();
    setError(null);
    setLoading(true);
    try {
      const profile = profileForm.getFieldsValue();
      const org = orgForm.getFieldsValue();

      const { data: registerEnvelope } = await requestForRegister({
        email: signupUser.email,
        password: profile.password,
        first_name: profile.first_name,
        last_name: profile.last_name || '',
        is_verification_required: false
      });

      const locationPreset = LOCATION_PRESETS.find((p) => p.country_code === org.country_code);

      await requestForCreateOrganization({
        user_id: signupUser.id,
        org_name: org.org_name,
        sub_domain: org.sub_domain,
        time_zone: org.time_zone,
        location: {
          address: '1 Openlytic Way',
          city: locationPreset?.city || '',
          country: org.country || locationPreset?.country || '',
          country_code: org.country_code || locationPreset?.country_code || ''
        }
      });

      if (registerEnvelope.data?.access_token) {
        setTokens(registerEnvelope.data);
        clearSignupUser();
        message.success('Workspace created. Welcome to Openlytic!');
        router.push('/');
      } else {
        router.push('/login');
      }
    } catch (err) {
      setError(getErrorMessage(err) || 'Could not create your account');
    } finally {
      setLoading(false);
    }
  };

  const checkSubDomain = async (_: unknown, value: string) => {
    if (!value) {
      return Promise.reject(new Error('Choose a sub-domain'));
    }
    const slug = String(value).toLowerCase().replace(/[^a-z0-9-]/g, '-');
    if (slug !== value) {
      return Promise.reject(new Error('Use lowercase letters, numbers and dashes only'));
    }
    try {
      const { data } = await requestForGetOrgSubDomainAvailability(slug);
      return data.data?.is_available === false
        ? Promise.reject(new Error('That sub-domain is taken'))
        : Promise.resolve();
    } catch {
      return Promise.resolve();
    }
  };

  return (
    <AuthShell
      title="Set up your workspace"
      subtitle="A few details and you'll be ready to send your first tracked email."
    >
      <Steps
        current={step}
        size="small"
        className="mb-6"
        items={[{ title: 'Profile' }, { title: 'Workspace' }]}
      />

      {error && (
        <Alert type="error" message={error} showIcon closable onClose={() => setError(null)} className="mb-4" />
      )}

      {step === 0 && (
        <Form form={profileForm} layout="vertical" requiredMark={false} size="large">
          <div className="grid grid-cols-2 gap-3">
            <Form.Item name="first_name" rules={[{ required: true, message: 'First name required' }]}>
              <Input prefix={<UserOutlined />} placeholder="First name" />
            </Form.Item>
            <Form.Item name="last_name">
              <Input placeholder="Last name" />
            </Form.Item>
          </div>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Create a password' },
              { min: 6, message: 'At least 6 characters' }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item
            name="confirm_password"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Confirm your password' },
              ({ getFieldValue }) => ({
                validator: (_: unknown, value: string) =>
                  !value || getFieldValue('password') === value
                    ? Promise.resolve()
                    : Promise.reject(new Error('Passwords do not match'))
              })
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Confirm password" />
          </Form.Item>
          <Button type="primary" block size="large" onClick={handleProfile}>
            Continue
          </Button>
        </Form>
      )}

      {step === 1 && (
        <Form form={orgForm} layout="vertical" requiredMark={false} size="large">
          <Form.Item
            name="org_name"
            rules={[{ required: true, message: 'Enter a workspace name' }]}
          >
            <Input prefix={<BankOutlined />} placeholder="Workspace name" />
          </Form.Item>
          <Form.Item
            name="sub_domain"
            rules={[{ required: true, message: 'Choose a sub-domain' }, { validator: checkSubDomain }]}
          >
            <Input prefix={<GlobalOutlined />} placeholder="your-workspace" addonAfter=".openlytic.app" />
          </Form.Item>
          <div className="grid grid-cols-2 gap-3">
            <Form.Item name="time_zone" label="Time zone">
              <Select
                options={[
                  { value: 'UTC', label: 'UTC' },
                  { value: 'America/New_York', label: 'Eastern (US)' },
                  { value: 'Europe/London', label: 'London' },
                  { value: 'Asia/Kolkata', label: 'India (IST)' }
                ]}
              />
            </Form.Item>
            <Form.Item name="country_code" label="Country">
              <Select
                options={LOCATION_PRESETS.map((p) => ({ value: p.country_code, label: p.country }))}
                placeholder="Select"
              />
            </Form.Item>
          </div>
          <div className="flex gap-3">
            <Button block onClick={() => setStep(0)}>
              Back
            </Button>
            <Button type="primary" block size="large" loading={loading} onClick={handleSubmitOrg}>
              Create workspace
            </Button>
          </div>
        </Form>
      )}
    </AuthShell>
  );
};

export default CreateAccountPage;