import { Args, Query, Resolver } from '@nestjs/graphql';
import {
  Authenticated,
  CurrentUser,
} from 'src/core/decorators/common.decorator';
import { BasePaginationArgs } from 'src/core/graphql/types/common.args';
import { QueryStockArgs } from 'src/modules/stock/dtos/stock.args';
import { StockRo } from 'src/modules/stock/dtos/stock.ro';
import { UserStockConnection } from 'src/modules/stock/entities/user_stock.entity';
import { StockService } from 'src/modules/stock/services/stock.service';
import { User } from 'src/modules/users/entities/user.entity';

@Resolver()
export class StockQueryResolver {
  constructor(private readonly stockService: StockService) {}

  @Authenticated()
  @Query(() => StockRo)
  queryStock(@Args() args: QueryStockArgs, @CurrentUser() user: User) {
    return this.stockService.queryStockData(args, user);
  }

  @Authenticated()
  @Query(() => UserStockConnection)
  myStock(@Args() args: BasePaginationArgs, @CurrentUser() user: User) {
    return this.stockService.myStock(args, user);
  }
}
