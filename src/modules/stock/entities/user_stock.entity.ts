import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { PaginationBase } from '../../../core/graphql/types/common_entity.interface';
import { User } from '../../../modules/users/entities/user.entity';

@ObjectType()
@Entity({
  tableName: 'user_stocks',
})
@Unique({ properties: ['user', 'symbol'] })
export class UserStock {
  @Field()
  @PrimaryKey({ autoincrement: true })
  id: number;

  @ManyToOne(() => User)
  user: User;

  @Field()
  @Property()
  symbol: string;

  @Field()
  @Property()
  lastSearched: Date;
}

@ObjectType()
export class UserStockConnection extends PaginationBase(UserStock) {}
