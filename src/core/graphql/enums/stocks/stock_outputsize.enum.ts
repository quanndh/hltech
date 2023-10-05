import { registerEnumType } from '@nestjs/graphql';

export enum StockOutputSizeEnum {
  compact = 'compact',
  full = 'full',
}

registerEnumType(StockOutputSizeEnum, {
  name: 'StockOutputSizeEnum',
});
