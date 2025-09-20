export class ExternalApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExternalApiError';
  }
}

