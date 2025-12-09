// src/graphql/schema.ts
import { createSchema } from 'graphql-yoga';
import {
  campaigns,
  metricsByCampaignId,
  notes,
  organizations,
  reports,
  users
} from './mockData';
import { CampaignStatus } from './types';
import { GraphQLError } from 'graphql';

type YogaContext = {
  userId?: string;
};

const typeDefs = /* GraphQL */ `
  type Organization {
    id: ID!
    name: String!
  }

  type User {
    id: ID!
    email: String!
    name: String!
    organization: Organization!
  }

  enum CampaignStatus {
    ACTIVE
    PAUSED
  }

  enum Channel {
    GOOGLE
    META
  }

  type Campaign {
    id: ID!
    name: String!
    channel: Channel!
    status: CampaignStatus!
    organizationId: ID!
    metrics: [MetricPoint!]!
    notes: [Note!]!
  }

  type MetricPoint {
    date: String!
    impressions: Int!
    clicks: Int!
    conversions: Int!
    cost: Float!
    ctr: Float!
    cpc: Float!
    roas: Float!
  }

  type Note {
    id: ID!
    campaignId: ID!
    author: User!
    content: String!
    createdAt: String!
  }

  type Report {
    id: ID!
    name: String!
    filters: ReportFilters!
    organizationId: ID!
    createdBy: User!
    createdAt: String!
  }

  type ReportFilters {
    dateFrom: String!
    dateTo: String!
    channel: Channel
  }

  input CampaignFilterInput {
    channel: Channel
    status: CampaignStatus
    search: String
  }

  input PaginationInput {
    offset: Int
    limit: Int
  }

  input ReportFilterInput {
    dateFrom: String!
    dateTo: String!
    channel: Channel
  }

  type CampaignConnection {
    items: [Campaign!]!
    total: Int!
  }

  type Query {
    me: User
    campaigns(filter: CampaignFilterInput, pagination: PaginationInput): CampaignConnection!
    campaign(id: ID!): Campaign
    reports: [Report!]!
  }

  type Mutation {
    updateCampaignStatus(id: ID!, status: CampaignStatus!): Campaign!
    createNote(campaignId: ID!, content: String!): Note!
    updateNote(id: ID!, content: String!): Note!
    deleteNote(id: ID!): Boolean!
    createReport(name: String!, filters: ReportFilterInput!): Report!
  }
`;

const resolvers = {
  Query: {
    me: (_: unknown, __: unknown, ctx: YogaContext) => {
      if (!ctx.userId) return null;
      return users.find((u) => u.id === ctx.userId) ?? null;
    },
    campaigns: (
      _: unknown,
      args: { filter?: any; pagination?: { offset?: number; limit?: number } },
      ctx: YogaContext
    ) => {
      if (!ctx.userId) {
        throw new GraphQLError('Unauthorized');
      }

      const me = users.find((u) => u.id === ctx.userId);
      if (!me) throw new GraphQLError('User not found');

      let filtered = campaigns.filter((c) => c.organizationId === me.organizationId);

      if (args.filter?.channel) {
        filtered = filtered.filter((c) => c.channel === args.filter.channel);
      }
      if (args.filter?.status) {
        filtered = filtered.filter((c) => c.status === args.filter.status);
      }
      if (args.filter?.search) {
        const s = args.filter.search.toLowerCase();
        filtered = filtered.filter((c) => c.name.toLowerCase().includes(s));
      }

      const total = filtered.length;
      const offset = args.pagination?.offset ?? 0;
      const limit = args.pagination?.limit ?? 20;

      return {
        items: filtered.slice(offset, offset + limit),
        total
      };
    },
    campaign: (_: unknown, { id }: { id: string }, ctx: YogaContext) => {
      if (!ctx.userId) throw new GraphQLError('Unauthorized');
      const me = users.find((u) => u.id === ctx.userId);
      const campaign = campaigns.find((c) => c.id === id && c.organizationId === me?.organizationId);
      return campaign ?? null;
    },
    reports: (_: unknown, __: unknown, ctx: YogaContext) => {
      if (!ctx.userId) throw new GraphQLError('Unauthorized');
      const me = users.find((u) => u.id === ctx.userId);
      return reports.filter((r) => r.organizationId === me?.organizationId);
    }
  },

  Mutation: {
    updateCampaignStatus: (
      _: unknown,
      { id, status }: { id: string; status: CampaignStatus },
      ctx: YogaContext
    ) => {
      if (!ctx.userId) throw new GraphQLError('Unauthorized');
      const idx = campaigns.findIndex((c) => c.id === id);
      if (idx === -1) throw new GraphQLError('Campaign not found');
      campaigns[idx].status = status;
      return campaigns[idx];
    },

    createNote: (
      _: unknown,
      { campaignId, content }: { campaignId: string; content: string },
      ctx: YogaContext
    ) => {
      if (!ctx.userId) throw new GraphQLError('Unauthorized');
      const id = `note_${notes.length + 1}`;
      const note = {
        id,
        campaignId,
        authorId: ctx.userId,
        content,
        createdAt: new Date().toISOString()
      };
      notes.push(note);
      return note;
    },

    updateNote: (
      _: unknown,
      { id, content }: { id: string; content: string },
      ctx: YogaContext
    ) => {
      if (!ctx.userId) throw new GraphQLError('Unauthorized');
      const note = notes.find((n) => n.id === id);
      if (!note) throw new GraphQLError('Note not found');
      note.content = content;
      return note;
    },

    deleteNote: (_: unknown, { id }: { id: string }, ctx: YogaContext) => {
      if (!ctx.userId) throw new GraphQLError('Unauthorized');
      const idx = notes.findIndex((n) => n.id === id);
      if (idx === -1) return false;
      notes.splice(idx, 1);
      return true;
    },

    createReport: (
      _: unknown,
      { name, filters }: { name: string; filters: any },
      ctx: YogaContext
    ) => {
      if (!ctx.userId) throw new GraphQLError('Unauthorized');
      const me = users.find((u) => u.id === ctx.userId);
      if (!me) throw new GraphQLError('User not found');
      const id = `report_${reports.length + 1}`;
      const report = {
        id,
        name,
        filters,
        organizationId: me.organizationId,
        createdById: me.id,
        createdAt: new Date().toISOString()
      };
      reports.push(report);
      return report;
    }
  },

  User: {
    organization: (user: any) => organizations.find((o) => o.id === user.organizationId)
  },

  Campaign: {
    metrics: (campaign: any) => {
      const raw = metricsByCampaignId[campaign.id] ?? [];
      return raw.map((m) => {
        const ctr = m.impressions ? m.clicks / m.impressions : 0;
        const cpc = m.clicks ? m.cost / m.clicks : 0;
        const roas = m.cost ? (m.conversions * 50) / m.cost : 0; // fake revenue
        return {
          ...m,
          ctr,
          cpc,
          roas
        };
      });
    },
    notes: (campaign: any) => notes.filter((n) => n.campaignId === campaign.id)
  },

  Note: {
    author: (note: any) => users.find((u) => u.id === note.authorId)
  },

  Report: {
    createdBy: (report: any) => users.find((u) => u.id === report.createdById)
  }
};

export const schema = createSchema({
  typeDefs,
  resolvers
});
