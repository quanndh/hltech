import { registerEnumType } from '@nestjs/graphql';

export enum StockIntervalEnum {
  one = '1min',
  five = '5min',
  fifthteen = '15min',
  thirdty = '30min',
  sixty = '60min',
}

registerEnumType(StockIntervalEnum, {
  name: 'StockIntervalEnum',
});
