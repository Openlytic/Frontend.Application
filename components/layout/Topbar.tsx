'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, Dropdown, Button } from 'antd';
import { LogoutOutlined, UserOutlined, MenuOutlined, DownOutlined } from '@ant-design/icons';
import { requestForGetUser, requestForLogout } from '@/helpers/restApiRequests';
import { getAccessToken, removeTokens } from '@/helpers/token';
import type { UserData } from '@/helpers/restApiRequests';

const initials = (name?: string, email?: string): string => {
  if (name) {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');
  }
  return (email || '?')[0].toUpperCase();
};

interface TopbarProps {
  onOpenSidebar: () => void;
}

const Topbar = ({ onOpenSidebar }: TopbarProps) => {
  const router = useRouter();
  const [user, setUser] = React.useState<UserData | null>(null);

  React.useEffect(() => {
    requestForGetUser()
      .then(({ data }) => setUser(data.data))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    try {
      await requestForLogout({ token: getAccessToken(), type: 'access_token' });
    } catch {
      // local logout regardless of server state
    } finally {
      removeTokens();
      router.push('/login');
    }
  };

  const displayName =
    [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.email || '';

  const userMenu = {
    items: [
      { key: 'profile', icon: <UserOutlined />, label: 'My profile', onClick: () => router.push('/my-profile') },
      { type: 'divider' as const },
      { key: 'logout', icon: <LogoutOutlined />, label: 'Sign out', onClick: handleLogout }
    ]
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-line bg-white/90 px-4 backdrop-blur sm:px-6">
      <Button
        type="text"
        icon={<MenuOutlined />}
        onClick={onOpenSidebar}
        className="lg:hidden !text-muted"
        aria-label="Open navigation"
      />
      <div className="flex-1" />
      <Dropdown menu={userMenu} placement="bottomRight" trigger={['click']}>
        <button className="flex items-center gap-2.5 rounded-xl border border-line bg-white px-2.5 py-1.5 hover:border-brand/40 transition-colors cursor-pointer">
          <Avatar
            size="small"
            className="!bg-brand !text-white font-medium"
            icon={!user?.first_name ? <UserOutlined /> : undefined}
          >
            {user?.first_name ? initials(displayName, user?.email) : undefined}
          </Avatar>
          <span className="hidden sm:block max-w-[180px] truncate text-sm font-medium text-ink">
            {displayName || 'Account'}
          </span>
          <DownOutlined className="text-xs text-muted" />
        </button>
      </Dropdown>
    </header>
  );
};

export default Topbar;