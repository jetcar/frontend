

import React, { useState, useRef } from 'react';
import './App.css';
import { startMobileId, checkMobileId, startSmartId, checkSmartId } from './api';
import MobileIdTab from './controls/MobileIdTab';
import SmartIdTab from './controls/SmartIdTab';
import IdCardTab from './controls/IdCardTab';
const COUNTRY_LIST = ['Estonia', 'Latvia', 'Lithuania'];

function App() {
  const [activeTab, setActiveTab] = useState('IdCard');
  const [mobileCountry, setMobileCountry] = useState(COUNTRY_LIST[0]);
  const [mobilePersonalCode, setMobilePersonalCode] = useState('');
  const [mobilePhoneNumber, setMobilePhoneNumber] = useState('');
  const [mobileSessionId, setMobileSessionId] = useState('');
  const [mobileCode, setMobileCode] = useState('');
  const [mobileStatus, setMobileStatus] = useState('');
  const [smartCountry, setSmartCountry] = useState(COUNTRY_LIST[0]);
  const [smartPersonalCode, setSmartPersonalCode] = useState('');
  const [smartSessionId, setSmartSessionId] = useState('');
  const [smartCode, setSmartCode] = useState('');
  const [smartStatus, setSmartStatus] = useState('');
  const pollingRef = useRef(null);
  const smartPollingRef = useRef(null);

  // Synchronize personal code between MobileId and SmartId tabs
  const handleTabChange = (tab) => {
    // Sync personal code
    if (tab === 'MobileId' && !mobilePersonalCode && smartPersonalCode) {
      setMobilePersonalCode(smartPersonalCode);
    }
    if (tab === 'SmartId' && !smartPersonalCode && mobilePersonalCode) {
      setSmartPersonalCode(mobilePersonalCode);
    }
    // Sync country value
    if (tab === 'MobileId' && mobileCountry === COUNTRY_LIST[0] && smartCountry !== COUNTRY_LIST[0]) {
      setMobileCountry(smartCountry);
    }
    if (tab === 'SmartId' && smartCountry === COUNTRY_LIST[0] && mobileCountry !== COUNTRY_LIST[0]) {
      setSmartCountry(mobileCountry);
    }
    setActiveTab(tab);
  };

  const handleMobileContinue = async () => {
    try {
      const data = await startMobileId({
        country: mobileCountry,
        personalCode: mobilePersonalCode,
        phoneNumber: mobilePhoneNumber
      });
      setMobileSessionId(data.sessionId);
      setMobileCode(data.code);
      setMobileStatus('');
      if (pollingRef.current) clearInterval(pollingRef.current);
      pollingRef.current = setInterval(async () => {
        try {
          const checkData = await checkMobileId(data.sessionId);
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

  const handleSmartContinue = async () => {
    try {
      const data = await startSmartId({
        country: smartCountry,
        personalCode: smartPersonalCode
      });
      setSmartSessionId(data.sessionId);
      setSmartCode(data.code);
      setSmartStatus('');
      if (smartPollingRef.current) clearInterval(smartPollingRef.current);
      smartPollingRef.current = setInterval(async () => {
        try {
          const checkData = await checkSmartId(data.sessionId);
          if (checkData.complete) {
            setSmartStatus('Authentication complete!');
            clearInterval(smartPollingRef.current);
          } else {
            setSmartStatus('Waiting for authentication...');
          }
        } catch {
          setSmartStatus('Error checking status');
        }
      }, 5000);
    } catch (err) {
      setSmartStatus('Error contacting backend');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'IdCard':
        return <IdCardTab />;
      case 'MobileId':
        return (
          <MobileIdTab
            mobileCountry={mobileCountry}
            setMobileCountry={setMobileCountry}
            mobilePersonalCode={mobilePersonalCode}
            setMobilePersonalCode={setMobilePersonalCode}
            mobilePhoneNumber={mobilePhoneNumber}
            setMobilePhoneNumber={setMobilePhoneNumber}
            mobileCode={mobileCode}
            mobileStatus={mobileStatus}
            handleMobileContinue={handleMobileContinue}
          />
        );
      case 'SmartId':
        return (
          <SmartIdTab
            smartCountry={smartCountry}
            setSmartCountry={setSmartCountry}
            smartPersonalCode={smartPersonalCode}
            setSmartPersonalCode={setSmartPersonalCode}
            smartCode={smartCode}
            smartStatus={smartStatus}
            handleSmartContinue={handleSmartContinue}
          />
        );
      default:
        return null;
    }
  };

  // Clear polling when tab changes
  React.useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
      if (smartPollingRef.current) clearInterval(smartPollingRef.current);
    };
  }, [activeTab]);

  return (
    <div className="App">
      <h2>Login</h2>
      <div className="tab-container">
        <button
          className={activeTab === 'IdCard' ? 'active' : ''}
          onClick={() => handleTabChange('IdCard')}
        >
          IdCard
        </button>
        <button
          className={activeTab === 'MobileId' ? 'active' : ''}
          onClick={() => handleTabChange('MobileId')}
        >
          MobileId
        </button>
        <button
          className={activeTab === 'SmartId' ? 'active' : ''}
          onClick={() => handleTabChange('SmartId')}
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
