import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { authState } from './authState';
import { useNavigate } from 'react-router';

// function GoogleLogout() {
//   const navigate = useNavigate();

//   const handleGoogleLogout_HttpOnly = async () => {
//     try {
//       const response = await fetch(`로그아웃 api`, {
//         method: 'POST',
//         credentials: 'include',
//       });

//       if (response.ok) {
//         alert('로그아웃 되었습니다.');
//         navigate('/');
//       } else {
//         console.error('로그아웃 실패');
//       }
//     } catch (err) {
//       console.error('Logout Error: ', err);
//     }
//   };
//   return (
//     <>
//       <button onClick={handleGoogleLogout_HttpOnly}>로그아웃</button>
//     </>
//   );
// }
// export default GoogleLogout;

function GoogleLogout() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(authState);

  const handleGoogleLogout = () => {
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    alert('로그아웃 되었습니다.');
    console.log('Logout not_HttpOnly');
    setIsLoggedIn(false);
    // navigate('/');
  };

  return <>{isLoggedIn ? <button onClick={handleGoogleLogout}>로그아웃</button> : null}</>;
}

export default GoogleLogout;
