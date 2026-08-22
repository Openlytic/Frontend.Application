"use client";

import React from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Tag,
  Empty,
  Skeleton,
  Tooltip,
  message,
} from "antd";
import {
  TeamOutlined,
  UserAddOutlined,
  LinkOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation } from "@apollo/client";
import dayjs from "dayjs";
import {
  GET_AN_ORGANIZATION,
  GET_ORGANIZATION_USERS,
  UPDATE_ORGANIZATION,
} from "@/utils/org.crud";
import { useOrgScope } from "@/components/org/OrgScopeProvider";
import { isMockMode, mockOrganization, mockOrgUsers } from "@/lib/mockData";
import type { MockOrganization, MockOrgUser } from "@/lib/mockData";

interface ProfileFormValues {
  org_name: string;
  sub_domain: string;
}

const ROLE_TAG: Record<string, { color: string; label: string }> = {
  admin: { color: "gold", label: "Admin" },
  manager: { color: "geekblue", label: "Manager" },
};

const MEMBER_STATUS_TAG: Record<string, { color: string; label: string }> = {
  active: { color: "success", label: "Active" },
  invited: { color: "processing", label: "Invited" },
  inactive: { color: "default", label: "Inactive" },
  cancelled: { color: "error", label: "Cancelled" },
};

const initialsOf = (member: MockOrgUser): string => {
  const name = `${member.first_name || ""} ${member.last_name || ""}`.trim();
  if (name)
    return name
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  return member.email.slice(0, 2).toUpperCase();
};

const SettingsPage = () => {
  const MOCK = isMockMode();
  const { activeOrgId } = useOrgScope();
  const [form] = Form.useForm<ProfileFormValues>();
  const [search, setSearch] = React.useState("");
  const [profileLoaded, setProfileLoaded] = React.useState(false);

  const { data: orgData, loading: orgLoading } = useQuery(GET_AN_ORGANIZATION, {
    variables: { queryData: { entity_id: activeOrgId } },
    fetchPolicy: "network-only",
    skip: !activeOrgId || MOCK,
  });

  const { data: membersData, loading: membersLoading } = useQuery(
    GET_ORGANIZATION_USERS,
    {
      variables: {
        queryData: search ? { search_keyword: search } : {},
        optionData: { limit: 50, offset: 0 },
      },
      fetchPolicy: "network-only",
      skip: MOCK,
    },
  );

  const [updateOrganization, { loading: saving }] =
    useMutation(UPDATE_ORGANIZATION);

  const org: MockOrganization | undefined = MOCK
    ? mockOrganization
    : orgData?.getAnOrganization;

  React.useEffect(() => {
    if (org && (!profileLoaded || MOCK)) {
      form.setFieldsValue({
        org_name: org.name || "",
        sub_domain: org.sub_domain || "",
      });
      setProfileLoaded(true);
    }
  }, [org, form, profileLoaded, MOCK]);

  const watched = Form.useWatch([], form);
  const dirty =
    !!org &&
    !!watched &&
    (watched.org_name !== (org.name || "") ||
      watched.sub_domain !== (org.sub_domain || ""));

  const members: MockOrgUser[] = MOCK
    ? mockOrgUsers
    : (membersData?.getOrganizationUsers?.data as MockOrgUser[] | undefined) ||
      [];

  const handleSave = async (values: ProfileFormValues) => {
    if (MOCK) {
      message.success("Workspace updated");
      return;
    }
    try {
      await updateOrganization({
        variables: {
          queryData: { entity_id: activeOrgId },
          inputData: {
            ...(values.org_name !== org?.name
              ? { org_name: values.org_name }
              : {}),
            ...(values.sub_domain !== org?.sub_domain
              ? { sub_domain: values.sub_domain }
              : {}),
          },
        },
      });
      message.success("Workspace updated");
    } catch (error) {
      message.error(
        (error as Error)?.message?.replace(/^.*:\s*/, "") ||
          "Failed to update workspace",
      );
    }
  };

  return (
    <div className="animate-fade-up">
      <div>
        <h1 className="font-poppins text-2xl font-semibold text-ink tracking-tight">
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted">
          Manage your workspace profile and the people in your organization.
        </p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-5">
        <Card
          className="rounded-2xl shadow-card lg:col-span-3"
          title="Workspace profile"
          styles={{ body: { paddingTop: 8 } }}
        >
          {!MOCK && orgLoading ? (
            <Skeleton active paragraph={{ rows: 4 }} />
          ) : !org ? (
            <Empty
              description="Workspace not found"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              className="py-10"
            />
          ) : (
            <>
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSave}
                requiredMark={false}
              >
                <Form.Item
                  name="org_name"
                  label="Organization name"
                  rules={[
                    {
                      required: true,
                      message: "Organization name is required",
                    },
                  ]}
                >
                  <Input
                    placeholder="Acme Inc."
                    size="large"
                    className="rounded-xl"
                  />
                </Form.Item>
                <Form.Item
                  name="sub_domain"
                  label="Sub-domain"
                  tooltip="Part of your workspace URLs — changing it may affect existing links"
                  rules={[
                    { required: true, message: "Sub-domain is required" },
                    {
                      pattern: /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
                      message: "Lowercase letters, numbers and hyphens only",
                    },
                  ]}
                >
                  <Input
                    addonBefore={<LinkOutlined />}
                    addonAfter=".openlytic.app"
                    size="large"
                  />
                </Form.Item>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-muted">
                    Created {dayjs(org.created_at).format("MMM D, YYYY")} ·{" "}
                    <Tag className="!border-none rounded-full capitalize">
                      {org.status}
                    </Tag>
                  </p>
                  <Tooltip title={dirty ? "" : "No changes to save"}>
                    <Button
                      type="primary"
                      size="large"
                      htmlType="submit"
                      loading={saving}
                      disabled={!dirty}
                      className="shadow-card"
                    >
                      Save changes
                    </Button>
                  </Tooltip>
                </div>
              </Form>

              <div className="mt-4 rounded-xl bg-subtle px-4 py-3 text-xs text-muted">
                Members sign in at{" "}
                <span className="text-brand">
                  {org.sub_domain}.openlytic.app
                </span>{" "}
                — every email sent from this workspace is tracked under it.
              </div>
            </>
          )}
        </Card>

        <Card
          className="rounded-2xl shadow-card lg:col-span-2"
          title={
            <span className="inline-flex items-center gap-2">
              <TeamOutlined /> Members
            </span>
          }
          extra={
            <Tooltip title="Invitations are coming soon">
              <Button size="small" icon={<UserAddOutlined />} disabled>
                Invite
              </Button>
            </Tooltip>
          }
          styles={{ body: { paddingTop: 8 } }}
        >
          <Input
            allowClear
            prefix={<SearchOutlined className="text-muted" />}
            placeholder="Search members"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl"
          />

          <div className="mt-3">
            {!MOCK && membersLoading ? (
              <Skeleton active paragraph={{ rows: 5 }} />
            ) : members.length === 0 ? (
              <Empty
                description="No members found"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                className="py-8"
              />
            ) : (
              members.map((member) => {
                const role = ROLE_TAG[member.role] || {
                  color: "default",
                  label: member.role,
                };
                const status = MEMBER_STATUS_TAG[member.status] || {
                  color: "default",
                  label: member.status,
                };
                return (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 border-b border-gray-100 py-3 last:border-none"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-xs font-semibold text-white">
                      {initialsOf(member)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-ink">
                        {[member.first_name, member.last_name]
                          .filter(Boolean)
                          .join(" ") || member.email}
                      </p>
                      <p className="truncate text-xs text-muted">
                        {member.email}
                      </p>
                    </div>
                    <Tag
                      color={role.color}
                      className="!border-none rounded-full"
                    >
                      {role.label}
                    </Tag>
                    <Tag
                      color={status.color}
                      className="!border-none rounded-full"
                    >
                      {status.label}
                    </Tag>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
