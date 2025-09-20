import { IsString, IsNotEmpty } from 'class-validator';

export class Market {
  @IsString()
  @IsNotEmpty()
  public readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  public static fromString(marketName: string): Market {
    return new Market(marketName.trim());
  }
}

