export class SwrError extends Error {
  message: string;
  status?: number;
  responseJson?: {
    detail: string,
  };

  constructor(message: string, status?: number, responseJson?: any) {
    super(message);
    Object.setPrototypeOf(this, SwrError.prototype);

    this.message = message;
    this.status = status;
    this.responseJson = responseJson;
  }
}
