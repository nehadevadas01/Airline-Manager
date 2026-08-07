import { useState } from 'react'
import React from 'react'
import { Link } from 'react-router-dom';

const Navbar = ({user, setUser}) => {
  const [navbar, setNavbar] = useState(false);
  const bgchange = () => {
    if(window.scrollY >= 90)
      setNavbar(true);
    else
      setNavbar(false);
  }
  window.addEventListener('scroll', bgchange)

  const handleUserCheck = (e) => {
    if (!user) {
      e.preventDefault();
      alert('You must be logged in to access this page.');
    }
  };

  const status = async () => {
    console.log('Status Update');
      const response = await fetch('http://localhost:3001/api/update-profile-on', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          status: 0,
        }),
      });
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Network response was not ok: ${response.statusText}, ${errorMessage}`);
      }
      const result = await response.json();
      console.log('Status:', result);
  };

  const handleLogout = () => {
    setUser(null);
    status();
  };
  return (
    <nav className={`${
      navbar
        ? 'bg-slate-900/80 backdrop-blur-xl shadow-lg shadow-black/10 border-b border-white/[0.06]'
        : 'bg-transparent'
    } flex justify-between items-center text-white h-[72px] px-8 lg:px-12 fixed top-0 left-0 right-0 z-50 transition-all duration-500`}>
      <Link to="/" className="flex items-center gap-3 group">
        <img src="/plane.png" alt="Flyhigh" className="h-8 w-8 transition-transform duration-300 group-hover:rotate-[-15deg]" />
        <span className="text-2xl font-extrabold tracking-tight gradient-text">Flyhigh</span>
      </Link>

      <ul className="flex items-center gap-10 font-medium text-[15px] tracking-wide">
        <li><Link to="/" className="nav-link text-white/90 hover:text-white transition-colors">Home</Link></li>
        <li>
          {user ? (
            <Link to="/myflts" state={{email: user.email}} onClick={handleUserCheck} className="nav-link text-white/90 hover:text-white transition-colors">My Flights</Link>
          ) : (
            <Link to="/" onClick={handleUserCheck} className="nav-link text-white/90 hover:text-white transition-colors">My Flights</Link>
          )}
        </li>
        <li><Link to="/about" className="nav-link text-white/90 hover:text-white transition-colors">About</Link></li>
        <li>
          {user ? (
            <Link to="/feedback" onClick={handleUserCheck} className="nav-link text-white/90 hover:text-white transition-colors">Feedback</Link>
          ) : (
            <Link to="/" onClick={handleUserCheck} className="nav-link text-white/90 hover:text-white transition-colors">Feedback</Link>
          )}
        </li>
      </ul>

      <div className="flex items-center gap-4">
        {!user ? (
          <Link to="/login">
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-brand-500 to-purple-500 text-white font-semibold text-sm shadow-glow-sm hover:shadow-glow hover:scale-105 transition-all duration-300">
              Login
              <img src="/login.svg" className="h-5 invert" alt="login" />
            </button>
          </Link>
        ) : (
          <div className="flex items-center gap-4">
            <Link to='/user' state={{userData: user}} className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 transition-all duration-300">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-brand-400 to-purple-400 flex items-center justify-center text-xs font-bold text-white">
                {user.firstName?.[0] || '?'}
              </div>
              <span className='font-medium text-sm text-white/90'>{user.firstName} {user.lastName}</span>
            </Link>
            <Link to="/">
              <button onClick={handleLogout} className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/15 text-white/80 hover:text-white hover:border-white/30 hover:bg-white/[0.06] font-medium text-sm transition-all duration-300">
                Logout
                <img src="/logout.svg" className="h-5 invert opacity-80" alt="logout" />
              </button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
