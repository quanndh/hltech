import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { gqlOptions } from 'src/core/graphql/gql-options';
import { UserModule } from 'src/modules/users/user.module';
import { AppResolver } from 'src/app.resolver';
import dbConfigs from 'src/core/database';
import * as dotenv from 'dotenv';
import { StockModule } from 'src/modules/stock/stock.module';
import { AuthModule } from 'src/modules/auth/auth.module';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.development', '.env.production'],
      expandVariables: true,
      isGlobal: true,
    }),
    MikroOrmModule.forRoot(dbConfigs),
    GraphQLModule.forRoot<ApolloDriverConfig>(gqlOptions),
    UserModule,
    StockModule,
    AuthModule,
  ],
  providers: [AppResolver],
})
export class AppModule {}
