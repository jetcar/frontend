import React, { useRef, useEffect } from 'react';

const COUNTRY_LIST = [
  { name: 'Estonia', code: '+372' },
  { name: 'Latvia', code: '+371' },
  { name: 'Lithuania', code: '+370' }
];

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
    handleMobileReturn
  } = props;

  const isCancelled = mobileStatus === 'Authentication cancelled';
  const personalCodeRef = useRef(null);
  const phoneNumberRef = useRef(null);

  // Autofill workaround: update state if browser autocompletes fields
  useEffect(() => {
    const interval = setInterval(() => {
      if (personalCodeRef.current && personalCodeRef.current.value !== mobilePersonalCode) {
        setMobilePersonalCode(personalCodeRef.current.value);
      }
      if (phoneNumberRef.current) {
        const fullPhone = phoneNumberRef.current.value;
        if (fullPhone !== mobilePhoneNumber) {
          setMobilePhoneNumber(fullPhone);
        }
      }
    }, 500);
    return () => clearInterval(interval);
  }, [mobilePersonalCode, mobilePhoneNumber, setMobilePersonalCode, setMobilePhoneNumber]);

  // Handle country code dropdown change
  const handleCountryCodeChange = (e) => {
    const selectedCountry = COUNTRY_LIST.find(c => c.code === e.target.value);
    setMobileCountry(selectedCountry ? selectedCountry.name : COUNTRY_LIST[0].name);
  };

  // Handle phone number input (without country code)
  const handlePhoneNumberChange = (e) => {
    setMobilePhoneNumber(e.target.value);
  };

  // On submit, pass country code and number separately to handler
  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedCountry = COUNTRY_LIST.find(c => c.name === mobileCountry) || COUNTRY_LIST[0];
    handleMobileContinue({
      countryCode: selectedCountry.code,
      phoneNumber: mobilePhoneNumber
    });
  };

  return (
    <div>
      <div>Login with MobileId</div>
      {mobileCode && (
        <div style={{ marginTop: '16px', color: '#1976d2' }}>
          <strong>Authentication Code:</strong> {mobileCode}
        </div>
      )}
      {mobileStatus && (
        <div style={{ marginTop: '8px', color: '#1976d2' }}>{mobileStatus}</div>
      )}
      {!isCancelled && (
        <form onSubmit={handleSubmit} autoComplete="on">
          <div className="input-group phoneid-row">
            <label className="phoneid-label">Personal Code</label>
            <input
              type="text"
              name="personalCode"
              placeholder="Personal Code"
              className="input-box"
              ref={personalCodeRef}
              value={mobilePersonalCode}
              onChange={e => setMobilePersonalCode(e.target.value)}
              style={{ width: '220px' }}
              autoComplete="personalCode"
            />
          </div>
          <div className="input-group phoneid-row">
            <label className="phoneid-label">Phone Number</label>
            <div className="country-dropdown-wrapper">
              <select
                name="countryCode"
                value={COUNTRY_LIST.find(c => c.name === mobileCountry)?.code || COUNTRY_LIST[0].code}
                onChange={handleCountryCodeChange}
                className="country-dropdown"
              >
                {COUNTRY_LIST.map(country => (
                  <option key={country.code} value={country.code}>{country.code}</option>
                ))}
              </select>
            </div>
            <input
              type="text"
              name="mobilePhoneNumber"
              placeholder="Phone Number"
              className="input-box mobile-phonenumber-input"
              ref={phoneNumberRef}
              value={mobilePhoneNumber}
              onChange={handlePhoneNumberChange}
              autoComplete="tel"
            />
          </div>
          <button className="cancel-btn" type="button" onClick={handleMobileCancel}>Cancel</button>
          <button className="continue-btn" type="submit">Continue</button>
        </form>
      )}
      {isCancelled && (
        <button
          className="continue-btn return-btn"
          onClick={handleMobileReturn}
        >
          Return
        </button>
      )}
    </div>
  );
}