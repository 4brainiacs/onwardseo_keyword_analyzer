import { ApiClient } from './ApiClient';
import { API_CONFIG } from '../config';
import { RequestHandler } from '../handlers/RequestHandler';
import { ResponseHandler } from '../handlers/ResponseHandler';

const requestHandler = new RequestHandler();
const responseHandler = new ResponseHandler();

export const apiClient = new ApiClient(API_CONFIG);
export { ApiClient };