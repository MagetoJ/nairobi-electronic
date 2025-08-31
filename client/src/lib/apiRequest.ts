async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  url: string,
  options: RequestInit | string = {}
): Promise<any> {
  let finalOptions: RequestInit;

  if (typeof options === 'string') {
    // If options is a string, treat it as the method
    finalOptions = {
      method: options,
      credentials: "include",
    };
  } else {
    // If options is an object, use it as RequestInit
    finalOptions = {
      ...options,
      credentials: "include",
    };
  }

  const res = await fetch(url, finalOptions);
  await throwIfResNotOk(res);
  
  if (res.headers.get('content-type')?.includes('application/json')) {
    return await res.json();
  }
  
  return res;
}