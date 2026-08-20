"use client";

import React from "react";
import { Tag } from "antd";

export const STATUS_TAG: Record<string, { color: string; label: string }> = {
  delivered: { color: "success", label: "Delivered" },
  opened: { color: "processing", label: "Opened" },
  clicked: { color: "purple", label: "Clicked" },
  bounced: { color: "error", label: "Bounced" },
  complained: { color: "error", label: "Complained" },
  rejected: { color: "error", label: "Rejected" },
  pending: { color: "default", label: "Pending" },
  sent: { color: "geekblue", label: "Sent" },
  failed: { color: "error", label: "Failed" },
};

interface EmailStatusTagProps {
  status?: string | null;
}

const EmailStatusTag = ({ status }: EmailStatusTagProps) => {
  const config = STATUS_TAG[status || ""];
  if (!config) return <Tag>{status || "—"}</Tag>;
  return <Tag color={config.color}>{config.label}</Tag>;
};

export default EmailStatusTag;
