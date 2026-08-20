import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export const TOKEN_COOKIE = "accessToken";
export const REFRESH_TOKEN_COOKIE = "refreshToken";
export const SIGNUP_USER_COOKIE = "signupUser";
export const RESET_EMAIL_COOKIE = "resetPasswordEmail";
export const RESET_TOKEN_COOKIE = "resetPasswordToken";

const COOKIE_OPTS: Cookies.CookieAttributes = {
  path: "/",
  expires: 30,
  sameSite: "Lax",
};

export interface TokenPair {
  access_token?: string;
  refresh_token?: string;
  org_id?: string;
}

export interface SignupUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export const getAccessToken = (): string | null =>
  Cookies.get(TOKEN_COOKIE) || null;
export const getRefreshToken = (): string | null =>
  Cookies.get(REFRESH_TOKEN_COOKIE) || null;

export const setTokens = ({ access_token, refresh_token }: TokenPair): void => {
  if (access_token) Cookies.set(TOKEN_COOKIE, access_token, COOKIE_OPTS);
  if (refresh_token)
    Cookies.set(REFRESH_TOKEN_COOKIE, refresh_token, COOKIE_OPTS);
};

export const removeTokens = (): void => {
  Cookies.remove(TOKEN_COOKIE, { path: "/" });
  Cookies.remove(REFRESH_TOKEN_COOKIE, { path: "/" });
};

export interface AccessTokenPayload {
  sub?: string;
  user_id?: string;
  org_id?: string;
  roles?: string[];
  exp?: number;
  [key: string]: unknown;
}

export const decodeAccessToken = (
  token?: string | null,
): AccessTokenPayload | null => {
  if (!token) return null;
  try {
    return jwtDecode<AccessTokenPayload>(token);
  } catch {
    return null;
  }
};

export const getUserFromAccessToken = (): AccessTokenPayload | null =>
  decodeAccessToken(getAccessToken());

// Temp pre-auth identity used by the signup / verification / onboarding flow.
export const getSignupUser = (): SignupUser | null => {
  try {
    const raw = Cookies.get(SIGNUP_USER_COOKIE);
    return raw ? (JSON.parse(raw) as SignupUser) : null;
  } catch {
    return null;
  }
};

export const setSignupUser = ({
  id,
  email,
  first_name,
  last_name,
}: SignupUser): void => {
  Cookies.set(
    SIGNUP_USER_COOKIE,
    JSON.stringify({
      id,
      email,
      first_name: first_name || "",
      last_name: last_name || "",
    }),
    { path: "/", expires: 1, sameSite: "Lax" },
  );
};

export const clearSignupUser = (): void => {
  Cookies.remove(SIGNUP_USER_COOKIE, { path: "/" });
};

export const getResetEmail = (): string | null =>
  Cookies.get(RESET_EMAIL_COOKIE) || null;

export const setResetEmail = (email: string): void => {
  Cookies.set(RESET_EMAIL_COOKIE, email, {
    path: "/",
    expires: 1,
    sameSite: "Lax",
  });
};

export const clearResetEmail = (): void => {
  Cookies.remove(RESET_EMAIL_COOKIE, { path: "/" });
};

export const getResetToken = (): string | null =>
  Cookies.get(RESET_TOKEN_COOKIE) || null;

export const setResetToken = (token: string): void => {
  Cookies.set(RESET_TOKEN_COOKIE, token, {
    path: "/",
    expires: 1,
    sameSite: "Lax",
  });
};

export const clearResetToken = (): void => {
  Cookies.remove(RESET_TOKEN_COOKIE, { path: "/" });
};
