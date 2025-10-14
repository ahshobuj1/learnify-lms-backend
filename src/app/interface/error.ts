export type TErrorSources = {
  path: string | number;
  message: string;
}[];

export type TCommonErrorResponse = {
  statusCode: number;
  message: string;
  errorSources: TErrorSources;
};
