import { IsString, IsNotEmpty } from 'class-validator';

export class Commodity {
  @IsString()
  @IsNotEmpty()
  public readonly name: string;

  @IsString()
  @IsNotEmpty()
  public readonly specifications: string;

  constructor(name: string, specifications: string) {
    this.name = name;
    this.specifications = specifications;
  }

  public static fromStrings(name: string, specifications: string): Commodity {
    return new Commodity(name.trim(), specifications.trim());
  }
}
