import { gql } from '@apollo/client';

export const GET_EMAILS = gql`
  query getEmails($queryData: EmailQueryInputType, $optionData: OptionDataType) {
    getEmails(queryData: $queryData, optionData: $optionData) {
      data {
        id
        subject
        snippet
        stage
        tracking_enabled
        is_read
        is_trashed
        sent_at
        created_at
        to {
          id
          email
          type
        }
      }
      meta_data {
        total_rows
        filtered_rows
      }
    }
  }
`;

export const GET_AN_EMAIL = gql`
  query getAnEmail($queryData: CommonEntityIdQueryDataType) {
    getAnEmail(queryData: $queryData) {
      id
      subject
      body_html
      snippet
      stage
      tracking_enabled
      is_read
      is_trashed
      sent_at
      created_at
      to {
        id
        email
        type
        send_status
        sent_at
      }
      cc {
        id
        email
        type
      }
    }
  }
`;

export const GET_EMAIL_RECIPIENTS = gql`
  query getEmailRecipients($queryData: EmailRecipientQueryInputType, $optionData: OptionDataType) {
    getEmailRecipients(queryData: $queryData, optionData: $optionData) {
      data {
        id
        email
        type
        send_status
        sent_at
      }
      meta_data {
        total_rows
      }
    }
  }
`;

export const CREATE_EMAIL = gql`
  mutation createEmail($inputData: EmailCreateInputType!) {
    createEmail(inputData: $inputData) {
      id
      subject
      stage
      tracking_enabled
      created_at
    }
  }
`;

export const DELETE_EMAIL = gql`
  mutation deleteEmail($inputData: EmailDeleteInputType!) {
    deleteEmail(inputData: $inputData) {
      id
    }
  }
`;