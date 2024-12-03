export function buildRequest(options: RequestInit = {}): RequestInit {
  return {
    ...options,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...options.headers
    },
    credentials: 'same-origin',
    mode: 'cors'
  };
}