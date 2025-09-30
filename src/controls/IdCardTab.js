import React from 'react';
import { handleWebEidLogin } from '../App';

export default function IdCardTab(props) {
  const { handleIdCardReturn } = props;

  return (
    <div>
      <div>Login with IdCard</div>
      <button
        className="continue-btn return-btn"
        onClick={handleIdCardReturn}
      >
        Return
      </button>
      <button className="continue-btn" id="webeid-auth-button" onClick={handleWebEidLogin}>
        Continue
      </button>
    </div>
  );
}

