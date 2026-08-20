"use client";

import React from "react";
import { useSelector } from "react-redux";
import { useQuery, useMutation } from "@apollo/client";
import { Modal, Form, Input, Select, Switch, message } from "antd";
import type { RootState } from "@/redux/store";
import { GET_ORGANIZATION_USERS } from "@/utils/org.crud";
import { CREATE_EMAIL } from "@/utils/emails.crud";
import { isMockMode, mockOrgUsers, mockUser } from "@/lib/mockData";
import type { MockEmail, MockOrgUser, MockRecipient } from "@/lib/mockData";

interface ComposeModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (email: MockEmail) => void;
}

interface FormValues {
  to: string[];
  cc?: string[];
  subject?: string;
  body_html?: string;
  tracking_enabled?: boolean;
}

const buildRecipients = (
  emails: string[],
  orgUsers: MockOrgUser[],
  type: string,
): MockRecipient[] =>
  emails.map((email) => {
    const member = orgUsers.find((item) => item.email === email);
    return {
      id: member?.id ?? email,
      email,
      type,
    };
  });

const buildApiRecipients = (
  emails: string[],
  orgUsers: MockOrgUser[],
): Record<string, string>[] =>
  emails.map((email) => {
    const member = orgUsers.find((item) => item.email === email);
    return {
      email,
      ...(member?.id ? { org_user_id: member.id } : {}),
    };
  });

const ComposeModal = ({ open, onClose, onCreated }: ComposeModalProps) => {
  const MOCK = isMockMode();
  const [form] = Form.useForm<FormValues>();
  const authUser = useSelector((state: RootState) => state.auth.user);
  const senderEmail = MOCK ? mockUser.email : authUser?.email || "you";

  const { data: orgUsersData, loading: orgUsersLoading } = useQuery(
    GET_ORGANIZATION_USERS,
    {
      variables: { optionData: { limit: 100 } },
      fetchPolicy: "network-only",
      skip: MOCK,
    },
  );

  const [createEmail, { loading: creating }] = useMutation(CREATE_EMAIL);

  const orgUsers: MockOrgUser[] = MOCK
    ? mockOrgUsers
    : (orgUsersData?.getOrganizationUsers?.data as MockOrgUser[] | undefined) ||
      [];

  const recipientOptions = orgUsers.map((member) => ({
    value: member.email,
    label:
      [member.first_name, member.last_name].filter(Boolean).join(" ") ||
      member.email,
  }));

  React.useEffect(() => {
    if (!open) form.resetFields();
  }, [open, form]);

  const handleFinish = async (values: FormValues) => {
    const to = values.to || [];
    const cc = values.cc || [];
    const trackingEnabled = values.tracking_enabled !== false;

    const email: MockEmail = {
      id: `e-${Date.now()}`,
      subject: values.subject || "No subject",
      snippet: values.body_html
        ? values.body_html.replace(/<[^>]*>/g, " ").slice(0, 80)
        : "",
      stage: "sent",
      tracking_enabled: trackingEnabled,
      is_read: false,
      is_trashed: false,
      sent_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      to: buildRecipients(to, orgUsers, "to"),
      cc: buildRecipients(cc, orgUsers, "cc"),
      body_html: values.body_html,
    };

    if (MOCK) {
      onCreated(email);
      message.success("Email created");
      onClose();
      return;
    }

    try {
      const result = await createEmail({
        variables: {
          inputData: {
            to: buildApiRecipients(to, orgUsers),
            cc: buildApiRecipients(cc, orgUsers),
            subject: values.subject,
            body_html: values.body_html,
            tracking_enabled: trackingEnabled,
          },
        },
      });
      onCreated({ ...email, id: result?.data?.createEmail?.id || email.id });
      message.success("Email created");
      onClose();
    } catch {
      message.error("Failed to create email");
    }
  };

  return (
    <Modal
      open={open}
      title="Compose email"
      okText={creating ? "Sending…" : "Send"}
      onOk={() => form.submit()}
      confirmLoading={creating}
      onCancel={onClose}
      width={640}
      okButtonProps={{ className: "shadow-card" }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ tracking_enabled: true }}
        className="mt-2"
      >
        <div className="mb-4 rounded-xl bg-subtle px-4 py-2.5 text-sm text-ink">
          From: <span className="font-medium">{senderEmail}</span>
        </div>

        <Form.Item
          name="to"
          label="To"
          rules={[{ required: true, message: "Add at least one recipient" }]}
        >
          <Select
            mode="multiple"
            placeholder="Select workspace members"
            options={recipientOptions}
            loading={orgUsersLoading}
            optionFilterProp="label"
            className="rounded-xl"
            size="large"
          />
        </Form.Item>

        <Form.Item name="cc" label="Cc">
          <Select
            mode="multiple"
            placeholder="Optional"
            options={recipientOptions}
            loading={orgUsersLoading}
            optionFilterProp="label"
            className="rounded-xl"
            size="large"
          />
        </Form.Item>

        <Form.Item name="subject" label="Subject">
          <Input
            placeholder="What is this email about?"
            className="rounded-xl"
            size="large"
          />
        </Form.Item>

        <Form.Item name="body_html" label="Message">
          <Input.TextArea
            rows={8}
            placeholder="Write your message…"
            className="rounded-xl"
          />
        </Form.Item>

        <Form.Item
          name="tracking_enabled"
          label="Tracking"
          valuePropName="checked"
        >
          <Switch checkedChildren="On" unCheckedChildren="Off" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ComposeModal;
