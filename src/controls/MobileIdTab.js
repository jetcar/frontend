import React from 'react';

const COUNTRY_LIST = ['Estonia', 'Latvia', 'Lithuania'];

export default function MobileIdTab(props) {
  const {
    mobileCountry,
    setMobileCountry,
    mobilePersonalCode,
    setMobilePersonalCode,
    mobilePhoneNumber,
    setMobilePhoneNumber,
    mobileCode,
    mobileStatus,
    handleMobileContinue,
    handleMobileCancel,
    handleMobileReturn // Added return handler
  } = props;

  const isCancelled = mobileStatus === 'Authentication cancelled';

  return (
    <div>
      <div>Login with MobileId</div>
      {mobileCode && (
        <div style={{marginTop: '16px', color: '#1976d2'}}>
          <strong>Authentication Code:</strong> {mobileCode}
        </div>
      )}
      {mobileStatus && (
        <div style={{marginTop: '8px', color: '#1976d2'}}>{mobileStatus}</div>
      )}
      {!isCancelled && (
        <>
          <div className="input-group" style={{marginTop: '16px', marginBottom: 0, display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}>
            <label style={{width: '140px', textAlign: 'right', marginRight: '16px'}}>Country</label>
            <select
              className="dropdown-box"
              value={mobileCountry}
              onChange={e => setMobileCountry(e.target.value)}
              style={{width: '220px'}}
            >
              {COUNTRY_LIST.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
          <div className="input-group" style={{display: 'flex', alignItems: 'center', marginTop: '8px', flexDirection: 'row', justifyContent: 'center'}}>
            <label style={{width: '140px', textAlign: 'right', marginRight: '16px'}}>Personal Code</label>
            <input
              type="text"
              placeholder="Personal Code"
              className="input-box"
              value={mobilePersonalCode}
              onChange={e => setMobilePersonalCode(e.target.value)}
              style={{width: '220px'}}
            />
          </div>
          <div className="input-group" style={{display: 'flex', alignItems: 'center', marginTop: '8px', flexDirection: 'row', justifyContent: 'center'}}>
            <label style={{width: '140px', textAlign: 'right', marginRight: '16px'}}>Phone Number</label>
            <input
              type="text"
              placeholder="Phone Number"
              className="input-box"
              value={mobilePhoneNumber}
              onChange={e => setMobilePhoneNumber(e.target.value)}
              style={{width: '220px'}}
            />
          </div>
          <button className="continue-btn" onClick={handleMobileContinue}>Continue</button>
          <button className="cancel-btn" onClick={handleMobileCancel}>Cancel</button>
        </>
      )}
      {isCancelled && (
        <button className="continue-btn" onClick={handleMobileReturn}>Return</button>
      )}
    </div>
  );
}
