import React, { useState } from 'react';
import NavbarL from '../components/NavbarL';
import { useNavigate, Link } from 'react-router-dom';
import Footer from '../components/Footer';

const Register = () => {
  const [formData, setFormData] = useState({
    title: 'Mr.',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobileNumber: '',
    birthday: '',
    gender: '',
    maritalStatus: '',
    address: ''
  });
  const navigate = useNavigate();
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Validation functions
  const isValidMobile = (number) => {
    const pattern = /^[0-9]{10}$/;
    return pattern.test(number);
  };
  
  const isValidEmail = (email) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };

  const doPasswordsMatch = () => {
    return formData.password === formData.confirmPassword;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(formData.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    if (!isValidMobile(formData.mobileNumber)) {
      alert('Please enter a valid mobile number (10 digits).');
      return;
    }

    if (!doPasswordsMatch()) {
      alert('Passwords do not match.');
      return;
    }

    console.log(formData);
    // Send data to the backend
    let response = await fetch('http://localhost:3001/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'Email is already taken') {
        alert('Email is already taken.');
      } else {
        alert(data.message || 'Registration successful!');
        setFormData({
          title: 'Mr.',
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
          mobileNumber: '',
          birthday: '',
          gender: '',
          maritalStatus: '',
          address: ''
        });  // Reset form
        navigate('/login');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Registration failed: ' + error.message);
    });
  };

  return (
    <>
      <NavbarL />
      <div className='bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 min-h-screen py-16'>
        <div className='mx-auto flex max-w-6xl flex-col gap-10 px-4 md:flex-row'>
          <div className='flex-1 rounded-[32px] border border-white/10 bg-white/10 p-8 text-white shadow-2xl backdrop-blur-xl'>
            <h1 className='text-4xl font-extrabold tracking-tight'>Create your Flyhigh account</h1>
            <p className='mt-4 max-w-xl text-slate-300'>Join now to book flights faster, save your traveller details, and receive exclusive travel offers.</p>
            <div className='mt-10 space-y-5'>
              <div className='rounded-3xl bg-slate-950/50 p-5'>
                <p className='font-bold text-lg'>Instant booking</p>
                <p className='mt-2 text-slate-400'>Save your details once and checkout in seconds.</p>
              </div>
              <div className='rounded-3xl bg-slate-950/50 p-5'>
                <p className='font-bold text-lg'>Secure profile</p>
                <p className='mt-2 text-slate-400'>Manage bookings, flight status and e-tickets from one dashboard.</p>
              </div>
              <div className='rounded-3xl bg-slate-950/50 p-5'>
                <p className='font-bold text-lg'>24/7 support</p>
                <p className='mt-2 text-slate-400'>Get help whenever you need it with our customer support team.</p>
              </div>
            </div>
          </div>
          <div className='flex-1 rounded-[32px] border border-white/10 bg-white p-8 shadow-2xl'>
            <div className='mb-6 text-center'>
              <h2 className='text-3xl font-bold text-slate-900'>Register</h2>
              <p className='mt-2 text-slate-500'>Enter your details to create a new account.</p>
            </div>
            <form className='grid gap-5' onSubmit={handleSubmit}>
              <div className='grid gap-5 md:grid-cols-2'>
                <select className='rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-indigo-500' id='title' name='title' value={formData.title} onChange={handleChange}>
                  <option value='Mr.'>Mr.</option>
                  <option value='Ms.'>Ms.</option>
                  <option value='Mrs.'>Mrs.</option>
                  <option value='Dr.'>Dr.</option>
                </select>
                <input className='rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-indigo-500' type='text' name='firstName' value={formData.firstName} onChange={handleChange} placeholder='First Name' required />
              </div>
              <div className='grid gap-5 md:grid-cols-2'>
                <input className='rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-indigo-500' type='text' name='lastName' value={formData.lastName} onChange={handleChange} placeholder='Last Name' required />
                <input className='rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-indigo-500' type='email' name='email' value={formData.email} onChange={handleChange} placeholder='Email Address' required />
              </div>
              <div className='grid gap-5 md:grid-cols-2'>
                <input className='rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-indigo-500' type='password' name='password' value={formData.password} onChange={handleChange} placeholder='Password' required />
                <input className='rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-indigo-500' type='password' name='confirmPassword' value={formData.confirmPassword} onChange={handleChange} placeholder='Confirm Password' required />
              </div>
              <div className='grid gap-5 md:grid-cols-2'>
                <input className='rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-indigo-500' type='text' name='mobileNumber' value={formData.mobileNumber} onChange={handleChange} placeholder='Mobile Number' required />
                <input className='rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-indigo-500' type='date' name='birthday' value={formData.birthday} onChange={handleChange} placeholder='Date of Birth' />
              </div>
              <div className='grid gap-5 md:grid-cols-2'>
                <select className='rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-indigo-500' name='gender' value={formData.gender} onChange={handleChange}>
                  <option value=''>Gender Identity (Optional)</option>
                  <option value='male'>Male</option>
                  <option value='female'>Female</option>
                  <option value='other'>Other</option>
                </select>
                <select className='rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-indigo-500' name='maritalStatus' value={formData.maritalStatus} onChange={handleChange}>
                  <option value=''>Marital Status (Optional)</option>
                  <option value='single'>Single</option>
                  <option value='married'>Married</option>
                </select>
              </div>
              <input className='rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-indigo-500' type='text' name='address' value={formData.address} onChange={handleChange} placeholder='Permanent Residential Address (Optional)' />
              <button className='rounded-3xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-6 py-3 text-lg font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:opacity-95' type='submit'>Create Account</button>
              <div className='mt-2 text-center text-slate-500'>
                Already have an account? <Link to='/login' className='font-semibold text-indigo-600 hover:text-indigo-800'>Login</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Register;
