import React, { useEffect, useRef } from 'react';
import NavbarM from '../components/NavbarM';
import { useLocation, useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import Footer from '../components/Footer';

const Eticket = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const ticketref = useRef();
  
  const query = new URLSearchParams(location.search);
  const info = query.get('info');
  const data = info ? JSON.parse(decodeURIComponent(info)) : {};

  const handlePrint = useReactToPrint({
    content: () => ticketref.current,
    documentTitle: `E-Tickets_${data.data?.flightNumber || 'Flyhigh'}`,
  });

  const now = new Date();
  const formattedTime = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}T${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

  const bookingData = {
    email: data.user?.email || 'guest@flyhigh.com',
    data: data.data || {},
    formData: data.formData || [],
    time: formattedTime
  };

  const updateSeatData = {
    flightNumber: data.data?.flightNumber,
    departureTime: data.data?.departureTime,
    arrivalTime: data.data?.arrivalTime,
    passengers: data.data?.passengers,
    seat: data.data?.seat ? data.data.seat.toLowerCase() : 'economy'
  };

  useEffect(() => {
    if (!sessionStorage.getItem('bookingSent') && data.data) {
      sessionStorage.setItem('bookingSent', 'true');
      
      const sendBooking = async () => {
        try {
          let response = await fetch("http://localhost:3001/bookings", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
          });
          if (response.ok) {
            console.log('Booking recorded successfully in MongoDB');
          }
        } catch (err) {
          console.error('Failed to submit booking:', err);
        }
      };

      const updateFlightSeats = async () => {
        try {
          let response = await fetch("http://localhost:3001/api/flight", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateSeatData)
          });
          if (response.ok) {
            console.log('Seats updated successfully in MongoDB');
          }
        } catch (err) {
          console.error('Failed to update seats:', err);
        }
      };

      updateFlightSeats();
      sendBooking();
    }
  }, []);

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

  const flight = data.data || {};
  const passengers = data.formData || [];
  const currentUser = data.user || user || {};

  const [depDate, depTime] = formatDateTime(flight.departureTime);
  const [arrDate, arrTime] = formatDateTime(flight.arrivalTime);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white font-sans flex flex-col">
      <NavbarM user={currentUser} />

      <main className="flex-grow max-w-5xl w-full mx-auto px-4 py-10">
        
        {/* Success Banner */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-3xl text-emerald-400 shadow-lg shadow-emerald-500/10">
            ✓
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Booking Confirmed!
          </h1>
          <p className="text-slate-400 text-sm mt-1">Your e-ticket and boarding passes have been issued successfully.</p>
        </div>

        {/* Printable Tickets Area */}
        <div ref={ticketref} className="space-y-8">
          {passengers.map((passenger, index) => {
            const pnrCode = `FH-${Math.floor(100000 + Math.random() * 900000)}`;

            return (
              <div
                key={index}
                className="relative overflow-hidden rounded-3xl bg-slate-900 border border-white/15 text-slate-900 shadow-2xl transition-all duration-300 print:shadow-none print:border-black"
              >
                {/* Main Pass Container */}
                <div className="flex flex-col lg:flex-row">
                  
                  {/* Left Main Ticket section */}
                  <div className="flex-1 p-6 md:p-8 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white border-b lg:border-b-0 lg:border-r border-white/10 relative">
                    
                    {/* Ticket Header */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <img src="/plane.png" alt="Flyhigh" className="h-8 w-8" />
                        <span className="font-extrabold text-xl tracking-tight text-white">Flyhigh Airlines</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-400/30 font-bold text-xs uppercase tracking-wider">
                          {flight.seat || 'Economy'} Class
                        </span>
                        <span className="font-mono text-xs text-slate-400 bg-white/5 px-3 py-1 rounded-full">
                          PNR: <strong className="text-white">{pnrCode}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Airline & Route Summary */}
                    <div className="py-6 flex items-center justify-between gap-4">
                      {/* Origin */}
                      <div>
                        <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">From</p>
                        <p className="text-3xl font-extrabold text-white mt-0.5">{flight.originAirport}</p>
                        <p className="text-sm font-semibold text-brand-300">{depTime}</p>
                        <p className="text-xs text-slate-400">{formatDate(depDate)}</p>
                      </div>

                      {/* Flight Path Graphic */}
                      <div className="flex-1 max-w-xs px-4 text-center">
                        <span className="text-xs font-semibold text-slate-400">
                          {flight.flightName} ({flight.flightNumber})
                        </span>
                        <div className="relative w-full flex items-center my-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-brand-400" />
                          <div className="flex-1 h-0.5 bg-gradient-to-r from-brand-400 via-indigo-500 to-purple-400 relative">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 px-1">
                              <span className="text-xs inline-block transform rotate-90">✈️</span>
                            </div>
                          </div>
                          <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                        </div>
                        <span className="text-xs font-mono text-slate-400">
                          {timeDifference(flight.departureTime, flight.arrivalTime)}
                        </span>
                      </div>

                      {/* Destination */}
                      <div className="text-right">
                        <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">To</p>
                        <p className="text-3xl font-extrabold text-white mt-0.5">{flight.destinationAirport}</p>
                        <p className="text-sm font-semibold text-purple-300">{arrTime}</p>
                        <p className="text-xs text-slate-400">{formatDate(arrDate)}</p>
                      </div>
                    </div>

                    {/* Passenger & Flight Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/10 bg-white/[0.02] -mx-6 md:-mx-8 -mb-6 md:-mb-8 p-6 md:p-8">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Passenger</p>
                        <p className="font-bold text-white text-base mt-1">
                          {passenger.title}. {passenger.firstName} {passenger.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Flight No.</p>
                        <p className="font-mono font-bold text-white text-base mt-1">{flight.flightNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Gate / Boarding</p>
                        <p className="font-bold text-emerald-400 text-base mt-1">Gate B4 • 45m Prior</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Contact Mobile</p>
                        <p className="font-mono font-bold text-white text-base mt-1">{passenger.mobile || currentUser.mobileNumber || '-'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Ticket Stub Section */}
                  <div className="w-full lg:w-72 bg-gradient-to-br from-slate-900 to-indigo-950 p-6 md:p-8 flex flex-col justify-between items-center text-center border-t lg:border-t-0 border-white/10">
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Boarding Pass</span>
                        <span className="text-xs font-bold text-brand-400">#0{index + 1}</span>
                      </div>

                      <div className="bg-slate-950 p-4 rounded-2xl border border-white/10 mb-4 text-left">
                        <p className="text-xs text-slate-400 uppercase font-semibold">Passenger</p>
                        <p className="font-bold text-white text-sm truncate">{passenger.title}. {passenger.firstName} {passenger.lastName}</p>
                        
                        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/10">
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase">Flight</p>
                            <p className="font-mono font-bold text-xs text-white">{flight.flightNumber}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase">Seat</p>
                            <p className="font-bold text-xs text-emerald-400">Assigned at Check-in</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Barcode SVG illustration */}
                    <div className="w-full bg-white p-3 rounded-xl flex flex-col items-center justify-center">
                      <div className="w-full h-12 flex justify-between items-center px-1">
                        {[4,2,6,1,3,5,2,4,1,5,3,2,6,1,4,2,5,3,1,4,2,6,3,1].map((width, i) => (
                          <div
                            key={i}
                            className="bg-slate-950 h-full rounded-sm"
                            style={{ width: `${width * 1.5}px` }}
                          />
                        ))}
                      </div>
                      <span className="font-mono text-[10px] text-slate-700 tracking-widest mt-1">
                        {pnrCode} - {flight.flightNumber}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 print:hidden">
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-white font-semibold text-sm transition-all duration-200"
          >
            ← Return to Home
          </button>

          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:scale-105 active:scale-95 text-white font-bold text-base shadow-xl shadow-emerald-500/25 hover:shadow-glow transition-all duration-300 flex items-center justify-center gap-3"
          >
            <span className="text-xl">🖨️</span>
            <span>Print / Download E-Ticket</span>
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Eticket;
