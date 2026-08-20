'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input, Select, Button, Table, Tag, Empty } from 'antd';
import { SearchOutlined, MailOutlined, PlusOutlined } from '@ant-design/icons';
import { useQuery } from '@apollo/client';
import dayjs from 'dayjs';
import { GET_EMAILS } from '@/utils/emails.crud';
import { isMockMode, mockEmails } from '@/lib/mockData';
import type { MockEmail } from '@/lib/mockData';
import type { ColumnsType } from 'antd/es/table';

const STAGE_OPTIONS = [
  { value: 'sent', label: 'Sent' },
  { value: 'draft', label: 'Drafts' },
  { value: 'inbox', label: 'Inbox' }
];

const EmailsPage = () => {
  const MOCK = isMockMode();
  const router = useRouter();
  const [search, setSearch] = React.useState('');
  const [stage, setStage] = React.useState<string | undefined>(undefined);
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  const queryData = {
    ...(search ? { search_keyword: search } : {}),
    ...(stage ? { stage } : {})
  };

  const { data, loading } = useQuery(GET_EMAILS, {
    variables: { queryData, optionData: { limit: pageSize, offset: (page - 1) * pageSize } },
    fetchPolicy: 'network-only',
    skip: MOCK
  });

  const emails: MockEmail[] = MOCK
    ? mockEmails
    : (data?.getEmails?.data as MockEmail[] | undefined) || [];
  const total = MOCK ? mockEmails.length : data?.getEmails?.meta_data?.total_rows || 0;
  const busy = MOCK ? false : loading;

  const columns: ColumnsType<MockEmail> = [
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      render: (subject, record) => (
        <Link href={`/emails/${record.id}`} className="group">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-subtle text-brand">
              <MailOutlined />
            </div>
            <div className="min-w-0">
              <p className="truncate font-medium text-ink group-hover:text-brand transition-colors">
                {subject || 'No subject'}
              </p>
              <p className="truncate text-xs text-muted">
                {record.to?.[0]?.email || 'No recipients'}
              </p>
            </div>
          </div>
        </Link>
      )
    },
    {
      title: 'Stage',
      dataIndex: 'stage',
      key: 'stage',
      width: 120,
      render: (s: string) => (
        <Tag
          className="rounded-full !border-none capitalize"
          color={s === 'sent' ? 'success' : s === 'draft' ? 'default' : 'processing'}
        >
          {s}
        </Tag>
      )
    },
    {
      title: 'Tracking',
      dataIndex: 'tracking_enabled',
      key: 'tracking_enabled',
      width: 110,
      render: (enabled: boolean) =>
        enabled ? (
          <Tag className="rounded-full !border-none !bg-subtle !text-brand">On</Tag>
        ) : (
          <Tag className="rounded-full !border-none !bg-gray-100 !text-muted">Off</Tag>
        )
    },
    {
      title: 'Sent',
      dataIndex: 'sent_at',
      key: 'sent_at',
      width: 150,
      render: (sentAt, record) => (
        <span className="text-sm text-muted">
          {sentAt
            ? dayjs(sentAt).format('MMM D, YYYY h:mm A')
            : dayjs(record.created_at).format('MMM D, YYYY')}
        </span>
      )
    },
    {
      key: 'action',
      width: 90,
      render: (_, record) => (
        <Button
          type="link"
          className="!text-brand"
          onClick={() => router.push(`/emails/${record.id}`)}
        >
          View
        </Button>
      )
    }
  ];

  return (
    <div className="animate-fade-up">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-poppins text-2xl font-semibold text-ink tracking-tight">Emails</h1>
          <p className="mt-1 text-sm text-muted">
            Every tracked email your workspace has sent.
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => router.push('/emails')}
          className="shadow-card"
        >
          Compose
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Input
          allowClear
          prefix={<SearchOutlined className="text-muted" />}
          placeholder="Search emails"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-xs rounded-xl"
          size="large"
        />
        <Select
          allowClear
          placeholder="Filter by stage"
          options={STAGE_OPTIONS}
          value={stage}
          onChange={(v) => {
            setStage(v);
            setPage(1);
          }}
          className="min-w-[160px] rounded-xl"
          size="large"
        />
      </div>

      <div className="mt-4 rounded-2xl bg-white shadow-card">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={emails}
          loading={busy}
          pagination={{
            current: page,
            pageSize,
            total,
            onChange: (p) => setPage(p),
            showTotal: (t) => `${t} emails`
          }}
          locale={{
            emptyText: (
              <Empty
                description="No emails found"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                className="py-10"
              />
            )
          }}
          className="!rounded-2xl"
        />
      </div>
      <div className="mt-3 text-xs text-muted">
        Tip: sending tracked email requires recipients provisioned in the workspace (backend add-on). Lists and
        analytics are fully live.
      </div>
    </div>
  );
};

export default EmailsPage;