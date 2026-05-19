export type HttpErrorWithStatus = Error & {
  statusCode?: number;
};