import { Controller, Get } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
  @Query(() => String)
  healthz(): string {
    return 'Server is running';
  }
}
