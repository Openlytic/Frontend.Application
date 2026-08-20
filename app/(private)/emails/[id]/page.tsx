'use client';

import React from 'react';
import Link from 'next/link';
import { Card, Skeleton, Empty, Tag, Table, Timeline, Descriptions, Result, Button } from 'antd';
import {
  ArrowLeftOutlined,
  EyeOutlined,
  ThunderboltOutlined,
  PaperClipOutlined,
  MailOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useQuery } from '@apollo/client';
import dayjs from 'dayjs';
import { useParams } from 'next/navigation';
import { GET_AN_EMAIL } from '@/utils/emails.crud';
import { GET_AN_EMAIL_ANALYTIC, GET_TRACKED_LINKS, GET_EMAIL_TRACKING_EVENTS } from '@/utils/analytics.crud';
import EmailStatusTag from '@/components/email/EmailStatusTag';
import {
  isMockMode,
  mockEmailDetail,
  mockEmailAnalytic,
  mockTrackedLinks,
  mockTrackingEvents
} from '@/lib/mockData';
import type { MockEmail, MockAnalytic, MockTrackedLink, MockTrackingEvent } from '@/lib/mockData';
import type { ColumnsType } from 'antd/es/table';
import type { TimelineItemProps } from 'antd';

interface EventMeta {
  icon: React.ReactNode;
  color: string;
  label: string;
}

const EVENT_META: Record<string, EventMeta> = {
  delivered: { icon: <CheckCircleOutlined />, color: '#10B981', label: 'Delivered' },
  opened: { icon: <EyeOutlined />, color: '#4F46E5', label: 'Opened' },
  clicked: { icon: <ThunderboltOutlined />, color: '#8B5CF6', label: 'Clicked' },
  attachment_viewed: { icon: <PaperClipOutlined />, color: '#0EA5E9', label: 'Attachment viewed' },
  bounce_permanent: { icon: <ClockCircleOutlined />, color: '#EF4444', label: 'Permanent bounce' },
  bounce_transient: { icon: <ClockCircleOutlined />, color: '#F59E0B', label: 'Transient bounce' },
  bounced: { icon: <ClockCircleOutlined />, color: '#EF4444', label: 'Bounced' },
  complained: { icon: <ClockCircleOutlined />, color: '#EF4444', label: 'Complained' },
  rejected: { icon: <ClockCircleOutlined />, color: '#EF4444', label: 'Rejected' },
  delivery_delayed: { icon: <ClockCircleOutlined />, color: '#F59E0B', label: 'Delivery delayed' }
};

const EmailDetailPage = () => {
  const params = useParams<{ id: string }>();
  const emailId = params?.id;
  const MOCK = isMockMode();

  const { data: emailData, loading: emailLoading, error: emailError } = useQuery(GET_AN_EMAIL, {
    variables: { queryData: { entity_id: emailId } },
    fetchPolicy: 'network-only',
    skip: !emailId || MOCK
  });

  const { data: analyticData, loading: analyticLoading } = useQuery(GET_AN_EMAIL_ANALYTIC, {
    variables: { queryData: { entity_id: emailId } },
    fetchPolicy: 'network-only',
    skip: !emailId || MOCK
  });

  const { data: linksData, loading: linksLoading } = useQuery(GET_TRACKED_LINKS, {
    variables: { queryData: { email_id: emailId } },
    fetchPolicy: 'network-only',
    skip: !emailId || MOCK
  });

  const { data: eventsData, loading: eventsLoading } = useQuery(GET_EMAIL_TRACKING_EVENTS, {
    variables: { queryData: { email_id: emailId }, optionData: { limit: 50 } },
    fetchPolicy: 'network-only',
    skip: !emailId || MOCK
  });

  const email: MockEmail | undefined = MOCK ? mockEmailDetail : emailData?.getAnEmail;
  const analytic: MockAnalytic | undefined = MOCK
    ? mockEmailAnalytic
    : analyticData?.getAnEmailAnalytic;
  const links: MockTrackedLink[] = MOCK
    ? mockTrackedLinks
    : (linksData?.getTrackedLinks as MockTrackedLink[] | undefined) || [];
  const events: MockTrackingEvent[] = MOCK
    ? mockTrackingEvents
    : (eventsData?.getEmailTrackingEvents?.data as MockTrackingEvent[] | undefined) || [];
  const busy = {
    email: MOCK ? false : emailLoading,
    analytic: MOCK ? false : analyticLoading,
    links: MOCK ? false : linksLoading,
    events: MOCK ? false : eventsLoading
  };

  if (!MOCK && emailError) {
    return (
      <Result
        status="404"
        title="Email not found"
        subTitle="It may have been deleted from this workspace."
        extra={
          <Link href="/emails">
            <Button type="primary">Back to emails</Button>
          </Link>
        }
      />
    );
  }

  const recipients = email?.to?.map((r) => r.email).join(', ') || 'No recipients';

  const statCards = [
    {
      title: 'Opens',
      value: analytic?.open_count ?? '—',
      icon: <EyeOutlined />,
      accent: 'from-sky-500 to-indigo-500',
      sub: analytic?.first_open_at
        ? `First: ${dayjs(analytic.first_open_at).format('MMM D, h:mm A')}`
        : 'No opens yet'
    },
    {
      title: 'Clicks',
      value: analytic?.click_count ?? '—',
      icon: <ThunderboltOutlined />,
      accent: 'from-violet-500 to-purple-500',
      sub: analytic?.first_click_at
        ? `First: ${dayjs(analytic.first_click_at).format('MMM D, h:mm A')}`
        : 'No clicks yet'
    },
    {
      title: 'Attachment views',
      value: analytic?.attachment_view_count ?? '—',
      icon: <PaperClipOutlined />,
      accent: 'from-cyan-500 to-sky-500',
      sub: 'Tracked attachments'
    },
    {
      title: 'Status',
      value: '',
      icon: <MailOutlined />,
      accent: 'from-emerald-500 to-teal-500',
      sub: <EmailStatusTag status={analytic?.status} />
    }
  ];

  const deliveryMeta = [
    { label: 'Delivered', value: analytic?.delivered_at },
    { label: 'Bounced', value: analytic?.bounced_at },
    { label: 'Complained', value: analytic?.complained_at },
    { label: 'Rejected', value: analytic?.rejected_at }
  ].filter((item) => item.value);

  const linkColumns: ColumnsType<MockTrackedLink> = [
    { title: 'Label', dataIndex: 'label', key: 'label', render: (label) => label || '—' },
    {
      title: 'Target URL',
      dataIndex: 'target_url',
      key: 'target_url',
      render: (url) => (
        <span className="truncate block max-w-[320px] text-brand" title={url}>
          {url}
        </span>
      )
    },
    {
      title: 'Kind',
      dataIndex: 'kind',
      key: 'kind',
      width: 110,
      render: (kind) => (
        <Tag className="rounded-full !border-none capitalize">{kind || 'link'}</Tag>
      )
    },
    { title: 'Clicks', dataIndex: 'click_count', key: 'click_count', width: 90 },
    {
      title: 'Last clicked',
      dataIndex: 'last_clicked_at',
      key: 'last_clicked_at',
      width: 160,
      render: (t) => (t ? dayjs(t).format('MMM D, YYYY h:mm A') : '—')
    }
  ];

  const timelineItems: TimelineItemProps[] = events
    .slice()
    .sort(
      (a, b) =>
        new Date(b.occurred_at || b.created_at || 0).getTime() -
        new Date(a.occurred_at || a.created_at || 0).getTime()
    )
    .map((event) => {
      const meta =
        EVENT_META[event.event_type] || {
          icon: <ClockCircleOutlined />,
          color: '#94A3B8',
          label: event.event_type
        };
      return {
        color: meta.color,
        dot: meta.icon,
        children: (
          <div>
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium text-ink">{meta.label}</p>
              <span className="text-xs text-muted">
                {dayjs(event.occurred_at || event.created_at).format('MMM D, YYYY h:mm:ss A')}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-muted">
              {event.recipient_email}
              {event.target_url && (
                <>
                  {' '}· <span className="text-brand">↗ {event.target_url}</span>
                </>
              )}
              {event.link_name && ` · ${event.link_name}`}
            </p>
            <p className="text-xs text-muted/70">
              {event.source === 'transport_webhook'
                ? 'Delivery event (SES)'
                : event.source === 'tracking'
                  ? 'Tracking pixel / link'
                  : event.source}
              {event.user_agent ? ` · ${event.user_agent.slice(0, 40)}` : ''}
            </p>
          </div>
        )
      };
    });

  return (
    <div className="animate-fade-up">
      <Link href="/emails" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-brand transition-colors">
        <ArrowLeftOutlined /> Back to emails
      </Link>

      {busy.email ? (
        <Card className="mt-4 rounded-2xl shadow-card">
          <Skeleton active paragraph={{ rows: 4 }} />
        </Card>
      ) : email ? (
        <>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <h1 className="font-poppins text-2xl font-semibold text-ink tracking-tight">
              {email.subject || 'No subject'}
            </h1>
            <EmailStatusTag status={analytic?.status} />
          </div>
          <p className="mt-1 text-sm text-muted">
            To: <span className="text-ink">{recipients}</span>
          </p>
          <p className="text-xs text-muted">
            {email.sent_at
              ? `Sent ${dayjs(email.sent_at).format('MMM D, YYYY h:mm A')}`
              : `Created ${dayjs(email.created_at).format('MMM D, YYYY h:mm A')}`}
            {email.tracking_enabled ? ' · tracking enabled' : ' · tracking disabled'}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
            {statCards.map((stat) => (
              <Card key={stat.title} className="rounded-2xl shadow-card" styles={{ body: { padding: 20 } }}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted">{stat.title}</p>
                    <p className="mt-1 font-poppins text-3xl font-semibold text-ink">
                      {busy.analytic ? <Skeleton.Input active size="small" className="!w-10" /> : stat.value}
                    </p>
                    <p className="mt-1 text-xs text-muted">{stat.sub}</p>
                  </div>
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white ${stat.accent}`}>
                    {stat.icon}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {deliveryMeta.length > 0 && (
            <Card className="mt-4 rounded-2xl shadow-card" styles={{ body: { padding: 20 } }}>
              <Descriptions
                column={{ xs: 1, sm: 2, md: 4 }}
                items={deliveryMeta.map((item) => ({
                  key: item.label,
                  label: item.label,
                  children: dayjs(item.value).format('MMM D, YYYY h:mm:ss A')
                }))}
              />
            </Card>
          )}

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <Card className="rounded-2xl shadow-card" title="Tracked links" styles={{ body: { paddingTop: 8 } }}>
              {busy.links ? (
                <Skeleton active paragraph={{ rows: 3 }} />
              ) : links.length === 0 ? (
                <Empty description="No tracked links" image={Empty.PRESENTED_IMAGE_SIMPLE} className="py-6" />
              ) : (
                <Table
                  rowKey="id"
                  columns={linkColumns}
                  dataSource={links}
                  pagination={false}
                  size="small"
                />
              )}
            </Card>

            <Card className="rounded-2xl shadow-card" title="Activity timeline" styles={{ body: { paddingTop: 8 } }}>
              {busy.events ? (
                <Skeleton active paragraph={{ rows: 4 }} />
              ) : timelineItems.length === 0 ? (
                <Empty description="No events recorded yet" image={Empty.PRESENTED_IMAGE_SIMPLE} className="py-6" />
              ) : (
                <Timeline items={timelineItems} className="py-2" />
              )}
            </Card>
          </div>
        </>
      ) : (
        <Result
          status="404"
          title="Email not found"
          extra={
            <Link href="/emails">
              <Button type="primary">Back to emails</Button>
            </Link>
          }
        />
      )}
    </div>
  );
};

export default EmailDetailPage;