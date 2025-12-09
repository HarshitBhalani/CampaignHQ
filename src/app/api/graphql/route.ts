// src/app/api/graphql/route.ts
import { createYoga } from 'graphql-yoga';
import { schema } from '../../graphql/schema'; // path sahi rakho
import * as jwt from 'jsonwebtoken';

interface GraphQLContext {
  userId?: string;
}

const yogaApp = createYoga<GraphQLContext>({
  schema,                           
  graphqlEndpoint: '/api/graphql',
  fetchAPI: { Request, Response },  // Yoga + Next.js
  context: ({ request }) => {
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    let userId: string | undefined;

    if (token) {
      try {
        const payload = jwt.verify(
          token,
          process.env.JWT_SECRET || 'dev_secret'
        ) as jwt.JwtPayload;

        if (typeof payload.sub === 'string') {
          userId = payload.sub;
        }
      } catch {
        // invalid token -> anonymous
      }
    }

    return { userId };
  },
});

export { yogaApp as GET, yogaApp as POST, yogaApp as OPTIONS };
