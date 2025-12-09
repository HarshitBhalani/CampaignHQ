// src/graphql/mockData.ts
import { Campaign, MetricPoint, Note, Organization, Report, User } from './types';

export const organizations: Organization[] = [
  { id: 'org_1', name: 'Demo Marketing Team' }
];

export const users: User[] = [
  {
    id: 'user_1',
    email: 'demo@campaignhq.com',
    name: 'Demo User',
    organizationId: 'org_1'
  }
];

export const campaigns: Campaign[] = [
  {
    id: 'camp_1',
    name: 'Google – Brand Search',
    channel: 'GOOGLE',
    status: 'ACTIVE',
    organizationId: 'org_1'
  },
  {
    id: 'camp_2',
    name: 'Meta – Retargeting',
    channel: 'META',
    status: 'PAUSED',
    organizationId: 'org_1'
  }
];

export const metricsByCampaignId: Record<string, MetricPoint[]> = {
  camp_1: [
    {
      date: '2025-12-01',
      impressions: 10000,
      clicks: 550,
      conversions: 40,
      cost: 300
    },
    {
      date: '2025-12-02',
      impressions: 12000,
      clicks: 600,
      conversions: 45,
      cost: 320
    }
  ],
  camp_2: [
    {
      date: '2025-12-01',
      impressions: 8000,
      clicks: 400,
      conversions: 20,
      cost: 150
    }
  ]
};

export const notes: Note[] = [
  {
    id: 'note_1',
    campaignId: 'camp_1',
    authorId: 'user_1',
    content: 'Increase budget by 20% on high CTR keywords.',
    createdAt: new Date().toISOString()
  }
];

// export const reports: Report[] = [];
export const reports: Report[] = [
  {
    id: 'report_1',
    name: 'Last 7 days – All channels',
    filters: {
      dateFrom: '2025-11-30',
      dateTo: '2025-12-06',
      channel: undefined as any
    },
    organizationId: 'org_1',
    createdById: 'user_1',
    createdAt: new Date('2025-12-06T10:00:00Z').toISOString()
  },
  {
    id: 'report_2',
    name: 'Google – High ROAS campaigns',
    filters: {
      dateFrom: '2025-11-01',
      dateTo: '2025-11-30',
      channel: 'GOOGLE'
    },
    organizationId: 'org_1',
    createdById: 'user_1',
    createdAt: new Date('2025-12-01T09:30:00Z').toISOString()
  }
];
