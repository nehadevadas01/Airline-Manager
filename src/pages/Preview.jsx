import React, { useState } from 'react';
import NavbarM from '../components/NavbarM';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer';

const Preview = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state || {};
  data.user = user;
  const [loading, setLoading] = useState(false);

  const totalcost = (data.data?.price || 0) * (data.data?.passengers || 1);

  const handleClick = async () => {
    setLoading(true);
    sessionStorage.removeItem('bookingSent');
    
    try {
      const response = await axios.post("http://localhost:3001/api/payments", data);
      
      // If Stripe returns a valid checkout URL, redirect to Stripe
      if (response && response.data && response.data.url) {
        window.location.href = response.data.url;
      } else {
        // Fallback demo mode if Stripe key is not configured: navigate directly to e-ticket
        const encodedData = encodeURIComponent(JSON.stringify(data));
        navigate(`/eticket?info=${encodedData}`);
      }
    } catch (err) {
      console.warn("Payment checkout API fallback:", err);
      // Fallback mode for seamless user testing
      const encodedData = encodeURIComponent(JSON.stringify(data));
      navigate(`/eticket?info=${encodedData}`);
    } finally {
      setLoading(false);
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

  const flightInfo = data.data || {};
  const passengersList = data.formData || [];
  const [depDate, depTime] = formatDateTime(flightInfo.departureTime);
  const [arrDate, arrTime] = formatDateTime(flightInfo.arrivalTime);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white font-sans flex flex-col">
      <NavbarM user={user} />

      <main className="flex-grow max-w-5xl w-full mx-auto px-4 py-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-400/20 text-brand-300 text-xs font-semibold uppercase tracking-wider mb-2">
            Step 3 of 3
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Booking Preview & Summary
          </h1>
          <p className="text-slate-400 text-sm mt-1">Please review your flight and passenger details before proceeding to payment.</p>
        </div>

        {/* Flight Details Card */}
        <div className="rounded-3xl bg-white/[0.05] border border-white/10 p-6 md:p-8 backdrop-blur-xl shadow-2xl mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="h-10 px-4 rounded-xl bg-gradient-to-r from-brand-500 to-purple-500 flex items-center justify-center font-extrabold text-white text-sm shadow-md">
                {flightInfo.flightName || 'Airline'}
              </div>
              <span className="font-mono text-slate-300 font-bold tracking-wider">{flightInfo.flightNumber}</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-semibold text-xs uppercase tracking-wider">
              {flightInfo.seat} Class
            </span>
          </div>

          <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Origin */}
            <div className="text-center md:text-left min-w-[120px]">
              <p className="text-3xl font-extrabold text-white tracking-tight">{depTime}</p>
              <p className="text-xl font-bold text-brand-300 mt-1">{flightInfo.originAirport}</p>
              <p className="text-xs text-slate-400 mt-0.5">{formatDate(depDate)}</p>
            </div>

            {/* Path */}
            <div className="flex-1 w-full max-w-xs flex flex-col items-center px-4">
              <span className="text-xs font-semibold text-slate-400 mb-1.5">
                ⏱️ {timeDifference(flightInfo.departureTime, flightInfo.arrivalTime)}
              </span>
              <div className="relative w-full flex items-center">
                <div className="w-3 h-3 rounded-full bg-brand-400 shadow-glow" />
                <div className="flex-1 h-0.5 bg-gradient-to-r from-brand-400 via-indigo-500 to-purple-400 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 px-2">
                    <span className="text-lg inline-block transform rotate-90">✈️</span>
                  </div>
                </div>
                <div className="w-3 h-3 rounded-full bg-purple-400 shadow-glow" />
              </div>
            </div>

            {/* Destination */}
            <div className="text-center md:text-right min-w-[120px]">
              <p className="text-3xl font-extrabold text-white tracking-tight">{arrTime}</p>
              <p className="text-xl font-bold text-purple-300 mt-1">{flightInfo.destinationAirport}</p>
              <p className="text-xs text-slate-400 mt-0.5">{formatDate(arrDate)}</p>
            </div>
          </div>
        </div>

        {/* Passenger List Table Card */}
        <div className="rounded-3xl bg-white/[0.04] border border-white/10 p-6 md:p-8 backdrop-blur-xl shadow-2xl mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>👥</span> Passenger Details ({passengersList.length})
          </h2>

          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/70 text-slate-200 uppercase text-xs font-bold tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">#</th>
                  <th className="px-5 py-3.5">Passenger Name</th>
                  <th className="px-5 py-3.5">Gender</th>
                  <th className="px-5 py-3.5">Date of Birth</th>
                  <th className="px-5 py-3.5">Mobile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {passengersList.map((passenger, index) => (
                  <tr key={index} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-slate-400">{index + 1}</td>
                    <td className="px-5 py-4 font-semibold text-white">
                      {passenger.title}. {passenger.firstName} {passenger.lastName}
                    </td>
                    <td className="px-5 py-4 capitalize">{passenger.gender || '-'}</td>
                    <td className="px-5 py-4">{formatDate(passenger.dob)}</td>
                    <td className="px-5 py-4 font-mono">{passenger.mobile || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fare Summary & Actions */}
        <div className="rounded-3xl bg-white/[0.05] border border-white/10 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>💳</span> Payment Summary
          </h2>

          <div className="space-y-3 pb-6 border-b border-white/10 text-sm">
            <div className="flex justify-between text-slate-300">
              <span>{flightInfo.seat} Seat Price ({flightInfo.passengers} x ₹{flightInfo.price?.toLocaleString('en-IN')})</span>
              <span className="font-semibold text-white">₹{totalcost.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Taxes & Convenience Fees</span>
              <span className="font-semibold text-emerald-400">Included</span>
            </div>
          </div>

          <div className="flex justify-between items-center py-5">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Total Amount Payable</p>
              <p className="text-3xl font-extrabold text-emerald-400 mt-0.5">₹{totalcost.toLocaleString('en-IN')}</p>
            </div>
            <div className="text-xs text-slate-400 text-right">
              🔒 256-Bit SSL Encrypted
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <button
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-white font-semibold text-sm transition-all duration-200"
            >
              ← Back to Details
            </button>

            <button
              onClick={handleClick}
              disabled={loading}
              className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-emerald-500/20 hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <span>Proceed to Payment</span>
                  <span className="text-lg">→</span>
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Preview;