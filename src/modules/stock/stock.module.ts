import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { StockQueryResolver } from 'src/modules/stock/resolvers/stock.query.resolver';
import { StockService } from 'src/modules/stock/services/stock.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserStock } from 'src/modules/stock/entities/user_stock.entity';

@Module({
  imports: [HttpModule, MikroOrmModule.forFeature([UserStock])],
  providers: [StockService, StockQueryResolver],
  exports: [],
})
export class StockModule {}
