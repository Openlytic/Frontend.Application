'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AppstoreOutlined,
  MailOutlined,
  BarChartOutlined,
  SettingOutlined,
  UserOutlined
} from '@ant-design/icons';
import { OpenlyticMark } from '@/components/core/OpenlyticLogo';

interface NavItem {
  key: string;
  label: string;
  icon: React.ReactNode;
}

export const NAV_ITEMS: NavItem[] = [
  { key: '/', label: 'Dashboard', icon: <AppstoreOutlined /> },
  { key: '/emails', label: 'Emails', icon: <MailOutlined /> },
  { key: '/analytics', label: 'Analytics', icon: <BarChartOutlined /> },
  { key: '/settings', label: 'Settings', icon: <SettingOutlined /> },
  { key: '/my-profile', label: 'My profile', icon: <UserOutlined /> }
];

interface SidebarNavProps {
  pathname: string;
  onNavigate?: () => void;
}

const SidebarNav = ({ pathname, onNavigate }: SidebarNavProps) => {
  const isActive = (key: string) => (key === '/' ? pathname === key : pathname.startsWith(key));

  return (
    <nav className="mt-2 flex-1 space-y-1 px-3">
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.key);
        return (
          <Link
            key={item.key}
            href={item.key}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
              active
                ? 'bg-white/10 text-white'
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className={`text-base ${active ? 'text-accent' : 'text-white/50'}`}>{item.icon}</span>
            {item.label}
            {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />}
          </Link>
        );
      })}
    </nav>
  );
};

const SidebarBrand = () => (
  <div className="flex items-center gap-2.5 px-5 h-16">
    <OpenlyticMark className="h-8 w-8" gradientId="oly-mark-side" />
    <span className="font-poppins text-lg font-semibold tracking-tight text-white">Openlytic</span>
  </div>
);

interface SidebarProps {
  onNavigate?: () => void;
}

const Sidebar = ({ onNavigate }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-ink">
      <SidebarBrand />
      <SidebarNav pathname={pathname} onNavigate={onNavigate} />
      <div className="mx-3 mb-4 rounded-2xl bg-white/5 p-4">
        <p className="text-sm font-medium text-white">Openlytic Pro</p>
        <p className="mt-1 text-xs leading-relaxed text-white/50">
          Unlimited email tracking, link analytics and deliverability events.
        </p>
      </div>
    </div>
  );
};

export default Sidebar;