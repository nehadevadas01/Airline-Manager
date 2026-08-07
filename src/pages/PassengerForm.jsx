import React, { useState } from 'react';
import NavbarM from '../components/NavbarM';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const PassengerForm = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state || {};
  const passengerCount = data.passengers || 1;

  const [errors, setErrors] = useState(Array.from({ length: passengerCount }, () => ({})));
  const [formData, setFormData] = useState(Array.from({ length: passengerCount }, () => ({
    title: 'Mr',
    firstName: '',
    lastName: '',
    gender: 'Male',
    dob: '',
    mobile: ''
  })));

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedFormData = [...formData];
    updatedFormData[index] = { ...updatedFormData[index], [name]: value };
    setFormData(updatedFormData);

    // Clear field-level error dynamically
    if (errors[index]?.[name]) {
      const updatedErrors = [...errors];
      delete updatedErrors[index][name];
      setErrors(updatedErrors);
    }
  };

  const validateForm = () => {
    const currentErrors = formData.map(passenger => {
      const passengerErrors = {};
      if (!passenger.title) passengerErrors.title = 'Title is required';
      if (!passenger.firstName?.trim()) passengerErrors.firstName = 'First Name is required';
      if (!passenger.lastName?.trim()) passengerErrors.lastName = 'Last Name is required';
      if (!passenger.gender) passengerErrors.gender = 'Gender is required';
      if (!passenger.dob) {
        passengerErrors.dob = 'Date of Birth is required';
      } else if (new Date(passenger.dob) > new Date()) {
        passengerErrors.dob = 'Date of Birth cannot be in the future';
      }
      if (!passenger.mobile) {
        passengerErrors.mobile = 'Mobile Number is required';
      } else if (!/^\d{10}$/.test(passenger.mobile)) {
        passengerErrors.mobile = 'Mobile Number must be 10 digits';
      }
      return passengerErrors;
    });

    setErrors(currentErrors);
    return currentErrors.every(error => Object.keys(error).length === 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      navigate('/preview', { state: { formData, data } });
    }
  };

  const timeDifference = (startTime, endTime) => {
    if (!startTime || !endTime) return "2h 00m";
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end - start;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (isNaN(diffHours)) return "2h 00m";
    if (diffMinutes !== 0) {
      return `${diffHours.toString().padStart(2, '0')}h ${diffMinutes.toString().padStart(2, '0')}m`;
    }
    return `${diffHours.toString().padStart(2, '0')}h`;
  };

  const formatDateTime = (dateTimeString) => {
    if (typeof dateTimeString !== 'string') return ["Invalid Date", ""];
    const [datePart, timePart] = dateTimeString.split('T');
    return [datePart, timePart || ""];
  };

  const formatDate = (date) => {
    if (typeof date !== 'string') return "Invalid Date";
    const parts = date.split('-');
    if (parts.length !== 3) return date;
    const [year, month, day] = parts;
    return `${day}-${month}-${year}`;
  };

  const [depDate, depTime] = formatDateTime(data.departureTime);
  const [arrDate, arrTime] = formatDateTime(data.arrivalTime);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white font-sans flex flex-col">
      <NavbarM user={user} />

      <main className="flex-grow max-w-5xl w-full mx-auto px-4 py-8">
        
        {/* Step Indicator Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-400/20 text-brand-300 text-xs font-semibold uppercase tracking-wider mb-2">
            Step 2 of 3
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Passenger Details
          </h1>
          <p className="text-slate-400 text-sm mt-1">Please enter information as it appears on official travel IDs.</p>
        </div>

        {/* Selected Flight Summary Card */}
        <div className="rounded-3xl bg-white/[0.05] border border-white/10 p-6 md:p-8 backdrop-blur-xl shadow-2xl mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="h-10 px-4 rounded-xl bg-gradient-to-r from-brand-500 to-purple-500 flex items-center justify-center font-extrabold text-white text-sm shadow-md">
                {data.flightName || 'Airline'}
              </div>
              <span className="font-mono text-slate-300 font-bold tracking-wider">{data.flightNumber}</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-semibold text-xs uppercase tracking-wider">
              {data.seat} Class • ₹{data.price?.toLocaleString('en-IN')} / seat
            </span>
          </div>

          <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Departure */}
            <div className="text-center md:text-left min-w-[120px]">
              <p className="text-2xl font-extrabold text-white tracking-tight">{depTime}</p>
              <p className="text-lg font-bold text-brand-300 mt-0.5">{data.originAirport}</p>
              <p className="text-xs text-slate-400">{formatDate(depDate)}</p>
            </div>

            {/* Flight Visual Line */}
            <div className="flex-1 w-full max-w-xs flex flex-col items-center px-4">
              <span className="text-xs font-semibold text-slate-400 mb-1">
                ⏱️ {timeDifference(data.departureTime, data.arrivalTime)}
              </span>
              <div className="relative w-full flex items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-400 shadow-glow" />
                <div className="flex-1 h-0.5 bg-gradient-to-r from-brand-400 via-indigo-500 to-purple-400 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 px-2">
                    <span className="text-sm inline-block transform rotate-90">✈️</span>
                  </div>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-glow" />
              </div>
            </div>

            {/* Arrival */}
            <div className="text-center md:text-right min-w-[120px]">
              <p className="text-2xl font-extrabold text-white tracking-tight">{arrTime}</p>
              <p className="text-lg font-bold text-purple-300 mt-0.5">{data.destinationAirport}</p>
              <p className="text-xs text-slate-400">{formatDate(arrDate)}</p>
            </div>
          </div>
        </div>

        {/* Passenger Information Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {formData.map((passenger, index) => (
            <div key={index} className="rounded-3xl bg-white/[0.04] border border-white/10 p-6 md:p-8 backdrop-blur-xl shadow-xl">
              <div className="flex items-center gap-3 pb-4 mb-6 border-b border-white/10">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-brand-500 to-purple-500 flex items-center justify-center font-bold text-xs text-white">
                  {index + 1}
                </div>
                <h3 className="text-lg font-bold text-white">Passenger {index + 1} Information</h3>
              </div>

              {/* Row 1: Title, First Name, Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 ml-1">Title</label>
                  <select
                    name="title"
                    value={passenger.title}
                    onChange={(e) => handleChange(e, index)}
                    className="w-full h-11 rounded-xl bg-white/[0.07] border border-white/[0.15] text-white px-3 text-sm outline-none focus:ring-2 focus:ring-brand-400/50"
                  >
                    <option value="Mr" className="bg-slate-900 text-white">Mr</option>
                    <option value="Mrs" className="bg-slate-900 text-white">Mrs</option>
                    <option value="Ms" className="bg-slate-900 text-white">Ms</option>
                    <option value="Dr" className="bg-slate-900 text-white">Dr</option>
                  </select>
                  {errors[index]?.title && <p className="text-rose-400 text-xs mt-1 ml-1">{errors[index].title}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 ml-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="e.g. John"
                    value={passenger.firstName}
                    onChange={(e) => handleChange(e, index)}
                    className="w-full h-11 rounded-xl bg-white/[0.07] border border-white/[0.15] text-white px-4 text-sm placeholder:text-white/30 outline-none focus:ring-2 focus:ring-brand-400/50"
                  />
                  {errors[index]?.firstName && <p className="text-rose-400 text-xs mt-1 ml-1">{errors[index].firstName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 ml-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="e.g. Doe"
                    value={passenger.lastName}
                    onChange={(e) => handleChange(e, index)}
                    className="w-full h-11 rounded-xl bg-white/[0.07] border border-white/[0.15] text-white px-4 text-sm placeholder:text-white/30 outline-none focus:ring-2 focus:ring-brand-400/50"
                  />
                  {errors[index]?.lastName && <p className="text-rose-400 text-xs mt-1 ml-1">{errors[index].lastName}</p>}
                </div>
              </div>

              {/* Row 2: Gender, DOB, Mobile */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 ml-1">Gender</label>
                  <select
                    name="gender"
                    value={passenger.gender}
                    onChange={(e) => handleChange(e, index)}
                    className="w-full h-11 rounded-xl bg-white/[0.07] border border-white/[0.15] text-white px-3 text-sm outline-none focus:ring-2 focus:ring-brand-400/50"
                  >
                    <option value="Male" className="bg-slate-900 text-white">Male</option>
                    <option value="Female" className="bg-slate-900 text-white">Female</option>
                    <option value="Other" className="bg-slate-900 text-white">Other</option>
                  </select>
                  {errors[index]?.gender && <p className="text-rose-400 text-xs mt-1 ml-1">{errors[index].gender}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 ml-1">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={passenger.dob}
                    onChange={(e) => handleChange(e, index)}
                    className="w-full h-11 rounded-xl bg-white/[0.07] border border-white/[0.15] text-white px-4 text-sm outline-none focus:ring-2 focus:ring-brand-400/50 [color-scheme:dark]"
                  />
                  {errors[index]?.dob && <p className="text-rose-400 text-xs mt-1 ml-1">{errors[index].dob}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 ml-1">Mobile Number</label>
                  <input
                    type="tel"
                    name="mobile"
                    placeholder="10-digit mobile number"
                    value={passenger.mobile}
                    onChange={(e) => handleChange(e, index)}
                    maxLength={10}
                    className="w-full h-11 rounded-xl bg-white/[0.07] border border-white/[0.15] text-white px-4 text-sm placeholder:text-white/30 outline-none focus:ring-2 focus:ring-brand-400/50"
                  />
                  {errors[index]?.mobile && <p className="text-rose-400 text-xs mt-1 ml-1">{errors[index].mobile}</p>}
                </div>
              </div>
            </div>
          ))}

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-white font-semibold text-sm transition-all duration-200"
            >
              ← Back to Flight List
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-brand-500 via-purple-600 to-indigo-600 hover:scale-[1.02] active:scale-[0.98] text-white font-bold text-base shadow-xl shadow-brand-500/25 hover:shadow-glow transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>Continue to Preview</span>
              <span className="text-lg">→</span>
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default PassengerForm;
