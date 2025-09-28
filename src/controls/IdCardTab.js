import React from 'react';

export default function IdCardTab(props) {
  const { handleIdCardReturn } = props;
  return (
    <div>
      <div>Login with IdCard</div>
      <button className="continue-btn" onClick={handleIdCardReturn}>Return</button>
      <button className="continue-btn">Continue</button>
    </div>
  );
}
