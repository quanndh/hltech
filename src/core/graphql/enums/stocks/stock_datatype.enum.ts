import { registerEnumType } from '@nestjs/graphql';

export enum StockDatatypeEnum {
  json = 'json',
  csv = 'csv',
}

registerEnumType(StockDatatypeEnum, {
  name: 'StockDatatypeEnum',
});
