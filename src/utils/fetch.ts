import nodeFetch from 'node-fetch';
import { RequestInfo, RequestInit } from 'node-fetch';

export async function fetch(url: RequestInfo, init?: RequestInit) {
  const response = await nodeFetch(url, init);

  const contentType = response.headers.get('content-type');
  const responseBody = await (contentType && contentType.includes('application/json') ? response.json() : response.text());

  return response.status >= 400 ? Promise.reject(responseBody) : responseBody;
}
