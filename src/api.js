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

export async function getWebEidChallenge() {
  const url = appendOidcParamsToUrl("/idlogin/challenge");
  const resp = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  if (!resp.ok) throw new Error("GET /idlogin/challenge server error: " + resp.status);
  const { nonce, sessionId } = await resp.json();
  return { nonce, sessionId };
}

export async function sendWebEidAuthToken(authToken, sessionId) {
  let url = appendOidcParamsToUrl("/idlogin/login");
  if (sessionId) {
    const sep = url.includes('?') ? '&' : '?';
    url += `${sep}sessionId=${encodeURIComponent(sessionId)}`;
  }
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
      // [csrfHeaderName]: csrfToken
    },
    body: JSON.stringify({ authToken })
  });
  if (!resp.ok) throw new Error("POST /idlogin/login server error: " + resp.status);
  return await resp.json();
}
