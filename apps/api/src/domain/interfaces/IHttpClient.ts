export interface IHttpClient {
  post<T>(url: string, data: Record<string, any>): Promise<T>;
}

