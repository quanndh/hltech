import { Field, ObjectType } from '@nestjs/graphql';
import {
  IStockApiResponse,
  IStockInterval,
  IStockIntervalDetail,
  IStockMetadata,
} from 'src/modules/stock/interfaces/stock-api.interface';

@ObjectType()
export class StockRo {
  @Field()
  symbol: string;

  @Field()
  lastRefreshed: Date;

  @Field()
  timezone: string;

  @Field(() => [StockPriceRo])
  data: StockPriceRo[];

  constructor(data: IStockApiResponse) {
    const [metadata, stockInterval] = <[IStockMetadata, IStockInterval]>(
      Object.values(data)
    );

    this.symbol = metadata['2. Symbol'];
    this.lastRefreshed = new Date(metadata['3. Last Refreshed']);
    this.timezone = metadata['6. Time Zone'];

    this.data = Object.entries(stockInterval).map(
      ([key, value]) => new StockPriceRo(key, value),
    );
  }
}

@ObjectType()
export class StockPriceRo {
  @Field()
  time: Date;

  @Field()
  open: string;

  @Field()
  high: string;

  @Field()
  low: string;

  @Field()
  close: string;

  @Field()
  volume: string;

  constructor(time: string, data: IStockIntervalDetail) {
    this.time = new Date(time);
    this.open = data['1. open'];
    this.high = data['2. high'];
    this.low = data['3. low'];
    this.close = data['4. close'];
    this.volume = data['5. volume'];
  }
}
