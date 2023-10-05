import { registerEnumType } from '@nestjs/graphql';

export enum QueryStockFunc {
  TIME_SERIES_INTRADAY = 'TIME_SERIES_INTRADAY',
  TIME_SERIES_DAILY = 'TIME_SERIES_DAILY',
}

registerEnumType(QueryStockFunc, {
  name: 'QueryStockFunc',
});
