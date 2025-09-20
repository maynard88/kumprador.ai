import axios, { AxiosResponse } from 'axios';
import { IHttpClient } from '../../domain/interfaces/IHttpClient';

export class AxiosHttpClient implements IHttpClient {
  async post<T>(url: string, data: Record<string, any>): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: 10000,
      });
      return response.data;
    } catch (error) {
      throw new Error(`HTTP request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
