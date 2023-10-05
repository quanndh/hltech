import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { GraphQLResolveInfo } from 'graphql';
import { GqlAuthGuard } from 'src/core/guards/gql-auth.guard';
import { User } from 'src/modules/users/entities/user.entity';

type GraphqlContext = {
  req: Request;
  res: Response;
};

type GraphQLExecutionContext = [any, any, GraphqlContext, GraphQLResolveInfo];

export const AcceptLang = createParamDecorator<
  unknown,
  ExecutionContext,
  string | Promise<string>
>((_data, host) => {
  const [, , ctx] = host.getArgs<GraphQLExecutionContext>();
  return ctx?.req?.acceptsLanguages(['en', 'vi']) || 'en';
});

export const GraphQLInfo = createParamDecorator<
  any,
  ExecutionContext,
  GraphQLResolveInfo
>((_data, host) => {
  const [, , , info] = host.getArgs<GraphQLExecutionContext>();
  return info;
});

export const CurrentUser = createParamDecorator<
  keyof User,
  ExecutionContext,
  any
>((field, host) => {
  const [, , ctx] = host.getArgs<any>();

  return field ? ctx?.req?.user?.[field] : ctx?.req?.user;
});

export const Authenticated = () => {
  return applyDecorators(UseGuards(GqlAuthGuard));
};
