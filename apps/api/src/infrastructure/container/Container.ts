import { AxiosHttpClient } from '../http/AxiosHttpClient';
import { CheerioHtmlParser } from '../parsers/CheerioHtmlParser';
import { BantayPresyoRepository } from '../repositories/BantayPresyoRepository';
import { GetPriceDataUseCase } from '../../application/use-cases/GetPriceDataUseCase';
import { MongoConnection } from '../database/MongoConnection';
import { MongoPriceDataRepository } from '../repositories/MongoPriceDataRepository';
import { defaultMongoConfig } from '../database/MongoConfig';

export class Container {
  private static instance: Container;
  private dependencies: Map<string, any> = new Map();

  private constructor() {
    this.registerDependencies();
  }

  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  private registerDependencies(): void {
    // Register HTTP Client
    this.dependencies.set('httpClient', new AxiosHttpClient());

    // Register HTML Parser
    this.dependencies.set('htmlParser', new CheerioHtmlParser());

    // Register MongoDB Connection
    this.dependencies.set('mongoConnection', new MongoConnection(defaultMongoConfig));

    // Register MongoDB Repository
    this.dependencies.set('priceDataRepository', new MongoPriceDataRepository(
      this.dependencies.get('mongoConnection')
    ));

    // Register Bantay Presyo Repository
    this.dependencies.set('bantayPresyoRepository', new BantayPresyoRepository(
      this.dependencies.get('httpClient'),
      this.dependencies.get('htmlParser'),
      this.dependencies.get('priceDataRepository')
    ));

    // Register Use Cases
    this.dependencies.set('getPriceDataUseCase', new GetPriceDataUseCase(
      this.dependencies.get('bantayPresyoRepository')
    ));
  }

  public get<T>(key: string): T {
    const dependency = this.dependencies.get(key);
    if (!dependency) {
      throw new Error(`Dependency ${key} not found`);
    }
    return dependency;
  }
}

