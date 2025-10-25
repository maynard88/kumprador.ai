import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { IHttpClient } from '../../domain/interfaces/IHttpClient';

export class AxiosHttpClient implements IHttpClient {
  private readonly allowedDomains = [
    'www.bantaypresyo.da.gov.ph',
    'api.openai.com'
  ];

  private validateUrl(url: string): void {
    try {
      const urlObj = new URL(url);
      
      // Check if domain is allowed
      if (!this.allowedDomains.includes(urlObj.hostname)) {
        throw new Error(`Domain ${urlObj.hostname} is not allowed`);
      }
      
      // Only allow HTTPS in production
      if (process.env.NODE_ENV === 'production' && urlObj.protocol !== 'https:') {
        throw new Error('Only HTTPS requests are allowed in production');
      }
    } catch (error) {
      throw new Error(`Invalid URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private sanitizeData(data: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(data)) {
      // Only allow string and number values
      if (typeof value === 'string' || typeof value === 'number') {
        // Sanitize string values
        if (typeof value === 'string') {
          sanitized[key] = value
            .replace(/[<>]/g, '') // Remove potential HTML tags
            .replace(/javascript:/gi, '') // Remove javascript: protocol
            .trim();
        } else {
          sanitized[key] = value;
        }
      }
    }
    
    return sanitized;
  }

  async post<T>(url: string, data: Record<string, any>): Promise<T> {
    try {
      // Validate URL
      this.validateUrl(url);
      
      // Sanitize data
      const sanitizedData = this.sanitizeData(data);
      
      const config: AxiosRequestConfig = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'KumpradorAI/1.0',
        },
        timeout: 10000,
        maxRedirects: 3,
        validateStatus: (status) => status >= 200 && status < 300,
        // Security configurations
        httpsAgent: process.env.NODE_ENV === 'production' ? undefined : undefined, // Use default HTTPS agent
        httpAgent: undefined, // Disable HTTP agent
      };

      const response: AxiosResponse<T> = await axios.post(url, sanitizedData, config);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
          throw new Error('External service unavailable');
        }
        if (error.response?.status === 404) {
          throw new Error('External service endpoint not found');
        }
        if (error.response && error.response.status >= 500) {
          throw new Error('External service error');
        }
      }
      throw new Error(`HTTP request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
