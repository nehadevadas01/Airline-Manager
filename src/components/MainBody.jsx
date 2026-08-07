import React, { useEffect, useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';

const MainBody = ({setUser}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const status = async () => {
    console.log('Status Update');
      const response = await fetch('http://localhost:3001/api/update-profile-on', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          status: 1,
        }),
      });
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Network response was not ok: ${response.statusText}, ${errorMessage}`);
      }
      const result = await response.json();
      console.log('Status:', result);
  };

  const decodeJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('JWT decode failed', error);
      return null;
    }
  };

  const handleGoogleResponse = async (response) => {
    if (!response?.credential) {
      return;
    }
    const profile = decodeJwt(response.credential);
    if (!profile) {
      alert('Google login failed.');
      return;
    }

    const googleUser = {
      email: profile.email,
      title: profile.name?.split(' ')[0] || 'User',
      firstName: profile.given_name || profile.name?.split(' ')[0] || '',
      lastName: profile.family_name || '',
      mobileNumber: '',
    };

    setUser(googleUser);
    sessionStorage.setItem('user', JSON.stringify(googleUser));
    alert(`Welcome, ${googleUser.firstName || googleUser.email}`);
    navigate('/');
  };

  useEffect(() => {
    const initGoogle = () => {
      if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID') {
        console.warn('Google Client ID is not configured. Set VITE_GOOGLE_CLIENT_ID in .env to enable Google login.');
        return;
      }
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });
        window.google.accounts.id.renderButton(
          document.getElementById('googleSignInDiv'),
          {
            theme: 'outline',
            size: 'large',
            width: '100%',
          }
        );
        setGoogleLoaded(true);
      }
    };
    const timeoutId = setTimeout(initGoogle, 500);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const data = {
        email,
        password,
    };
    let response;
    try {
      response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } catch (networkError) {
      setError('Unable to reach server. Please try again later.');
      return;
    }

    const result = await response.json();
    if (response.ok) {
      console.log('Login successful', result);
    } else {
      console.error('Login Failed:', response.statusText);
    }

    if (result.success) {
      alert(result.message);
      await status();
      setUser({
        email: email,
        title: result.user.title,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        mobileNumber: result.user.mobileNumber,
        birthday: result.user.birthday,
        gender: result.user.gender,
        maritalStatus: result.user.maritalStatus,
        address: result.user.address,
      });
      navigate('/');
    } else {
      setError(result.message || 'Login failed.');
    }
  };

  return (
    <>
      <div className='content min-h-screen flex flex-col md:flex-row pt-[80px] pb-16 gap-[40px] justify-center items-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white px-4'>
        {/* Login Box */}
        <div className='login w-full max-w-lg bg-white/10 border border-white/15 rounded-[32px] p-8 text-center shadow-2xl backdrop-blur-xl'>
          <h1 className='text-3xl font-extrabold tracking-tight text-white'>Login to Flyhigh</h1>
          <p className='mt-2 text-slate-400 text-sm'>Enter your credentials to access your account</p>

          <div className='info flex flex-col mt-6 items-center w-full'>
            <div id='googleSignInDiv' className='w-full'></div>
            <div className='my-5 flex items-center justify-center text-slate-400 gap-3 w-full'>
              <span className='h-px flex-1 bg-white/15'></span>
              <span className='text-xs font-semibold uppercase tracking-wider text-slate-400'>OR</span>
              <span className='h-px flex-1 bg-white/15'></span>
            </div>

            <form className='w-full space-y-4' onSubmit={handleSubmit}>
              <div className="text-left">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 ml-1">Email Address</label>
                <input
                  className='w-full h-12 rounded-2xl border border-white/20 bg-white px-4 text-base font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all shadow-inner'
                  type='email'
                  placeholder='name@example.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="text-left">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 ml-1">Password</label>
                <input
                  className="w-full h-12 rounded-2xl border border-white/20 bg-white px-4 text-base font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all shadow-inner"
                  type='password'
                  placeholder='Enter your password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && <p className='text-sm font-semibold text-rose-300 text-left pt-1'>{error}</p>}
              
              <button
                className='w-full mt-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 py-3.5 text-lg font-bold text-white shadow-lg shadow-fuchsia-500/25 hover:shadow-glow hover:scale-[1.01] active:scale-[0.99] transition-all duration-200'
                type='submit'
                id='log'
              >
                Login
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className='separation hidden md:block w-[2px] h-[50vh] rounded-full bg-gradient-to-b from-indigo-500 via-fuchsia-500 to-transparent opacity-40'>
        </div>

        {/* Register CTA Box */}
        <div className='register w-full max-w-lg bg-white/5 border border-white/10 rounded-[32px] p-8 text-center shadow-2xl backdrop-blur-xl flex flex-col justify-between min-h-[450px]'>
          <div>
            <h1 className='text-3xl font-bold text-white'>Don't Have An Account Yet?</h1>
            <p className='mt-3 text-slate-400 text-sm'>Join Flyhigh today and start planning your travels effortlessly.</p>

            <div className='mt-8 space-y-4 text-left'>
              <div className='flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/10'>
                <span className='text-2xl'>✈️</span>
                <div>
                  <p className='font-bold text-white text-sm'>Instant Flight Bookings</p>
                  <p className='text-slate-400 text-xs'>Reserve seats in seconds with stored traveller details.</p>
                </div>
              </div>
              <div className='flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/10'>
                <span className='text-2xl'>🎫</span>
                <div>
                  <p className='font-bold text-white text-sm'>Digital E-Tickets</p>
                  <p className='text-slate-400 text-xs'>Access and manage your bookings anytime, anywhere.</p>
                </div>
              </div>
            </div>
          </div>

          <Link to='/register' className='mt-8 block w-full'>
            <button className='w-full py-3.5 text-lg rounded-2xl border border-indigo-400/50 bg-indigo-500/10 hover:bg-indigo-500/20 text-white font-semibold transition-all duration-200'>
              Create New Account
            </button>
          </Link>
        </div>
      </div>
    </>
  )
}

export default MainBody;