
import React, { useState, useRef } from 'react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('IdCard');
  const [mobilePersonalCode, setMobilePersonalCode] = useState('');
  const [mobilePhoneNumber, setMobilePhoneNumber] = useState('');
  const [mobileSessionId, setMobileSessionId] = useState('');
  const [mobileCode, setMobileCode] = useState('');
  const [mobileStatus, setMobileStatus] = useState('');
  const pollingRef = useRef(null);

  const handleMobileContinue = async () => {
    try {
      const params = new URLSearchParams({
        personalCode: mobilePersonalCode,
        phoneNumber: mobilePhoneNumber
      });
      const res = await fetch(`/mobileid/start?${params.toString()}`, {
        method: 'POST'
      });
      const data = await res.json();
      setMobileSessionId(data.sessionId);
      setMobileCode(data.code);
      setMobileStatus('');
      // Start polling
      if (pollingRef.current) clearInterval(pollingRef.current);
      pollingRef.current = setInterval(async () => {
        try {
          const checkRes = await fetch(`/mobileid/check?sessionId=${data.sessionId}`);
          const checkData = await checkRes.json();
          if (checkData.complete) {
            setMobileStatus('Authentication complete!');
            clearInterval(pollingRef.current);
          } else {
            setMobileStatus('Waiting for authentication...');
          }
        } catch {
          setMobileStatus('Error checking status');
        }
      }, 5000);
    } catch (err) {
      setMobileStatus('Error contacting backend');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'IdCard':
        return (
          <div>
            <div>Login with IdCard</div>
            <button className="continue-btn">Continue</button>
          </div>
        );
      case 'MobileId':
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
            <div className="input-group">
              <input
                type="text"
                placeholder="Personal Code"
                className="input-box"
                value={mobilePersonalCode}
                onChange={e => setMobilePersonalCode(e.target.value)}
              />
              <input
                type="text"
                placeholder="Phone Number"
                className="input-box"
                value={mobilePhoneNumber}
                onChange={e => setMobilePhoneNumber(e.target.value)}
              />
            </div>
            <button className="continue-btn" onClick={handleMobileContinue}>Continue</button>
          </div>
        );
      case 'SmartId':
        return (
          <div>
            <div>Login with SmartId</div>
            <div className="input-group">
              <input type="text" placeholder="Personal Code" className="input-box" />
            </div>
            <button className="continue-btn">Continue</button>
          </div>
        );
      default:
        return null;
    }
  };

  // Clear polling when tab changes
  React.useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [activeTab]);

  return (
    <div className="App">
      <h2>Login</h2>
      <div className="tab-container">
        <button
          className={activeTab === 'IdCard' ? 'active' : ''}
          onClick={() => setActiveTab('IdCard')}
        >
          IdCard
        </button>
        <button
          className={activeTab === 'MobileId' ? 'active' : ''}
          onClick={() => setActiveTab('MobileId')}
        >
          MobileId
        </button>
        <button
          className={activeTab === 'SmartId' ? 'active' : ''}
          onClick={() => setActiveTab('SmartId')}
        >
          SmartId
        </button>
      </div>
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
}

export default App;
