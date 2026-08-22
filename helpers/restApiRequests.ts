import axiosInstance from "@/utils/axiosInstance";
import type { TokenPair } from "@/helpers/token";
import type { AxiosResponse } from "axios";

// All /auth/* + /organization REST calls against the Openlytic API.
// Response envelope: { data, message }. Errors reject with err.response?.data?.message.

export interface ApiEnvelope<T> {
  data: T;
  message?: string;
}

export interface LoginParams {
  email: string;
  password: string;
  org_id?: string;
}

export interface OrganizationMembershipData {
  org_id: string;
  name: string;
  sub_domain: string;
  role: string;
}

export interface UserData {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  status?: string;
  organizations?: OrganizationMembershipData[];
}

export interface PreRegisterParams {
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface PreRegisterData {
  is_unregistered_user?: boolean;
  user: {
    id: string;
    email: string;
    status?: string;
  };
}

export interface RegisterParams {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  is_verification_required: boolean;
}

export interface SubDomainAvailabilityData {
  is_available?: boolean;
  message?: string;
}

export interface CreateOrganizationParams {
  user_id: string;
  org_name: string;
  sub_domain: string;
  time_zone: string;
  location: {
    address: string;
    city?: string;
    country?: string;
    country_code?: string;
  };
}

export const requestForLogin = (
  body: LoginParams,
): Promise<AxiosResponse<ApiEnvelope<TokenPair>>> =>
  axiosInstance.post("/auth/login", body);

export const requestForPreRegister = (
  body: PreRegisterParams,
): Promise<AxiosResponse<ApiEnvelope<PreRegisterData>>> =>
  axiosInstance.post("/auth/pre-register", body);

export const requestForRegister = (
  body: RegisterParams,
): Promise<AxiosResponse<ApiEnvelope<TokenPair & { user?: UserData }>>> =>
  axiosInstance.post("/auth/register", body);

export const requestForVerify = (body: {
  user_id: string;
  token: string;
}): Promise<AxiosResponse<ApiEnvelope<Record<string, unknown>>>> =>
  axiosInstance.post("/auth/verify", body);

export const requestForResendOtp = (body: {
  email: string;
  user_id?: string | null;
}): Promise<AxiosResponse<ApiEnvelope<Record<string, unknown>>>> =>
  axiosInstance.post("/auth/resend-verification", body);

export const requestForForgotPassword = (body: {
  email: string;
}): Promise<AxiosResponse<ApiEnvelope<Record<string, unknown>>>> =>
  axiosInstance.post("/auth/forgot-password", body);

export const requestForVerifyForgotPassCode = (body: {
  email: string;
  token: string;
}): Promise<
  AxiosResponse<ApiEnvelope<{ success?: boolean; message?: string }>>
> => axiosInstance.post("/auth/verify-forgot-password-code", body);

export const requestForVerifyForgotPass = (body: {
  email: string;
  password: string;
  token: string;
}): Promise<AxiosResponse<ApiEnvelope<Record<string, unknown>>>> =>
  axiosInstance.post("/auth/verify-forgot-password", body);

export const requestForRetryForgotPassword = (body: {
  email: string;
}): Promise<AxiosResponse<ApiEnvelope<Record<string, unknown>>>> =>
  axiosInstance.post("/auth/retry-forgot-password", body);

export const requestForChangePassword = (body: {
  old_password: string;
  new_password: string;
}): Promise<AxiosResponse<ApiEnvelope<Record<string, unknown>>>> =>
  axiosInstance.post("/auth/change-password", body);

export const requestForGetUser = (): Promise<
  AxiosResponse<ApiEnvelope<UserData>>
> => axiosInstance.get("/auth/user");

export const requestForChangeEmail = (body: {
  email: string;
  new_email: string;
}): Promise<AxiosResponse<ApiEnvelope<Record<string, unknown>>>> =>
  axiosInstance.post("/auth/change-email", body);

export const requestForLogout = (body: {
  token: string | null;
  type: string;
}): Promise<AxiosResponse<ApiEnvelope<Record<string, unknown>>>> =>
  axiosInstance.post("/auth/logout", body);

export const requestForRefreshToken = (body: {
  refresh_token: string;
  access_token?: string;
  org_id?: string;
}): Promise<AxiosResponse<ApiEnvelope<TokenPair & { user?: UserData }>>> =>
  axiosInstance.post("/auth/refresh-token", body);

export const requestForGetOrgSubDomainAvailability = (
  subDomain: string,
): Promise<AxiosResponse<ApiEnvelope<SubDomainAvailabilityData>>> =>
  axiosInstance.get(
    `/organization/check-availability?sub_domain=${encodeURIComponent(subDomain)}`,
  );

export const requestForCreateOrganization = (
  body: CreateOrganizationParams,
): Promise<AxiosResponse<ApiEnvelope<{ id: string }>>> =>
  axiosInstance.post("/organization", body);

export const requestForGetAnOrganization = (
  subDomain: string,
): Promise<AxiosResponse<ApiEnvelope<UserData & { id: string }>>> =>
  axiosInstance.get(
    `/organization?sub_domain=${encodeURIComponent(subDomain)}`,
  );
