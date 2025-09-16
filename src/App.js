import React, { useState, useRef } from 'react';
import './App.css';
import { startMobileId, checkMobileId, startSmartId, checkSmartId } from './api';
import MobileIdTab from './controls/MobileIdTab';
import SmartIdTab from './controls/SmartIdTab';
import IdCardTab from './controls/IdCardTab';
import { getOidcParams } from './utils/oidcParams';
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
  const mobilePollingActiveRef = useRef(false);
  const mobilePollInFlightRef = useRef(false);
  const smartPollingActiveRef = useRef(false);
  const smartPollInFlightRef = useRef(false);
  const oidcParams = getOidcParams();
  const returnUri = oidcParams['return_uri'] || oidcParams['redirect_uri'] || oidcParams['returnUrl'] || oidcParams['redirectUrl'];

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

  const scheduleNextMobilePoll = (sessionId) => {
    if (!mobilePollingActiveRef.current) return;
    pollingRef.current = setTimeout(() => doMobilePoll(sessionId), 4000);
  };

  const doMobilePoll = async (sessionId) => {
    if (!mobilePollingActiveRef.current || mobilePollInFlightRef.current) return;
    mobilePollInFlightRef.current = true;
    try {
      const checkData = await checkMobileId(sessionId);
      if (checkData.error) {
        setMobileStatus(`Error: ${checkData.error}`);
        mobilePollingActiveRef.current = false;
        return;
      }
      if (checkData.complete) {
        setMobileStatus('Authentication complete!');
        mobilePollingActiveRef.current = false;
        if (checkData.redirectUrl) {
          window.location.href = checkData.redirectUrl;
          return;
        }
      } else {
        setMobileStatus('Waiting for authentication...');
        scheduleNextMobilePoll(sessionId);
      }
    } catch {
      setMobileStatus('Error checking status');
      scheduleNextMobilePoll(sessionId); // optional retry
    } finally {
      mobilePollInFlightRef.current = false;
    }
  };

  const startMobilePolling = (sessionId) => {
    mobilePollingActiveRef.current = true;
    doMobilePoll(sessionId);
  };

  const scheduleNextSmartPoll = (sessionId) => {
    if (!smartPollingActiveRef.current) return;
    smartPollingRef.current = setTimeout(() => doSmartPoll(sessionId), 4000);
  };

  const doSmartPoll = async (sessionId) => {
    if (!smartPollingActiveRef.current || smartPollInFlightRef.current) return;
    smartPollInFlightRef.current = true;
    try {
      const checkData = await checkSmartId(sessionId);
      if (checkData.error) {
        setSmartStatus(`Error: ${checkData.error}`);
        smartPollingActiveRef.current = false;
        return;
      }
      if (checkData.complete) {
        setSmartStatus('Authentication complete!');
        smartPollingActiveRef.current = false;
        if (checkData.redirectUrl) {
          window.location.href = checkData.redirectUrl;
          return;
        }
      } else {
        setSmartStatus('Waiting for authentication...');
        scheduleNextSmartPoll(sessionId);
      }
    } catch {
      setSmartStatus('Error checking status');
      scheduleNextSmartPoll(sessionId); // optional retry
    } finally {
      smartPollInFlightRef.current = false;
    }
  };

  const startSmartPolling = (sessionId) => {
    smartPollingActiveRef.current = true;
    doSmartPoll(sessionId);
  };

  const handleMobileContinue = async () => {
    try {
      const data = await startMobileId({
        country: mobileCountry,
        personalCode: mobilePersonalCode,
        phoneNumber: mobilePhoneNumber
      });
      if (data?.error) {
        setMobileStatus(`Error: ${data.error}`);
        return;
      }
      if (data && data.sessionId) {
        setMobileSessionId(data.sessionId);
        setMobileCode(data.code);
        setMobileStatus('');
        if (pollingRef.current) clearTimeout(pollingRef.current);
        mobilePollingActiveRef.current = false;
        startMobilePolling(data.sessionId);
      } else {
        setMobileStatus('Failed to start MobileId authentication.');
      }
    } catch {
      setMobileStatus('Error contacting backend');
    }
  };

  const handleSmartContinue = async () => {
    try {
      const data = await startSmartId({
        country: smartCountry,
        personalCode: smartPersonalCode
      });
      if (data?.error) {
        setSmartStatus(`Error: ${data.error}`);
        return;
      }
      if (data && data.sessionId) {
        setSmartSessionId(data.sessionId);
        setSmartCode(data.code);
        setSmartStatus('');
        if (smartPollingRef.current) clearTimeout(smartPollingRef.current);
        smartPollingActiveRef.current = false;
        startSmartPolling(data.sessionId);
      } else {
        setSmartStatus('Failed to start SmartId authentication.');
      }
    } catch {
      setSmartStatus('Error contacting backend');
    }
  };

  const handleMobileCancel = () => {
    mobilePollingActiveRef.current = false;
    if (pollingRef.current) {
      clearTimeout(pollingRef.current);
      pollingRef.current = null;
    }
    setMobileStatus('Authentication cancelled');
    setMobileCode('');
  };

  const handleSmartCancel = () => {
    smartPollingActiveRef.current = false;
    if (smartPollingRef.current) {
      clearTimeout(smartPollingRef.current);
      smartPollingRef.current = null;
    }
    setSmartStatus('Authentication cancelled');
    setSmartCode('');
  };

  const handleMobileReturn = () => {
    if (returnUri) {
      window.location.href = returnUri;
    } else {
      setMobileStatus('');
      setMobileCode('');
      setMobileSessionId('');
      setMobilePersonalCode('');
      setMobilePhoneNumber('');
    }
  };

  const handleSmartReturn = () => {
    if (returnUri) {
      window.location.href = returnUri;
    } else {
      setSmartStatus('');
      setSmartCode('');
      setSmartSessionId('');
      setSmartPersonalCode('');
    }
  };

  const handleIdCardReturn = () => {
    if (returnUri) {
      window.location.href = returnUri;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'IdCard':
        return <IdCardTab handleIdCardReturn={handleIdCardReturn} />;
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
            handleMobileCancel={handleMobileCancel}
            handleMobileReturn={handleMobileReturn} // Pass return handler
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
            handleSmartCancel={handleSmartCancel}
            handleSmartReturn={handleSmartReturn} // Pass return handler
          />
        );
      default:
        return null;
    }
  };

  // Clear polling when tab changes
  React.useEffect(() => {
    return () => {
      mobilePollingActiveRef.current = false;
      smartPollingActiveRef.current = false;
      if (pollingRef.current) clearTimeout(pollingRef.current);
      if (smartPollingRef.current) clearTimeout(smartPollingRef.current);
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
