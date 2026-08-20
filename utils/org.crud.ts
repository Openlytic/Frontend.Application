import { gql } from "@apollo/client";

export const GET_AN_ORGANIZATION = gql`
  query getAnOrganization($queryData: CommonEntityIdQueryDataType) {
    getAnOrganization(queryData: $queryData) {
      id
      name
      sub_domain
      status
      created_at
    }
  }
`;

export const GET_ORGANIZATIONS = gql`
  query getOrganizations(
    $queryData: OrganizationsQueryInput
    $optionData: OptionDataType
  ) {
    getOrganizations(queryData: $queryData, optionData: $optionData) {
      data {
        id
        name
        sub_domain
        status
      }
      meta_data {
        total_rows
      }
    }
  }
`;

export const GET_ORGANIZATION_USERS = gql`
  query getOrganizationUsers(
    $queryData: OrganizationUsersQueryInput
    $optionData: OptionDataType
  ) {
    getOrganizationUsers(queryData: $queryData, optionData: $optionData) {
      data {
        id
        email
        first_name
        last_name
        role
        status
      }
      meta_data {
        total_rows
      }
    }
  }
`;

export const UPDATE_ORGANIZATION = gql`
  mutation updateAnOrganization(
    $queryData: CommonEntityIdQueryDataType!
    $inputData: OrganizationUpdateInputType!
  ) {
    updateAnOrganization(queryData: $queryData, inputData: $inputData) {
      id
      name
      sub_domain
    }
  }
`;
