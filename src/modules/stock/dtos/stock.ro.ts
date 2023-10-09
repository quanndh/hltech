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

  @Field({ nullable: true })
  timezone?: string;

  @Field(() => [StockPriceRo])
  data: StockPriceRo[];

  public static fromJson(data: IStockApiResponse) {
    const stockRo = new StockRo();
    const [metadata, stockInterval] = <[IStockMetadata, IStockInterval]>(
      Object.values(data)
    );

    stockRo.symbol = metadata['2. Symbol'];
    stockRo.lastRefreshed = new Date(metadata['3. Last Refreshed']);
    stockRo.timezone = metadata['6. Time Zone'];

    stockRo.data = Object.entries(stockInterval).map(
      ([key, value]) => new StockPriceRo(key, value),
    );
    return stockRo;
  }

  public static fromCsv(data: string[], symbol: string) {
    const stockRo = new StockRo();

    stockRo.symbol = symbol;
    stockRo.data = data
      .filter((row) => row.trim().length)
      .map((row) => {
        const [time, open, high, low, close, volumn] = row.split(',');
        return new StockPriceRo(time, {
          '1. open': open,
          '2. high': high,
          '3. low': low,
          '4. close': close,
          '5. volume': volumn,
        });
      });
    stockRo.lastRefreshed = stockRo.data[0].time;

    return stockRo;
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
