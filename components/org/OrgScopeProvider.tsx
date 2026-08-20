"use client";

import React from "react";
import { Spin } from "antd";
import {
  requestForGetUser,
  requestForRefreshToken,
  type OrganizationMembershipData,
} from "@/helpers/restApiRequests";
import {
  decodeAccessToken,
  getAccessToken,
  getOrgId,
  getRefreshToken,
  setOrgId,
  setTokens,
} from "@/helpers/token";

interface OrgScopeContextValue {
  organizations: OrganizationMembershipData[];
  activeOrgId: string | null;
  switchingOrg: boolean;
  switchOrg: (orgId: string) => Promise<void>;
}

const OrgScopeContext = React.createContext<OrgScopeContextValue>({
  organizations: [],
  activeOrgId: null,
  switchingOrg: false,
  switchOrg: async () => undefined,
});

export const useOrgScope = (): OrgScopeContextValue =>
  React.useContext(OrgScopeContext);

const OrgScopeProvider = ({ children }: { children: React.ReactNode }) => {
  const [organizations, setOrganizations] = React.useState<
    OrganizationMembershipData[]
  >([]);
  const [activeOrgId, setActiveOrgId] = React.useState<string | null>(null);
  const [switchingOrg, setSwitchingOrg] = React.useState(false);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const tokenOrgId =
          decodeAccessToken(getAccessToken())?.org_id || null;
        const { data } = await requestForGetUser();
        if (cancelled) return;
        const orgs = data.data.organizations || [];
        setOrganizations(orgs);
        if (!orgs.length) {
          setActiveOrgId(tokenOrgId);
          setReady(true);
          return;
        }
        const saved = getOrgId();
        const preferred =
          (saved && orgs.some((org) => org.org_id === saved) && saved) ||
          (tokenOrgId && orgs.some((org) => org.org_id === tokenOrgId) && tokenOrgId) ||
          orgs[0].org_id;
        if (preferred && preferred !== tokenOrgId) {
          const refresh = getRefreshToken();
          if (refresh) {
            const res = await requestForRefreshToken({
              refresh_token: refresh,
              org_id: preferred,
            });
            if (cancelled) return;
            setTokens(res.data.data);
            setOrgId(preferred);
            setActiveOrgId(preferred);
            setReady(true);
            return;
          }
        }
        setActiveOrgId(preferred || tokenOrgId);
        if (preferred) setOrgId(preferred);
        setReady(true);
      } catch {
        if (!cancelled) setReady(true);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const switchOrg = React.useCallback(
    async (orgId: string) => {
      if (!orgId || orgId === activeOrgId) return;
      const refresh = getRefreshToken();
      if (!refresh) return;
      setSwitchingOrg(true);
      try {
        const res = await requestForRefreshToken({
          refresh_token: refresh,
          org_id: orgId,
        });
        setTokens(res.data.data);
        setOrgId(orgId);
        setActiveOrgId(orgId);
      } finally {
        setSwitchingOrg(false);
      }
    },
    [activeOrgId],
  );

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-page">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <OrgScopeContext.Provider
      value={{ organizations, activeOrgId, switchingOrg, switchOrg }}
    >
      {children}
    </OrgScopeContext.Provider>
  );
};

export default OrgScopeProvider;