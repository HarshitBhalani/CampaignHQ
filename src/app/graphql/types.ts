// src/graphql/types.ts
export type Organization = {
  id: string;
  name: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
  organizationId: string;
};

export type CampaignStatus = 'ACTIVE' | 'PAUSED';

export type Campaign = {
  id: string;
  name: string;
  channel: 'GOOGLE' | 'META';
  status: CampaignStatus;
  organizationId: string;
};

export type MetricPoint = {
  date: string; // ISO
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
};

export type Note = {
  id: string;
  campaignId: string;
  authorId: string;
  content: string;
  createdAt: string;
};

export type Report = {
  id: string;
  name: string;
  filters: {
    dateFrom: string;
    dateTo: string;
    channel?: 'GOOGLE' | 'META';
  };
  organizationId: string;
  createdById: string;
  createdAt: string;
};
