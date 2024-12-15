import { API_CONSTANTS } from '../constants';

export function createRequestHeaders(customHeaders: HeadersInit = {}): HeadersInit {
  return {
    [API_CONSTANTS.HEADERS.CONTENT_TYPE]: API_CONSTANTS.CONTENT_TYPES.JSON,
    [API_CONSTANTS.HEADERS.ACCEPT]: API_CONSTANTS.CONTENT_TYPES.JSON,
    [API_CONSTANTS.HEADERS.REQUEST_ID]: crypto.randomUUID(),
    ...customHeaders
  };
}