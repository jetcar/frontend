import React, { useRef, useEffect } from 'react';

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
    handleSmartReturn
  } = props;

  const isCancelled = smartStatus === 'Authentication cancelled';

  const personalCodeRef = useRef(null);

  // Autofill workaround: update state if browser autocompletes fields
  useEffect(() => {
    const interval = setInterval(() => {
      if (personalCodeRef.current && personalCodeRef.current.value !== smartPersonalCode) {
        setSmartPersonalCode(personalCodeRef.current.value);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [smartPersonalCode, setSmartPersonalCode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSmartContinue();
  };

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
        <form onSubmit={handleSubmit} autoComplete="on">
          <div className="input-group" style={{ marginTop: '16px', marginBottom: 0, display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
            <label style={{ width: '140px', textAlign: 'right', marginRight: '16px' }}>Country</label>
            <select
              className="dropdown-box"
              name="smartCountry"
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
              name="personalCode"
              placeholder="Personal Code"
              className="input-box"
              ref={personalCodeRef}
              value={smartPersonalCode}
              onChange={e => setSmartPersonalCode(e.target.value)}
              style={{ width: '220px' }}
              autoComplete="personalCode"
            />
          </div>
          <button className="cancel-btn" type="button" onClick={handleSmartCancel}>Cancel</button>
          <button className="continue-btn" type="submit">Continue</button>
        </form>
      )}
      {isCancelled && (
        <button
          className="continue-btn return-btn"
          onClick={handleSmartReturn}
        >
          Return
        </button>
      )}
    </div>
  );
}
