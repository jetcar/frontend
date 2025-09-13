
import React, { useState } from 'react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('IdCard');

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
            <div className="input-group">
              <input type="text" placeholder="Personal Code" className="input-box" />
              <input type="text" placeholder="Phone Number" className="input-box" />
            </div>
            <button className="continue-btn">Continue</button>
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
