import React from 'react';

const COUNTRY_LIST = ['Estonia', 'Latvia', 'Lithuania'];

export default function SmartIdTab(props) {
  const {
    smartCountry,
    setSmartCountry,
    smartPersonalCode,
    setSmartPersonalCode,
    smartCode,
    smartStatus,
    handleSmartContinue,
    handleSmartCancel,
    handleSmartReturn // Added return handler
  } = props;

  const isCancelled = smartStatus === 'Authentication cancelled';

  return (
    <div>
      <div>Login with SmartId</div>
      {smartCode && (
        <div style={{ marginTop: '16px', color: '#1976d2' }}>
          <strong>Authentication Code:</strong> {smartCode}
        </div>
      )}
      {smartStatus && (
        <div style={{ marginTop: '8px', color: '#1976d2' }}>{smartStatus}</div>
      )}
      {!isCancelled && (
        <>
          <div className="input-group" style={{ marginTop: '16px', marginBottom: 0, display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
            <label style={{ width: '140px', textAlign: 'right', marginRight: '16px' }}>Country</label>
            <select
              className="dropdown-box"
              value={smartCountry}
              onChange={e => setSmartCountry(e.target.value)}
              style={{ width: '220px' }}
            >
              {COUNTRY_LIST.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
          <div className="input-group" style={{ display: 'flex', alignItems: 'center', marginTop: '8px', flexDirection: 'row', justifyContent: 'center' }}>
            <label style={{ width: '140px', textAlign: 'right', marginRight: '16px' }}>Personal Code</label>
            <input
              type="text"
              placeholder="Personal Code"
              className="input-box"
              value={smartPersonalCode}
              onChange={e => setSmartPersonalCode(e.target.value)}
              style={{ width: '220px' }}
              autoComplete="personal-code"
            />
          </div>
          <button className="cancel-btn" onClick={handleSmartCancel}>Cancel</button>
          <button className="continue-btn" onClick={handleSmartContinue}>Continue</button>
        </>
      )}
      {isCancelled && (
        <button className="continue-btn" onClick={handleSmartReturn}>Return</button>
      )}
    </div>
  );
}
