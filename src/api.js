// API utility for authentication requests
import { appendOidcParamsToUrl } from './utils/oidcParams';

export async function startMobileId({ country, personalCode, phoneNumber }) {
  const params = new URLSearchParams({ country, personalCode, phoneNumber });
  const url = appendOidcParamsToUrl(`/mobileid/start?${params.toString()}`);
  const res = await fetch(url, { method: 'POST' });
  return res.json();
}

export async function checkMobileId(sessionId) {
  const url = appendOidcParamsToUrl(`/mobileid/check?sessionId=${sessionId}`);
  const res = await fetch(url);
  return res.json();
}

export async function startSmartId({ country, personalCode }) {
  const params = new URLSearchParams({ country, personalCode });
  const url = appendOidcParamsToUrl(`/smartid/start?${params.toString()}`);
  const res = await fetch(url, { method: 'POST' });
  return res.json();
}

export async function checkSmartId(sessionId) {
  const url = appendOidcParamsToUrl(`/smartid/check?sessionId=${sessionId}`);
  const res = await fetch(url);
  return res.json();
}
