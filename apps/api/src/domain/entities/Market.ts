import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class Market {
  @IsString()
  @IsNotEmpty()
  public readonly name: string;

  @IsOptional()
  @IsNumber()
  public readonly price?: number;

  constructor(name: string, price?: number) {
    this.name = name;
    this.price = price;
  }

  public static fromString(marketName: string): Market {
    return new Market(marketName.trim());
  }

  public static fromStringWithPrice(marketName: string, price?: number): Market {
    return new Market(marketName.trim(), price);
  }
}

