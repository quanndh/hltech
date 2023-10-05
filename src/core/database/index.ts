import { User } from '../../modules/users/entities/user.entity';
import * as dotenv from 'dotenv';
import { UserStock } from '../../modules/stock/entities/user_stock.entity';

dotenv.config();

export default {
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  dbName: process.env.DATABASE_NAME,
  type: 'postgresql' as
    | 'postgresql'
    | 'mongo'
    | 'mysql'
    | 'mariadb'
    | 'sqlite'
    | 'better-sqlite',
  entities: [User, UserStock],
};
