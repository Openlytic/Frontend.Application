"use client";

import React from "react";
import Link from "next/link";
import { Card, Select, Table, Empty, Skeleton } from "antd";
import {
  EyeOutlined,
  ThunderboltOutlined,
  MailOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  PaperClipOutlined,
  ClockCircleOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import dayjs from "dayjs";
import {
  GET_EMAIL_ANALYTICS,
  GET_EMAIL_TRACKING_EVENTS,
} from "@/utils/analytics.crud";
import { GET_EMAILS } from "@/utils/emails.crud";
import EmailStatusTag, { STATUS_TAG } from "@/components/email/EmailStatusTag";
import {
  isMockMode,
  mockAnalytics,
  mockEmails,
  mockTrackingEvents,
} from "@/lib/mockData";
import type {
  MockAnalytic,
  MockEmail,
  MockTrackingEvent,
} from "@/lib/mockData";
import type { ColumnsType } from "antd/es/table";

const STATUS_OPTIONS = Object.entries(STATUS_TAG).map(([value, config]) => ({
  value,
  label: config.label,
}));

const ISSUE_STATUSES = ["bounced", "complained", "rejected", "failed"];

interface EventMeta {
  icon: React.ReactNode;
  color: string;
  label: string;
}

const EVENT_META: Record<string, EventMeta> = {
  delivered: {
    icon: <CheckCircleOutlined />,
    color: "#10B981",
    label: "Delivered",
  },
  open: { icon: <EyeOutlined />, color: "#4F46E5", label: "Opened" },
  click: { icon: <ThunderboltOutlined />, color: "#8B5CF6", label: "Clicked" },
  attachment_viewed: {
    icon: <PaperClipOutlined />,
    color: "#0EA5E9",
    label: "Attachment viewed",
  },
  bounce_permanent: {
    icon: <WarningOutlined />,
    color: "#EF4444",
    label: "Permanent bounce",
  },
  bounce_transient: {
    icon: <ClockCircleOutlined />,
    color: "#F59E0B",
    label: "Transient bounce",
  },
  complaint: {
    icon: <WarningOutlined />,
    color: "#EF4444",
    label: "Complained",
  },
  reject: { icon: <WarningOutlined />, color: "#EF4444", label: "Rejected" },
  delivery_delayed: {
    icon: <ClockCircleOutlined />,
    color: "#F59E0B",
    label: "Delivery delayed",
  },
};

const AnalyticsPage = () => {
  const MOCK = isMockMode();
  const [status, setStatus] = React.useState<string | undefined>(undefined);
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  const { data: tableData, loading: tableLoading } = useQuery(
    GET_EMAIL_ANALYTICS,
    {
      variables: {
        queryData: status ? { status } : {},
        optionData: { limit: pageSize, offset: (page - 1) * pageSize },
      },
      fetchPolicy: "network-only",
      skip: MOCK,
    },
  );

  const { data: kpiData, loading: kpiLoading } = useQuery(GET_EMAIL_ANALYTICS, {
    variables: { queryData: {}, optionData: { limit: 100, offset: 0 } },
    fetchPolicy: "network-only",
    skip: MOCK,
  });

  const { data: emailsData } = useQuery(GET_EMAILS, {
    variables: { optionData: { limit: 100, offset: 0 } },
    fetchPolicy: "network-only",
    skip: MOCK,
  });

  const { data: eventsData, loading: eventsLoading } = useQuery(
    GET_EMAIL_TRACKING_EVENTS,
    {
      variables: { optionData: { limit: 8, offset: 0 } },
      fetchPolicy: "network-only",
      skip: MOCK,
    },
  );

  const rows: MockAnalytic[] = MOCK
    ? mockAnalytics.filter((a) => !status || a.status === status)
    : (tableData?.getEmailAnalytics?.data as MockAnalytic[] | undefined) || [];
  const total = MOCK
    ? rows.length
    : tableData?.getEmailAnalytics?.meta_data?.filtered_rows || 0;

  const kpiAnalytics: MockAnalytic[] = MOCK
    ? mockAnalytics
    : (kpiData?.getEmailAnalytics?.data as MockAnalytic[] | undefined) || [];
  const tracked = MOCK
    ? mockAnalytics.length
    : kpiData?.getEmailAnalytics?.meta_data?.filtered_rows || 0;
  const opened = kpiAnalytics.filter((a) => a.open_count > 0).length;
  const clicked = kpiAnalytics.filter((a) => a.click_count > 0).length;
  const issues = kpiAnalytics.filter((a) =>
    ISSUE_STATUSES.includes(a.status),
  ).length;
  const pct = (n: number) =>
    tracked ? `${Math.round((n / tracked) * 100)}%` : "—";

  const emails: MockEmail[] = MOCK
    ? mockEmails
    : (emailsData?.getEmails?.data as MockEmail[] | undefined) || [];
  const subjectById = new Map(emails.map((email) => [email.id, email.subject]));

  const events: MockTrackingEvent[] = MOCK
    ? mockTrackingEvents
    : (eventsData?.getEmailTrackingEvents?.data as
        MockTrackingEvent[] | undefined) || [];

  const statCards = [
    {
      title: "Tracked emails",
      value:
        kpiLoading && !MOCK ? (
          <Skeleton.Input active size="small" className="!w-14" />
        ) : (
          tracked
        ),
      icon: <MailOutlined />,
      accent: "from-blue-500 to-indigo-500",
      sub: "Across your workspace",
    },
    {
      title: "Open rate",
      value:
        kpiLoading && !MOCK ? (
          <Skeleton.Input active size="small" className="!w-14" />
        ) : (
          pct(opened)
        ),
      icon: <EyeOutlined />,
      accent: "from-sky-500 to-cyan-500",
      sub: tracked ? `${opened} of ${tracked} opened` : "No data yet",
    },
    {
      title: "Click rate",
      value:
        kpiLoading && !MOCK ? (
          <Skeleton.Input active size="small" className="!w-14" />
        ) : (
          pct(clicked)
        ),
      icon: <ThunderboltOutlined />,
      accent: "from-violet-500 to-purple-500",
      sub: tracked ? `${clicked} of ${tracked} clicked` : "No data yet",
    },
    {
      title: "Delivery issues",
      value:
        kpiLoading && !MOCK ? (
          <Skeleton.Input active size="small" className="!w-14" />
        ) : (
          issues
        ),
      icon: <WarningOutlined />,
      accent: "from-rose-500 to-red-500",
      sub: "Bounces, complaints, rejections",
    },
  ];

  const columns: ColumnsType<MockAnalytic> = [
    {
      title: "Email",
      dataIndex: "email_id",
      key: "email_id",
      render: (emailId: string) => (
        <Link href={`/emails/${emailId}`} className="group">
          <p className="truncate font-medium text-ink group-hover:text-brand transition-colors">
            {subjectById.get(emailId) || "Untitled email"}
          </p>
          <p className="truncate text-xs text-muted">{emailId.slice(0, 8)}…</p>
        </Link>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (_, record) => <EmailStatusTag status={record.status} />,
    },
    {
      title: "Opens",
      dataIndex: "open_count",
      key: "open_count",
      width: 90,
      render: (n: number) => (
        <span className={n > 0 ? "font-medium text-ink" : "text-muted"}>
          {n}
        </span>
      ),
    },
    {
      title: "Clicks",
      dataIndex: "click_count",
      key: "click_count",
      width: 90,
      render: (n: number) => (
        <span className={n > 0 ? "font-medium text-ink" : "text-muted"}>
          {n}
        </span>
      ),
    },
    {
      title: "Attachments",
      dataIndex: "attachment_view_count",
      key: "attachment_view_count",
      width: 120,
      render: (n: number) => (
        <span className={n > 0 ? "font-medium text-ink" : "text-muted"}>
          {n}
        </span>
      ),
    },
    {
      title: "Sent",
      dataIndex: "sent_at",
      key: "sent_at",
      width: 160,
      render: (sentAt: string | null) => (
        <span className="text-sm text-muted">
          {sentAt ? dayjs(sentAt).format("MMM D, YYYY h:mm A") : "—"}
        </span>
      ),
    },
    {
      key: "action",
      width: 90,
      render: (_, record) => (
        <Link
          href={`/emails/${record.email_id}`}
          className="text-brand hover:underline"
        >
          View
        </Link>
      ),
    },
  ];

  return (
    <div className="animate-fade-up">
      <div>
        <h1 className="font-poppins text-2xl font-semibold text-ink tracking-tight">
          Analytics
        </h1>
        <p className="mt-1 text-sm text-muted">
          Opens, clicks and deliverability across every tracked email your
          workspace has sent.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {statCards.map((stat) => (
          <Card
            key={stat.title}
            className="rounded-2xl shadow-card"
            styles={{ body: { padding: 20 } }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted">{stat.title}</p>
                <p className="mt-1 font-poppins text-3xl font-semibold text-ink">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-muted">{stat.sub}</p>
              </div>
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white ${stat.accent}`}
              >
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-5">
        <Card
          className="rounded-2xl shadow-card lg:col-span-3"
          title="Email performance"
          extra={
            <Select
              allowClear
              placeholder="Filter by status"
              options={STATUS_OPTIONS}
              value={status}
              onChange={(v) => {
                setStatus(v);
                setPage(1);
              }}
              className="min-w-[150px]"
            />
          }
          styles={{ body: { paddingTop: 8 } }}
        >
          <Table
            rowKey="id"
            columns={columns}
            dataSource={rows}
            loading={!MOCK && tableLoading}
            pagination={{
              current: page,
              pageSize,
              total,
              onChange: (p) => setPage(p),
              showTotal: (t) => `${t} emails`,
            }}
            locale={{
              emptyText: (
                <Empty
                  description="No analytics recorded yet"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  className="py-10"
                />
              ),
            }}
            scroll={{ x: 720 }}
          />
        </Card>

        <Card
          className="rounded-2xl shadow-card lg:col-span-2"
          title="Recent activity"
          styles={{ body: { paddingTop: 8 } }}
        >
          {!MOCK && eventsLoading ? (
            <Skeleton active paragraph={{ rows: 6 }} />
          ) : events.length === 0 ? (
            <Empty
              description="No events recorded yet"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              className="py-10"
            />
          ) : (
            <div>
              {events.map((event) => {
                const meta = EVENT_META[event.event_type] || {
                  icon: <ClockCircleOutlined />,
                  color: "#94A3B8",
                  label: event.event_type,
                };
                return (
                  <div
                    key={event.id}
                    className="flex items-start gap-3 border-b border-gray-100 py-3 last:border-none"
                  >
                    <span
                      className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                      style={{
                        backgroundColor: `${meta.color}1A`,
                        color: meta.color,
                      }}
                    >
                      {meta.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-ink">{meta.label}</p>
                        <span className="shrink-0 text-xs text-muted">
                          {dayjs(event.occurred_at || event.created_at).format(
                            "MMM D, h:mm A",
                          )}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-muted">
                        {event.recipient_email}
                        {event.target_url && (
                          <>
                            {" · "}
                            <span className="text-brand">
                              {event.target_url}
                            </span>
                          </>
                        )}
                        {event.link_name ? ` · ${event.link_name}` : ""}
                      </p>
                    </div>
                  </div>
                );
              })}
              <Link
                href="/emails"
                className="mt-2 inline-flex items-center gap-1 text-sm text-brand hover:underline"
              >
                Open an email for its full timeline <ArrowRightOutlined />
              </Link>
            </div>
          )}
        </Card>
      </div>

      <div className="mt-3 text-xs text-muted">
        Tip: opens are counted via an invisible tracking pixel and clicks via
        rewritten links — recipients who engage multiple times update the
        counters, not the unique totals.
      </div>
    </div>
  );
};

export default AnalyticsPage;
