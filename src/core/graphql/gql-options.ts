import {
  ApolloDriver,
  ApolloDriverConfig,
  AuthenticationError,
} from '@nestjs/apollo';
import { GraphQLError } from 'graphql';

export const gqlOptions: ApolloDriverConfig = {
  driver: ApolloDriver,
  fieldResolverEnhancers: ['guards', 'interceptors'],
  useGlobalPrefix: false,
  installSubscriptionHandlers: true,
  autoSchemaFile: true,
  // plugins: [new ComplexityPlugin(200)],
  // autoTransformHttpErrors: true,
  formatError: (error: GraphQLError) => {
    if (error.message === 'Unauthorized') {
      return new AuthenticationError('Unauthorized');
    }
    return error;
  },
  context: ({
    req,
    res,
    connection,
  }: {
    req: Request;
    res: Response;
    connection: { context: Request };
  }) => {
    if (connection) {
      // check connection for metadata
      return { req: connection.context, res };
    } else {
      // check from req
      // return new GraphQLContext(req, res);
      return { req, res };
    }
  },
};
