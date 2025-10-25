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
      
      // Allow HTTP for Bantay Presyo domain (it doesn't support HTTPS)
      if (process.env.NODE_ENV === 'production' && urlObj.protocol !== 'https:') {
        if (urlObj.hostname === 'www.bantaypresyo.da.gov.ph') {
          // Allow HTTP for Bantay Presyo as it doesn't support HTTPS
          return;
        }
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
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        },
        timeout: 30000, // Increased timeout for Vercel
        maxRedirects: 5,
        validateStatus: (status) => status >= 200 && status < 400, // Allow redirects
        // Security configurations
        httpsAgent: process.env.NODE_ENV === 'production' ? undefined : undefined,
        httpAgent: undefined,
        // Additional configurations for Vercel
        maxContentLength: 50 * 1024 * 1024, // 50MB
        maxBodyLength: 50 * 1024 * 1024, // 50MB
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
