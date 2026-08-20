'use client';

import React from 'react';
import Link from 'next/link';
import { OpenlyticMark } from '@/components/core/OpenlyticLogo';

interface Highlight {
  title: string;
  body: string;
}

interface AuthShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const highlights: Highlight[] = [
  {
    title: 'Send, then stop worrying',
    body: 'Every email you send is automatically wrapped with invisible open + click tracking.'
  },
  {
    title: 'Know exactly what happened',
    body: 'Opens, clicks, link-level analytics and delivery events — one clean timeline.'
  },
  {
    title: 'Built for small teams',
    body: 'No marketing automation bloat. Track your transactional and sales email, nothing else.'
  }
];

const AuthShell = ({ title, subtitle, children, footer }: AuthShellProps) => (
  <div className="min-h-screen flex bg-page">
    <div className="hidden lg:flex w-[46%] xl:w-[42%] brand-gradient text-white flex-col justify-between p-10 xl:p-12">
      <div className="flex items-center gap-2.5">
        <OpenlyticMark className="h-9 w-9" gradientId="oly-mark-auth" />
        <span className="font-poppins text-2xl font-semibold tracking-tight">Openlytic</span>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="font-poppins text-3xl xl:text-4xl font-semibold leading-tight tracking-tight">
            Email tracking that stays out of your way.
          </h2>
          <p className="mt-4 text-white/75 text-lg leading-relaxed">
            See who opened your email, what they clicked, and when — automatically.
          </p>
        </div>

        <div className="space-y-5">
          {highlights.map((item) => (
            <div key={item.title} className="flex gap-3.5">
              <div className="mt-1 h-2 w-2 rounded-full bg-white/80 shrink-0" />
              <div>
                <p className="font-medium text-white text-sm">{item.title}</p>
                <p className="mt-0.5 text-white/70 text-sm leading-relaxed">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-white/50 text-xs">Openlytic · Sales &amp; email intelligence for small teams</p>
    </div>

    <div className="flex-1 flex items-center justify-center p-6 lg:p-10">
      <div className="w-full max-w-md animate-fade-up">
        <div className="lg:hidden mb-8 flex justify-center">
          <OpenlyticMark className="h-12 w-12" gradientId="oly-mark-mobile" />
        </div>

        <h1 className="font-poppins text-2xl font-semibold text-ink tracking-tight">{title}</h1>
        {subtitle && <p className="mt-2 text-muted text-sm leading-relaxed">{subtitle}</p>}

        <div className="mt-8">{children}</div>

        {footer && <div className="mt-6 text-center text-sm text-muted">{footer}</div>}
      </div>
    </div>
  </div>
);

interface AuthFooterLinkProps {
  text: string;
  href: string;
  label: string;
}

export const AuthFooterLink = ({ text, href, label }: AuthFooterLinkProps) => (
  <span>
    {text}{' '}
    <Link href={href} className="font-medium text-brand hover:text-brand-hover">
      {label}
    </Link>
  </span>
);

export default AuthShell;