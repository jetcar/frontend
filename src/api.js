// API utility for authentication requests

export async function startMobileId({ country, personalCode, phoneNumber }) {
  const params = new URLSearchParams({ country, personalCode, phoneNumber });
  const res = await fetch(`/mobileid/start?${params.toString()}`, { method: 'POST' });
  return res.json();
}

export async function checkMobileId(sessionId) {
  const res = await fetch(`/mobileid/check?sessionId=${sessionId}`);
  return res.json();
}

export async function startSmartId({ country, personalCode }) {
  const params = new URLSearchParams({ country, personalCode });
  const res = await fetch(`/smartid/start?${params.toString()}`, { method: 'POST' });
  return res.json();
}

export async function checkSmartId(sessionId) {
  const res = await fetch(`/smartid/check?sessionId=${sessionId}`);
  return res.json();
}
