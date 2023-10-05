import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { UserStock } from '../../../modules/stock/entities/user_stock.entity';

@ObjectType()
@Entity({
  tableName: 'users',
})
export class User {
  @Field()
  @PrimaryKey({ autoincrement: true })
  id: number;

  @Field()
  @Property({ unique: true })
  username: string;

  @Field()
  @Property()
  password: string;

  @Field()
  @Property()
  passwordSalt: string;

  @OneToMany(() => UserStock, (stock) => stock.user)
  stocks = new Collection<UserStock>(this);

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
