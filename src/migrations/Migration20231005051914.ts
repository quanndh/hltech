import { Migration } from '@mikro-orm/migrations';

export class Migration20231005051914 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "users" ("id" serial primary key, "username" varchar(255) not null, "password" varchar(255) not null, "password_salt" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
    this.addSql('alter table "users" add constraint "users_username_unique" unique ("username");');

    this.addSql('create table "user_stocks" ("id" serial primary key, "user_id" int not null, "symbol" varchar(255) not null, "last_searched" timestamptz(0) not null);');
    this.addSql('alter table "user_stocks" add constraint "user_stocks_user_id_symbol_unique" unique ("user_id", "symbol");');

    this.addSql('alter table "user_stocks" add constraint "user_stocks_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user_stocks" drop constraint "user_stocks_user_id_foreign";');

    this.addSql('drop table if exists "users" cascade;');

    this.addSql('drop table if exists "user_stocks" cascade;');
  }

}
