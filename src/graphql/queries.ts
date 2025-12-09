// src/graphql/queries.ts
import { gql } from '@apollo/client';

export const GET_CAMPAIGNS = gql`
  query GetCampaigns($filter: CampaignFilterInput, $pagination: PaginationInput) {
    campaigns(filter: $filter, pagination: $pagination) {
      total
      items {
        id
        name
        channel
        status
        metrics {
          date
          impressions
          clicks
          conversions
          cost
          roas
          ctr
        }
        notes {
          id
        }
      }
    }
  }
`;

export const GET_CAMPAIGN = gql`
  query GetCampaign($id: ID!) {
    campaign(id: $id) {
      id
      name
      channel
      status
      metrics {
        date
        impressions
        clicks
        conversions
        cost
        ctr
        roas
      }
      notes {
        id
        content
        createdAt
        author {
          name
        }
      }
    }
  }
`;

export const CREATE_NOTE = gql`
  mutation CreateNote($campaignId: ID!, $content: String!) {
    createNote(campaignId: $campaignId, content: $content) {
      id
      content
      createdAt
      author {
        name
      }
    }
  }
`;
export const UPDATE_NOTE = gql`
  mutation UpdateNote($id: ID!, $content: String!) {
    updateNote(id: $id, content: $content) {
      id
      content
      createdAt
      author {
        name
      }
    }
  }
`;

export const DELETE_NOTE = gql`
  mutation DeleteNote($id: ID!) {
    deleteNote(id: $id)
  }
`;


export const GET_ME = gql`
  query Me {
    me {
      id
      name
      email
      organization {
        id
        name
      }
    }
  }
`;

export const GET_REPORTS = gql`
  query GetReports {
    reports {
      id
      name
      filters {
        dateFrom
        dateTo
        channel
      }
      createdAt
      createdBy {
        name
      }
    }
  }
`;
