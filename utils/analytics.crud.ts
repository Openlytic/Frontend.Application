import { gql } from '@apollo/client';

const ANALYTIC_FIELDS = `
  id
  email_id
  email_recipient_id
  status
  open_count
  click_count
  attachment_view_count
  sent_at
  first_open_at
  last_open_at
  first_click_at
  clicked_at
  delivered_at
  bounced_at
  complained_at
  rejected_at
`;

export const GET_EMAIL_ANALYTICS = gql`
  query getEmailAnalytics($queryData: EmailAnalyticsQueryInputType, $optionData: OptionDataType) {
    getEmailAnalytics(queryData: $queryData, optionData: $optionData) {
      data {
        ${ANALYTIC_FIELDS}
      }
      meta_data {
        total_rows
        filtered_rows
      }
    }
  }
`;

export const GET_AN_EMAIL_ANALYTIC = gql`
  query getAnEmailAnalytic($queryData: CommonEntityIdQueryDataType) {
    getAnEmailAnalytic(queryData: $queryData) {
      ${ANALYTIC_FIELDS}
    }
  }
`;

export const GET_TRACKED_LINKS = gql`
  query getTrackedLinks($queryData: TrackedLinksQueryInputType!) {
    getTrackedLinks(queryData: $queryData) {
      id
      email_id
      target_url
      label
      kind
      click_count
      last_clicked_at
      sort
    }
  }
`;

export const GET_EMAIL_TRACKING_EVENTS = gql`
  query getEmailTrackingEvents($queryData: EmailTrackingEventsQueryInputType, $optionData: OptionDataType) {
    getEmailTrackingEvents(queryData: $queryData, optionData: $optionData) {
      data {
        id
        email_id
        email_recipient_id
        event_type
        recipient_email
        target_url
        link_name
        link_id
        occurred_at
        source
        user_agent
        ip_address
        tracking_scope
      }
      meta_data {
        total_rows
      }
    }
  }
`;