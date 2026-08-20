// Static UI preview data — enabled with NEXT_PUBLIC_MOCK_DATA=true (see .env.local).
// Gives the shell, dashboard, email list and detail views realistic content without a session.

import dayjs from 'dayjs';

const now = dayjs();
const d = (n: number, hour = 0, minute = 0): string =>
  now
    .subtract(n, 'day')
    .subtract(hour, 'hour')
    .subtract(minute, 'minute')
    .toISOString();

export const isMockMode = (): boolean => process.env.NEXT_PUBLIC_MOCK_DATA === 'true';

export interface MockUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface MockRecipient {
  id: string;
  email: string;
  type: string;
  send_status?: string;
  sent_at?: string | null;
}

export interface MockEmail {
  id: string;
  subject: string;
  snippet: string;
  stage: string;
  tracking_enabled: boolean;
  is_read: boolean;
  is_trashed: boolean;
  sent_at: string | null;
  created_at: string;
  to: MockRecipient[];
  body_html?: string;
  cc?: MockRecipient[];
}

export interface MockAnalytic {
  id: string;
  email_id: string;
  email_recipient_id: string | null;
  status: string;
  open_count: number;
  click_count: number;
  attachment_view_count: number;
  sent_at: string | null;
  first_open_at: string | null;
  last_open_at: string | null;
  first_click_at: string | null;
  clicked_at: string | null;
  delivered_at: string | null;
  bounced_at: string | null;
  complained_at: string | null;
  rejected_at: string | null;
}

export interface MockTrackedLink {
  id: string;
  email_id: string;
  target_url: string;
  label: string;
  kind: string;
  click_count: number;
  last_clicked_at: string | null;
  sort: number;
}

export interface MockTrackingEvent {
  id: string;
  email_id: string;
  email_recipient_id: string | null;
  event_type: string;
  recipient_email: string;
  target_url: string | null;
  link_name: string | null;
  link_id: string | null;
  occurred_at: string | null;
  source: string;
  user_agent: string | null;
  ip_address: string | null;
  tracking_scope: string | null;
  created_at?: string;
}

export const mockUser: MockUser = {
  id: '11111111-1111-4111-8111-111111111111',
  first_name: 'Alex',
  last_name: 'Morgan',
  email: 'alex@northwind.app'
};

export const mockEmails: MockEmail[] = [
  {
    id: 'e-001',
    subject: 'Q3 pricing proposal',
    snippet: 'Hi Sarah, here is the pricing proposal we discussed…',
    stage: 'sent',
    tracking_enabled: true,
    is_read: true,
    is_trashed: false,
    sent_at: d(0, 9),
    created_at: d(0, 9),
    to: [{ id: 'r-001', email: 'sarah@acme.com', type: 'to' }]
  },
  {
    id: 'e-002',
    subject: 'Follow up: intro call',
    snippet: 'Checking in on the intro call we scheduled last week…',
    stage: 'sent',
    tracking_enabled: true,
    is_read: false,
    is_trashed: false,
    sent_at: d(1, 14),
    created_at: d(1, 14),
    to: [{ id: 'r-002', email: 'mike@globex.io', type: 'to' }]
  },
  {
    id: 'e-003',
    subject: 'Welcome to Openlytic 🎉',
    snippet: 'We are excited to have you on board. Here is how to get started…',
    stage: 'sent',
    tracking_enabled: true,
    is_read: false,
    is_trashed: false,
    sent_at: d(2, 11),
    created_at: d(2, 11),
    to: [{ id: 'r-003', email: 'team@northwind.app', type: 'to' }]
  },
  {
    id: 'e-004',
    subject: 'Invoice #1042',
    snippet: 'Please find attached the invoice for June services…',
    stage: 'sent',
    tracking_enabled: true,
    is_read: false,
    is_trashed: false,
    sent_at: d(3, 16),
    created_at: d(3, 16),
    to: [{ id: 'r-004', email: 'finance@acme.com', type: 'to' }]
  },
  {
    id: 'e-005',
    subject: 'Product roadmap preview',
    snippet: 'Before the all-hands, here is a preview of what ships next…',
    stage: 'sent',
    tracking_enabled: true,
    is_read: true,
    is_trashed: false,
    sent_at: d(5, 10),
    created_at: d(5, 10),
    to: [{ id: 'r-005', email: 'partner@orbital.co', type: 'to' }]
  },
  {
    id: 'e-006',
    subject: 'Re: quarterly review',
    snippet: 'Thanks Dana, the numbers look great. One follow up…',
    stage: 'sent',
    tracking_enabled: true,
    is_read: true,
    is_trashed: false,
    sent_at: d(7, 12),
    created_at: d(7, 12),
    to: [{ id: 'r-006', email: 'dana@inuits.com', type: 'to' }]
  },
  {
    id: 'e-007',
    subject: 'Event invitation: Openlytic Launch Party',
    snippet: 'You are invited! Join us on the 28th to celebrate…',
    stage: 'sent',
    tracking_enabled: true,
    is_read: false,
    is_trashed: false,
    sent_at: d(9, 9),
    created_at: d(9, 9),
    to: [{ id: 'r-007', email: 'hello@northwind.app', type: 'to' }]
  },
  {
    id: 'e-008',
    subject: 'Draft: new onboarding ideas',
    snippet: 'Brainstorming the new onboarding flow…',
    stage: 'draft',
    tracking_enabled: false,
    is_read: false,
    is_trashed: false,
    sent_at: null,
    created_at: d(12, 9),
    to: []
  }
];

export const mockAnalytics: MockAnalytic[] = [
  {
    id: 'a-001',
    email_id: 'e-001',
    email_recipient_id: 'r-001',
    status: 'clicked',
    open_count: 3,
    click_count: 2,
    attachment_view_count: 1,
    sent_at: d(0, 9),
    first_open_at: d(0, 9, 1),
    last_open_at: d(0, 7),
    first_click_at: d(0, 9, 2),
    clicked_at: d(0, 8),
    delivered_at: d(0, 9),
    bounced_at: null,
    complained_at: null,
    rejected_at: null
  },
  {
    id: 'a-002',
    email_id: 'e-002',
    email_recipient_id: 'r-002',
    status: 'opened',
    open_count: 1,
    click_count: 0,
    attachment_view_count: 0,
    sent_at: d(1, 14),
    first_open_at: d(1, 13),
    last_open_at: d(1, 13),
    first_click_at: null,
    clicked_at: null,
    delivered_at: d(1, 14),
    bounced_at: null,
    complained_at: null,
    rejected_at: null
  },
  {
    id: 'a-003',
    email_id: 'e-003',
    email_recipient_id: 'r-003',
    status: 'delivered',
    open_count: 0,
    click_count: 0,
    attachment_view_count: 0,
    sent_at: d(2, 11),
    first_open_at: null,
    last_open_at: null,
    first_click_at: null,
    clicked_at: null,
    delivered_at: d(2, 11),
    bounced_at: null,
    complained_at: null,
    rejected_at: null
  },
  {
    id: 'a-004',
    email_id: 'e-004',
    email_recipient_id: 'r-004',
    status: 'bounced',
    open_count: 0,
    click_count: 0,
    attachment_view_count: 0,
    sent_at: d(3, 16),
    first_open_at: null,
    last_open_at: null,
    first_click_at: null,
    clicked_at: null,
    delivered_at: null,
    bounced_at: d(3, 15),
    complained_at: null,
    rejected_at: null
  },
  {
    id: 'a-005',
    email_id: 'e-005',
    email_recipient_id: 'r-005',
    status: 'clicked',
    open_count: 4,
    click_count: 3,
    attachment_view_count: 0,
    sent_at: d(5, 10),
    first_open_at: d(5, 10, 2),
    last_open_at: d(4, 12),
    first_click_at: d(5, 10, 4),
    clicked_at: d(4, 12),
    delivered_at: d(5, 10),
    bounced_at: null,
    complained_at: null,
    rejected_at: null
  },
  {
    id: 'a-006',
    email_id: 'e-006',
    email_recipient_id: 'r-006',
    status: 'opened',
    open_count: 2,
    click_count: 0,
    attachment_view_count: 0,
    sent_at: d(7, 12),
    first_open_at: d(7, 10),
    last_open_at: d(6, 9),
    first_click_at: null,
    clicked_at: null,
    delivered_at: d(7, 12),
    bounced_at: null,
    complained_at: null,
    rejected_at: null
  },
  {
    id: 'a-007',
    email_id: 'e-007',
    email_recipient_id: 'r-007',
    status: 'complained',
    open_count: 1,
    click_count: 0,
    attachment_view_count: 0,
    sent_at: d(9, 9),
    first_open_at: d(9, 9, 1),
    last_open_at: d(9, 9, 1),
    first_click_at: null,
    clicked_at: null,
    delivered_at: d(9, 9),
    bounced_at: null,
    complained_at: d(9, 8),
    rejected_at: null
  }
];

export const mockEmailDetail: MockEmail = {
  id: 'e-001',
  subject: 'Q3 pricing proposal',
  body_html: `
    <div style="font-family: Arial, sans-serif; color: #1e293b; line-height: 1.6;">
      <p>Hi Sarah,</p>
      <p>Thanks for taking the time to chat last week. As promised, here is our Q3 pricing proposal.</p>
      <p><a href="https://openlytic.app/proposal/q3">View the full proposal</a></p>
      <ul>
        <li>Growth plan — 12 seats</li>
        <li>Email tracking + link analytics</li>
        <li>Deliverability monitoring</li>
      </ul>
      <p>Happy to walk through it whenever works for you.</p>
      <p>Best,<br/>Alex</p>
    </div>`,
  snippet: 'Hi Sarah, here is the pricing proposal we discussed…',
  stage: 'sent',
  tracking_enabled: true,
  is_read: true,
  is_trashed: false,
  sent_at: d(0, 9),
  created_at: d(0, 9),
  to: [
    {
      id: 'r-001',
      email: 'sarah@acme.com',
      type: 'to',
      send_status: 'sent',
      sent_at: d(0, 9)
    }
  ],
  cc: []
};

export const mockEmailAnalytic: MockAnalytic = mockAnalytics[0];

export const mockTrackedLinks: MockTrackedLink[] = [
  {
    id: 'l-001',
    email_id: 'e-001',
    target_url: 'https://openlytic.app/proposal/q3',
    label: 'View the full proposal',
    kind: 'click',
    click_count: 2,
    last_clicked_at: d(0, 7),
    sort: 1
  },
  {
    id: 'l-002',
    email_id: 'e-001',
    target_url: 'https://openlytic.app/docs/security',
    label: 'security-doc.pdf',
    kind: 'attachment',
    click_count: 1,
    last_clicked_at: d(0, 8),
    sort: 2
  }
];

export const mockTrackingEvents: MockTrackingEvent[] = [
  {
    id: 'ev-001',
    email_id: 'e-001',
    email_recipient_id: 'r-001',
    event_type: 'delivered',
    recipient_email: 'sarah@acme.com',
    target_url: null,
    link_name: null,
    link_id: null,
    occurred_at: d(0, 9),
    source: 'transport_webhook',
    user_agent: null,
    ip_address: null,
    tracking_scope: 'recipient'
  },
  {
    id: 'ev-002',
    email_id: 'e-001',
    email_recipient_id: 'r-001',
    event_type: 'opened',
    recipient_email: 'sarah@acme.com',
    target_url: null,
    link_name: null,
    link_id: null,
    occurred_at: d(0, 9, 1),
    source: 'tracking',
    user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    ip_address: '203.0.113.24',
    tracking_scope: 'recipient'
  },
  {
    id: 'ev-003',
    email_id: 'e-001',
    email_recipient_id: 'r-001',
    event_type: 'clicked',
    recipient_email: 'sarah@acme.com',
    target_url: 'https://openlytic.app/proposal/q3',
    link_name: 'View the full proposal',
    link_id: 'l-001',
    occurred_at: d(0, 9, 2),
    source: 'tracking',
    user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15',
    ip_address: '198.51.100.77',
    tracking_scope: 'recipient'
  },
  {
    id: 'ev-004',
    email_id: 'e-001',
    email_recipient_id: 'r-001',
    event_type: 'attachment_viewed',
    recipient_email: 'sarah@acme.com',
    target_url: 'https://openlytic.app/docs/security',
    link_name: 'security-doc.pdf',
    link_id: 'l-002',
    occurred_at: d(0, 8),
    source: 'tracking',
    user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    ip_address: '203.0.113.24',
    tracking_scope: 'recipient'
  },
  {
    id: 'ev-005',
    email_id: 'e-001',
    email_recipient_id: 'r-001',
    event_type: 'clicked',
    recipient_email: 'sarah@acme.com',
    target_url: 'https://openlytic.app/proposal/q3',
    link_name: 'View the full proposal',
    link_id: 'l-001',
    occurred_at: d(0, 7),
    source: 'tracking',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0',
    ip_address: '192.0.2.15',
    tracking_scope: 'recipient'
  }
];