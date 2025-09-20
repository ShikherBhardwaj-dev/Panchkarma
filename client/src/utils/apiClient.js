// Lightweight fetch wrapper that automatically attaches x-auth-token from localStorage
export async function authFetch(url, options = {}) {
  const token = localStorage.getItem('token');
  const headers = options.headers ? { ...options.headers } : {};
  if (token) {
    headers['x-auth-token'] = token;
    console.log('authFetch: Adding token to request:', url);
  } else {
    console.warn('authFetch: No token found in localStorage');
  }

  console.log('authFetch request:', {
    url,
    headers: { ...headers, 'x-auth-token': token ? 'present' : 'missing' }
  });

  const res = await fetch(url, { ...options, headers });
  
  console.log('authFetch response:', {
    url,
    status: res.status,
    ok: res.ok
  });

  return res;
}

export default authFetch;
