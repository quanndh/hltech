export interface IStockApiResponse {
  [key: string]: IStockMetadata | IStockInterval;
}

export interface IStockMetadata {
  '1. Information': string;
  '2. Symbol': string;
  '3. Last Refreshed': string;
  '4. Interval': string;
  '5. Output Size': string;
  '6. Time Zone': string;
}

export interface IStockInterval {
  [key: string]: IStockIntervalDetail;
}

export interface IStockIntervalDetail {
  '1. open': string;
  '2. high': string;
  '3. low': string;
  '4. close': string;
  '5. volume': string;
}

// export function isStockApiResponse(object: any): object is IStockApiResponse {
//   if (typeof object === 'string') return false;
//   const [metadata, _] = <[IStockMetadata, IStockInterval]>Object.values(object);

//   return '1. Information' in metadata;
// }