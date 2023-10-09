import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ApolloError } from 'apollo-server';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { StockDatatypeEnum } from 'src/core/graphql/enums/stocks/stock_datatype.enum';
import { BasePaginationArgs } from 'src/core/graphql/types/common.args';
import { createPaginationObject } from 'src/core/helpers/resolve-pagination';
import { QueryStockArgs } from 'src/modules/stock/dtos/stock.args';
import { StockRo } from 'src/modules/stock/dtos/stock.ro';
import { UserStock } from 'src/modules/stock/entities/user_stock.entity';
import { IStockApiResponse } from 'src/modules/stock/interfaces/stock-api.interface';
import { User } from 'src/modules/users/entities/user.entity';

@Injectable()
export class StockService {
  private readonly logger = new Logger(StockService.name);

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(UserStock)
    private readonly userStockRepository: EntityRepository<UserStock>,
  ) {}

  private readonly baseUrl = 'https://www.alphavantage.co/query';

  queryStockData = async (args: QueryStockArgs, user: User) => {
    const query = this.buildQuery(args);
    const url = `${this.baseUrl}?${query}`;

    const { data } = await firstValueFrom(
      this.httpService.get<IStockApiResponse | string>(url).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'An error happened!';
        }),
      ),
    );
    if (data['Error Message']) {
      throw new ApolloError('Invalid symbol');
    }

    let stockRo: StockRo;

    if (args.datatype === StockDatatypeEnum.csv) {
      const [_, ...stockData] = (data as string).split('\r\n');
      stockRo = StockRo.fromCsv(stockData, args.symbol);
    } else {
      stockRo = StockRo.fromJson(data as IStockApiResponse);
    }

    await this.userStockRepository.upsert({
      user: user,
      symbol: args.symbol,
      lastSearched: new Date(),
    });

    return stockRo;
  };

  private buildQuery = (args: QueryStockArgs) => {
    const payload = {
      ...args,
      apikey: process.env.API_KEY,
    };
    const query: string[] = [];
    Object.entries(payload)
      .sort()
      .forEach(([key, value]) => {
        if (key !== 'sign') query.push(`${key}=${value}`);
      });

    return query.join('&');
  };

  myStock = async (args: BasePaginationArgs, user: User) => {
    const [items, total] = await this.userStockRepository.findAndCount(
      {
        user,
      },
      {
        limit: args.limit,
        offset: (args.page - 1) * args.limit,
        orderBy: {
          lastSearched: 'DESC',
        },
      },
    );

    return createPaginationObject(items, total, args.page, args.limit);
  };
}
