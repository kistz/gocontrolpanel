export interface ServerResponse<T = void> {
  data: T;
  error?: string;
}

export interface PaginationResponse<T> {
  data: T[];
  totalCount: number;
}

export class ServerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ServerError";
  }
}
