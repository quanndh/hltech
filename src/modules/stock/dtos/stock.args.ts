import { ArgsType, Field } from '@nestjs/graphql';
import { QueryStockFunc } from 'src/core/graphql/enums/stocks/query_stock_func.enum';
import { StockDatatypeEnum } from 'src/core/graphql/enums/stocks/stock_datatype.enum';
import { StockIntervalEnum } from 'src/core/graphql/enums/stocks/stock_interval.enum';
import { StockOutputSizeEnum } from 'src/core/graphql/enums/stocks/stock_outputsize.enum';

@ArgsType()
export class QueryStockArgs {
  @Field()
  symbol: string;

  @Field(() => StockIntervalEnum, { defaultValue: StockIntervalEnum['5min'] })
  interval: StockIntervalEnum;

  @Field(() => QueryStockFunc, {
    nullable: true,
    defaultValue: QueryStockFunc.TIME_SERIES_INTRADAY,
  })
  function: QueryStockFunc;

  @Field({ nullable: true })
  adjusted?: boolean;

  @Field({ nullable: true })
  extended_hours?: boolean;

  @Field({ nullable: true })
  month?: string;

  @Field(() => StockOutputSizeEnum, { nullable: true })
  outputsize?: StockOutputSizeEnum;

  @Field(() => StockDatatypeEnum, { nullable: true })
  datatype?: StockDatatypeEnum;
}
