import { IsString, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class PriceRequest {
  @IsString()
  @IsNotEmpty()
  public readonly commodity: string;

  @IsString()
  @IsNotEmpty()
  public readonly region: string;

  @IsNumber()
  @Min(1)
  @Max(100)
  public readonly count: number;

  constructor(commodity: string, region: string, count: number) {
    this.commodity = commodity;
    this.region = region;
    this.count = count;
  }

  public static create(commodity: string, region: string, count: number): PriceRequest {
    return new PriceRequest(commodity, region, count);
  }
}
