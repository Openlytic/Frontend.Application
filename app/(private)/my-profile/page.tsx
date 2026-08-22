"use client";

import React from "react";
import { Card, Form, Input, Button, Tag, Skeleton, Alert, message } from "antd";
import {
  MailOutlined,
  LockOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { useOrgScope } from "@/components/org/OrgScopeProvider";
import {
  requestForGetUser,
  requestForChangeEmail,
  requestForChangePassword,
  type UserData,
} from "@/helpers/restApiRequests";
import { isMockMode, mockOrganization, mockUser } from "@/lib/mockData";

interface PasswordFormValues {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

interface EmailFormValues {
  new_email: string;
}

const STATUS_TAG: Record<string, { color: string; label: string }> = {
  active: { color: "success", label: "Active" },
  invited: { color: "processing", label: "Invited" },
  inactive: { color: "default", label: "Inactive" },
  cancelled: { color: "error", label: "Cancelled" },
};

const ROLE_TAG: Record<string, string> = {
  admin: "gold",
  manager: "geekblue",
  org_owner: "purple",
};

const MyProfilePage = () => {
  const MOCK = isMockMode();
  const { organizations, activeOrgId } = useOrgScope();
  const [passwordForm] = Form.useForm<PasswordFormValues>();
  const [emailForm] = Form.useForm<EmailFormValues>();
  const [user, setUser] = React.useState<UserData | null>(null);
  const [loading, setLoading] = React.useState(!MOCK);
  const [changingPassword, setChangingPassword] = React.useState(false);
  const [changingEmail, setChangingEmail] = React.useState(false);
  const [pendingNewEmail, setPendingNewEmail] = React.useState<string | null>(
    null,
  );

  React.useEffect(() => {
    if (MOCK) {
      setUser(mockUser as unknown as UserData);
      return;
    }
    let cancelled = false;
    requestForGetUser()
      .then(({ data }) => {
        if (!cancelled) setUser(data.data);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [MOCK]);

  const fullName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.email ||
    "";
  const initials =
    fullName
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";
  const status = STATUS_TAG[user?.status || "active"] || {
    color: "default",
    label: user?.status,
  };

  const memberships = MOCK
    ? [
        {
          org_id: mockOrganization.id,
          name: mockOrganization.name,
          sub_domain: mockOrganization.sub_domain,
          role: "admin",
        },
      ]
    : organizations;

  const handleChangePassword = async (values: PasswordFormValues) => {
    if (MOCK) {
      message.success("Password updated");
      passwordForm.resetFields();
      return;
    }
    setChangingPassword(true);
    try {
      await requestForChangePassword({
        old_password: values.old_password,
        new_password: values.new_password,
      });
      message.success("Password updated");
      passwordForm.resetFields();
    } catch (error) {
      message.error(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to update password",
      );
    } finally {
      setChangingPassword(false);
    }
  };

  const handleChangeEmail = async (values: EmailFormValues) => {
    if (MOCK) {
      setPendingNewEmail(values.new_email);
      emailForm.resetFields();
      return;
    }
    setChangingEmail(true);
    try {
      await requestForChangeEmail({
        email: user?.email || "",
        new_email: values.new_email,
      });
      setPendingNewEmail(values.new_email);
      emailForm.resetFields();
    } catch (error) {
      message.error(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to start email change",
      );
    } finally {
      setChangingEmail(false);
    }
  };

  return (
    <div className="animate-fade-up">
      <div>
        <h1 className="font-poppins text-2xl font-semibold text-ink tracking-tight">
          My profile
        </h1>
        <p className="mt-1 text-sm text-muted">
          Your personal details, sign-in security and workspace memberships.
        </p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-3">
          <Card
            title="Personal info"
            className="rounded-2xl shadow-card"
            styles={{ body: { paddingTop: 8 } }}
          >
            {loading ? (
              <Skeleton avatar active paragraph={{ rows: 2 }} />
            ) : (
              <>
                <div className="flex items-center gap-4 py-2">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 text-lg font-semibold text-white">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-poppins text-lg font-semibold text-ink">
                      {fullName}
                    </p>
                    <p className="flex items-center gap-1.5 truncate text-sm text-muted">
                      <MailOutlined /> {user?.email}
                    </p>
                  </div>
                  <Tag
                    color={status.color}
                    className="!ml-auto !border-none rounded-full capitalize"
                  >
                    {status.label}
                  </Tag>
                </div>

                <div className="mt-2 grid gap-x-6 rounded-xl bg-subtle px-4 py-3 text-xs text-muted sm:grid-cols-2">
                  <p>
                    First name ·{" "}
                    <span className="text-ink">{user?.first_name || "—"}</span>
                  </p>
                  <p>
                    Last name ·{" "}
                    <span className="text-ink">{user?.last_name || "—"}</span>
                  </p>
                </div>
              </>
            )}
          </Card>

          <Card
            title={
              <span className="inline-flex items-center gap-2">
                <SafetyCertificateOutlined /> Security
              </span>
            }
            className="rounded-2xl shadow-card"
            styles={{ body: { paddingTop: 8 } }}
          >
            {pendingNewEmail && (
              <Alert
                type="info"
                showIcon
                className="!mb-5 rounded-xl"
                message={`Verification sent to ${pendingNewEmail}`}
                description="Confirm your new address from the link in that inbox to finish switching your sign-in email."
              />
            )}

            <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-ink">
              <LockOutlined /> Change password
            </h3>
            <Form
              form={passwordForm}
              layout="vertical"
              requiredMark={false}
              onFinish={handleChangePassword}
              className="max-w-md"
            >
              <Form.Item
                name="old_password"
                label="Current password"
                rules={[
                  { required: true, message: "Current password is required" },
                ]}
              >
                <Input.Password
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </Form.Item>
              <Form.Item
                name="new_password"
                label="New password"
                rules={[
                  { required: true, message: "New password is required" },
                  { min: 8, message: "Use at least 8 characters" },
                ]}
              >
                <Input.Password
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                />
              </Form.Item>
              <Form.Item
                name="confirm_password"
                label="Confirm new password"
                dependencies={["new_password"]}
                rules={[
                  {
                    required: true,
                    message: "Please confirm the new password",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("new_password") === value)
                        return Promise.resolve();
                      return Promise.reject(
                        new Error("Passwords do not match"),
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  placeholder="Repeat new password"
                  autoComplete="new-password"
                />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={changingPassword}
                className="shadow-card"
              >
                Update password
              </Button>
            </Form>

            <div className="my-6 border-t border-gray-100" />

            <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-ink">
              <MailOutlined /> Change email
            </h3>
            <Form
              form={emailForm}
              layout="vertical"
              requiredMark={false}
              onFinish={handleChangeEmail}
              className="max-w-md"
            >
              <Form.Item label="Current email">
                <Input value={user?.email || ""} disabled />
              </Form.Item>
              <Form.Item
                name="new_email"
                label="New email"
                rules={[
                  { required: true, message: "New email is required" },
                  { type: "email", message: "Enter a valid email address" },
                  {
                    validator(_, value) {
                      if (
                        !value ||
                        value.toLowerCase() !==
                          (user?.email || "").toLowerCase()
                      )
                        return Promise.resolve();
                      return Promise.reject(
                        new Error("New email must be different"),
                      );
                    },
                  },
                ]}
              >
                <Input placeholder="you@company.com" autoComplete="email" />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={changingEmail}
                className="shadow-card"
              >
                Send verification
              </Button>
            </Form>
          </Card>
        </div>

        <Card
          title={
            <span className="inline-flex items-center gap-2">
              <TeamOutlined /> Workspaces
            </span>
          }
          className="rounded-2xl shadow-card self-start lg:col-span-2"
          styles={{ body: { paddingTop: 8 } }}
        >
          {memberships.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted">
              No workspace memberships
            </p>
          ) : (
            memberships.map((membership) => (
              <div
                key={membership.org_id}
                className={`rounded-xl border px-4 py-3 ${
                  membership.org_id === activeOrgId
                    ? "border-brand/30 bg-brand/5"
                    : "border-gray-100"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate font-medium text-ink">
                    {membership.name}
                  </p>
                  {membership.org_id === activeOrgId ? (
                    <Tag
                      color="processing"
                      className="!border-none rounded-full"
                    >
                      Current
                    </Tag>
                  ) : null}
                </div>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <p className="truncate text-xs text-muted">
                    {membership.sub_domain}.openlytic.app
                  </p>
                  <Tag
                    color={ROLE_TAG[membership.role] || "default"}
                    className="!border-none rounded-full capitalize"
                  >
                    {membership.role.replace("_", " ")}
                  </Tag>
                </div>
              </div>
            ))
          )}
        </Card>
      </div>
    </div>
  );
};

export default MyProfilePage;
