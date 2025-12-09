  import { NextRequest } from 'next/server';
  import { createYoga, createSchema } from 'graphql-yoga';
  import { schema } from '../../graphql/schema';

  export const config = {
    api: {
      bodyParser: false,
    },
  };

  const yoga = createYoga({
    schema,
    graphqlEndpoint: '/api/graphql',
  });

  export async function POST(request: NextRequest) {
    return yoga.fetch(request);
  }

  export async function GET(request: NextRequest) {
    return yoga.fetch(request);
  }
