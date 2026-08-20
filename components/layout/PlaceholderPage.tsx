"use client";

import React from "react";
import { Card, Tag } from "antd";
import { RocketOutlined } from "@ant-design/icons";

interface PlaceholderPageProps {
  title: string;
  description: string;
  badge?: string;
}

const PlaceholderPage = ({
  title,
  description,
  badge = "Coming soon",
}: PlaceholderPageProps) => (
  <div className="animate-fade-up">
    <h1 className="font-poppins text-2xl font-semibold text-ink tracking-tight">
      {title}
    </h1>
    <p className="mt-1 mb-6 text-muted text-sm">{description}</p>

    <Card className="rounded-2xl shadow-card">
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="brand-gradient-soft flex h-14 w-14 items-center justify-center rounded-2xl">
          <RocketOutlined className="text-xl text-brand" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-ink">{title}</h3>
        <p className="mt-1 max-w-md text-sm text-muted">
          This view is being built. We&apos;re wiring it to real data next.
        </p>
        <Tag className="mt-4 rounded-full !bg-subtle !text-brand !border-none">
          {badge}
        </Tag>
      </div>
    </Card>
  </div>
);

export default PlaceholderPage;
