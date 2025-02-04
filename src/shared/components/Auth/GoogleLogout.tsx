import React from 'react';

function GoogleLogout() {
  const handleGoogleLogout = () => {
    sessionStorage.removeItem('access_token');
  };
  return (
    <>
      <button onClick={handleGoogleLogout}>로그아웃</button>
    </>
  );
}

export default GoogleLogout;
