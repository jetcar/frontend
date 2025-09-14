// Utility to parse OIDC parameters from URL and append to backend requests

export function getOidcParams() {
  const params = new URLSearchParams(window.location.search);
  const oidcParams = {};
  for (const [key, value] of params.entries()) {
    oidcParams[key] = value;
  }
  return oidcParams;
}

export function appendOidcParamsToUrl(url) {
  const params = new URLSearchParams(window.location.search);
  if (url.includes('?')) {
    return url + '&' + params.toString();
  } else {
    return url + '?' + params.toString();
  }
}

// Example usage in fetch:
// fetch(appendOidcParamsToUrl('/api/some-endpoint'))
