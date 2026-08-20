'use client';

import React from 'react';
import Link from 'next/link';
import { Card, Skeleton, Empty, Progress } from 'antd';
import {
  MailOutlined,
  EyeOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  RiseOutlined,
  RightOutlined
} from '@ant-design/icons';
import { useQuery } from '@apollo/client';
import dayjs from 'dayjs';
import { GET_EMAILS } from '@/utils/emails.crud';
import { GET_EMAIL_ANALYTICS } from '@/utils/analytics.crud';
import { requestForGetUser } from '@/helpers/restApiRequests';
import type { UserData } from '@/helpers/restApiRequests';
import { isMockMode, mockUser, mockEmails, mockAnalytics } from '@/lib/mockData';
import type { MockAnalytic, MockEmail } from '@/lib/mockData';

interface StatItem {
  title: string;
  value: number;
  icon: React.ReactNode;
  accent: string;
  key: string;
}

interface EngagementRowProps {
  label: string;
  percent: number;
  color: string;
}

const EngagementRow = ({ label, percent, color }: EngagementRowProps) => (
  <div>
    <div className="mb-1.5 flex items-center justify-between text-sm">
      <span className="text-muted">{label}</span>
      <span className="font-semibold text-ink">{percent}%</span>
    </div>
    <Progress percent={percent} showInfo={false} strokeColor={color} trailColor="#F1F5F9" size="small" />
  </div>
);

const DashboardPage = () => {
  const MOCK = isMockMode();
  const [user, setUser] = React.useState<UserData | null>(MOCK ? mockUser : null);

  React.useEffect(() => {
    if (MOCK) return undefined;
    requestForGetUser()
      .then(({ data }) => setUser(data.data))
      .catch(() => setUser(null));
    return undefined;
  }, [MOCK]);

  const { data: emailsData, loading: emailsLoading } = useQuery(GET_EMAILS, {
    variables: { optionData: { limit: 5 } },
    fetchPolicy: 'network-only',
    skip: MOCK
  });

  const { data: analyticsData, loading: analyticsLoading } = useQuery(GET_EMAIL_ANALYTICS, {
    variables: { optionData: { limit: 100 } },
    fetchPolicy: 'network-only',
    skip: MOCK
  });

  const analytics: MockAnalytic[] = MOCK
    ? mockAnalytics
    : (analyticsData?.getEmailAnalytics?.data as MockAnalytic[] | undefined) || [];
  const emails: MockEmail[] = MOCK
    ? mockEmails
    : (emailsData?.getEmails?.data as MockEmail[] | undefined) || [];
  const analyticsBusy = MOCK ? false : analyticsLoading;
  const emailsBusy = MOCK ? false : emailsLoading;

  const totalSent = analytics.length;
  const opened = analytics.filter((a) => a.open_count > 0).length;
  const clicked = analytics.filter((a) => a.click_count > 0).length;
  const delivered = analytics.filter((a) => a.delivered_at).length;
  const bounced = analytics.filter((a) => a.bounced_at || a.complained_at || a.rejected_at).length;

  const stats: StatItem[] = [
    { title: 'Emails sent', value: totalSent, icon: <MailOutlined />, accent: 'from-indigo-500 to-violet-500', key: 'sent' },
    { title: 'Opens', value: opened, icon: <EyeOutlined />, accent: 'from-sky-500 to-indigo-500', key: 'opened' },
    { title: 'Clicks', value: clicked, icon: <ThunderboltOutlined />, accent: 'from-violet-500 to-purple-500', key: 'clicked' },
    { title: 'Delivered', value: delivered, icon: <CheckCircleOutlined />, accent: 'from-emerald-500 to-teal-500', key: 'delivered' }
  ];

  const openRate = totalSent ? Math.round((opened / totalSent) * 100) : 0;
  const clickRate = totalSent ? Math.round((clicked / totalSent) * 100) : 0;
  const bounceRate = totalSent ? Math.round((bounced / totalSent) * 100) : 0;

  const firstName = user?.first_name || 'there';

  return (
    <div className="animate-fade-up">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-poppins text-2xl font-semibold text-ink tracking-tight">
            Welcome back, {firstName}
          </h1>
          <p className="mt-1 text-sm text-muted">
            Here&apos;s how your tracked emails are performing.
          </p>
        </div>
        <Link
          href="/emails"
          className="hidden sm:flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white shadow-card hover:bg-brand-hover transition-colors"
        >
          <MailOutlined /> Compose email
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.key} className="rounded-2xl shadow-card" styles={{ body: { padding: 20 } }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted">{stat.title}</p>
                <p className="mt-1 font-poppins text-3xl font-semibold text-ink">
                  {analyticsBusy ? <Skeleton.Input active size="small" className="!w-10" /> : stat.value}
                </p>
              </div>
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white ${stat.accent}`}>
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl shadow-card lg:col-span-2" title="Recent emails" styles={{ body: { paddingTop: 8 } }}>
          {emailsBusy ? (
            <div className="space-y-3 py-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} active paragraph={{ rows: 1 }} title={{ width: '60%' }} />
              ))}
            </div>
          ) : emails.length === 0 ? (
            <Empty description="No emails sent yet" image={Empty.PRESENTED_IMAGE_SIMPLE}>
              <Link href="/emails" className="text-brand text-sm font-medium">
                Compose your first tracked email
              </Link>
            </Empty>
          ) : (
            <div className="divide-y divide-line-light">
              {emails.map((email) => (
                <Link
                  key={email.id}
                  href={`/emails/${email.id}`}
                  className="flex items-center gap-3 py-3 hover:bg-subtle/50 -mx-2 px-2 rounded-lg transition-colors"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-subtle text-brand">
                    <MailOutlined />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{email.subject || 'No subject'}</p>
                    <p className="truncate text-xs text-muted">
                      {email.to?.[0]?.email || 'No recipients'}
                    </p>
                  </div>
                  <span className="hidden sm:block text-xs text-muted">
                    {email.sent_at ? dayjs(email.sent_at).format('MMM D, h:mm A') : dayjs(email.created_at).format('MMM D, h:mm A')}
                  </span>
                  <RightOutlined className="text-xs text-muted" />
                </Link>
              ))}
            </div>
          )}
        </Card>

        <Card className="rounded-2xl shadow-card" title="Engagement" styles={{ body: { paddingTop: 12 } }}>
          {analyticsBusy ? (
            <div className="space-y-4 py-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} active paragraph={{ rows: 1 }} title={{ width: '40%' }} />
              ))}
            </div>
          ) : totalSent === 0 ? (
            <Empty description="Send an email to see engagement" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            <div className="space-y-5 py-1">
              <EngagementRow label="Opened" percent={openRate} color="#4F46E5" />
              <EngagementRow label="Clicked" percent={clickRate} color="#8B5CF6" />
              <EngagementRow label="Bounced / failed" percent={bounceRate} color="#EF4444" />
              <div className="rounded-xl bg-subtle/70 p-3.5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white">
                  <RiseOutlined />
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  <span className="font-medium text-ink">{openRate}% open rate</span> across {totalSent} tracked
                  email{totalSent === 1 ? '' : 's'}.
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;