import { ArgsType, Field, InputType, Int } from '@nestjs/graphql';

@ArgsType()
@InputType()
export class BasePaginationArgs {
  @Field(() => Int, {
    defaultValue: 20,
  })
  limit: number;

  @Field(() => Int, {
    defaultValue: 1,
  })
  page: number;
}
