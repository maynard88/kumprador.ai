import { IsString, IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Market } from './Market';
import { Commodity } from './Commodity';

export class PriceData {
  @ValidateNested()
  @Type(() => Commodity)
  public readonly commodity: Commodity;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Market)
  public readonly markets: Market[];

  constructor(commodity: Commodity, markets: Market[]) {
    this.commodity = commodity;
    this.markets = markets;
  }

  public static create(commodity: Commodity, markets: Market[]): PriceData {
    return new PriceData(commodity, markets);
  }
}

