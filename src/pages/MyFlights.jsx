import React, { useState, useEffect } from 'react';
import NavbarM from '../components/NavbarM';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const MyFlights = ({ user }) => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state || {};

  const storedUserStr = sessionStorage.getItem('user');
  const storedUser = storedUserStr ? JSON.parse(storedUserStr) : null;
  const activeUser = user || storedUser;
  const activeEmail = data.email || (activeUser ? activeUser.email : null);

  useEffect(() => {
    if (!activeUser) {
      alert('Please log in to view your bookings.');
      navigate('/login');
      return;
    }

    const fetchFlights = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3001/bookings');
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const flightsData = await response.json();
        const filteredFlights = flightsData.filter(flight => flight.email === activeEmail);
        setFlights(filteredFlights);
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    if (activeEmail) {
      fetchFlights();
    } else {
      setLoading(false);
    }
  }, [activeEmail, activeUser, navigate]);

  const handleCancel = (flightNumber) => {
    const confirmCancel = window.confirm(`Are you sure you want to cancel your booking for flight ${flightNumber}?`);
    if (confirmCancel) {
      alert(`Flight cancellation request for ${flightNumber} has been submitted.`);
    }
  };

  const formatDateTime = (dateTimeString) => {
    if (typeof dateTimeString !== 'string') return ["Invalid Date", ""];
    const [datePart, timePart] = dateTimeString.split('T');
    return [datePart, timePart || ""];
  };

  const formatDate = (dateString) => {
    if (typeof dateString !== 'string') return "Invalid Date";
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString;
    const [year, month, day] = parts;
    return `${day}-${month}-${year}`;
  };

  const getFlightCategory = (departureTime) => {
    if (!departureTime) return 'upcoming';
    const now = new Date();
    const depDate = new Date(departureTime);
    return depDate >= now ? 'upcoming' : 'past';
  };

  const getFlightStatusInfo = (departureTime, category) => {
    if (category === 'past') {
      return { label: 'Completed', style: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
    }
    const now = new Date();
    const depDate = new Date(departureTime);
    const diffHours = (depDate - now) / (1000 * 60 * 60);

    if (diffHours < 0) {
      return { label: 'Completed', style: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
    } else if (diffHours <= 24) {
      return { label: 'Boarding Soon', style: 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse' };
    } else {
      return { label: 'Confirmed', style: 'bg-brand-500/10 text-brand-400 border-brand-500/20' };
    }
  };

  const filteredFlights = flights.filter((flight) => {
    const flightData = flight.data || {};
    const matchesSearch =
      (flightData.originAirport || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (flightData.destinationAirport || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (flightData.flightName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (flightData.flightNumber || '').toLowerCase().includes(searchQuery.toLowerCase());

    const category = getFlightCategory(flightData.departureTime);
    const matchesTab = category === activeTab;

    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white font-sans flex flex-col">
      <NavbarM user={activeUser} />

      <main className="flex-grow max-w-5xl w-full mx-auto px-4 py-12 relative overflow-hidden">
        {/* Glow background orbs */}
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[120px] pointer-events-none -z-10 animate-float" />
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none -z-10 animate-float" style={{ animationDelay: '-3s' }} />

        {/* Section Header */}
        <div className="pb-6 border-b border-white/10 mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white animate-fade-in">
            My Booked Flights
          </h1>
          <p className="text-slate-400 text-sm mt-1.5 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            View details, print e-tickets, or manage your active itineraries.
          </p>
        </div>

        {/* Search & Tabs Controls */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-8">
          {/* Tab Selector */}
          <div className="flex bg-slate-900/60 border border-white/10 p-1.5 rounded-2xl backdrop-blur-md">
            <button
              onClick={() => {
                setActiveTab('upcoming');
                setSearchQuery('');
              }}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${
                activeTab === 'upcoming'
                  ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-glow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Upcoming Trips
            </button>
            <button
              onClick={() => {
                setActiveTab('past');
                setSearchQuery('');
              }}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${
                activeTab === 'past'
                  ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-glow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Past Journeys
            </button>
          </div>

          {/* Search Input */}
          <div className="relative flex-grow md:max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search by city, airline, or flight..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/60 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200 text-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
              <div className="absolute inset-0 rounded-full border-4 border-brand-500 border-t-transparent animate-spin"></div>
            </div>
            <p className="text-slate-400 text-sm font-medium">Retrieving flight records...</p>
          </div>
        ) : filteredFlights.length === 0 ? (
          <div className="text-center rounded-3xl glass border border-white/10 p-16 shadow-glow max-w-lg mx-auto mt-6 animate-slide-up">
            <div className="w-20 h-20 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-6 shadow-glow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-brand-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold text-white mb-2">No Bookings Found</h2>
            <p className="text-slate-400 text-sm max-w-sm mx-auto mb-8 leading-relaxed">
              {searchQuery
                ? "No matching bookings found for your search query. Try typing something else."
                : activeTab === 'upcoming'
                ? "You don't have any upcoming flights scheduled. Time to start planning your next journey!"
                : "You haven't completed any flights with us yet."}
            </p>
            {!searchQuery && (
              <Link to="/">
                <button className="bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold px-8 py-3.5 rounded-xl shadow-glow hover:shadow-glow-lg transition-all duration-300 transform active:scale-[0.98]">
                  Search Flights
                </button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6 animate-slide-up">
            {filteredFlights.map((flight, index) => {
              const flightData = flight.data || {};
              const [depDate, depTime] = formatDateTime(flightData.departureTime);
              const [arrDate, arrTime] = formatDateTime(flightData.arrivalTime);
              const statusInfo = getFlightStatusInfo(flightData.departureTime, activeTab);
              const passengersList = flight.formData || [];

              return (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-3xl glass border border-white/10 p-6 md:p-8 shadow-glow hover:shadow-glow-lg hover:border-white/20 transition-all duration-300 flex flex-col gap-6"
                >
                  {/* Decorative glowing gradient path overlay */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-brand-500/10 to-transparent rounded-full blur-3xl pointer-events-none group-hover:opacity-100 opacity-50 transition-opacity duration-300"></div>

                  {/* Header Row: Airline, Flight Number, Seat, Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform duration-300">
                        ✈️
                      </div>
                      <div>
                        <h3 className="font-extrabold text-lg text-white leading-tight">{flightData.flightName}</h3>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{flightData.flightNumber}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold bg-brand-500/10 text-brand-300 border border-brand-500/20 capitalize">
                        {flightData.seat || 'Economy'} Class
                      </span>
                      <span className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold border ${statusInfo.style}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>

                  {/* Flight Details: Departure/Arrival, Visual Line */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-2">
                    {/* Departure info */}
                    <div className="flex-1">
                      <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Departure</span>
                      <h4 className="text-3xl font-black tracking-tight text-white">{flightData.originAirport}</h4>
                      <div className="text-xl font-bold text-slate-100 mt-1">{depTime}</div>
                      <div className="text-xs text-slate-400 font-medium mt-0.5">{formatDate(depDate)}</div>
                    </div>

                    {/* Custom flight progress graphic */}
                    <div className="flex-grow relative mx-6 flex items-center justify-center max-w-[240px] hidden sm:flex">
                      <div className="w-full flex items-center justify-between relative">
                        <div className="h-2.5 w-2.5 rounded-full bg-brand-500 z-10 shadow-[0_0_8px_#6366f1]"></div>
                        <div className="flex-grow border-t-2 border-dashed border-white/15 relative">
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900/90 border border-white/10 p-2 rounded-full text-brand-400 group-hover:text-amber-400 group-hover:scale-110 transition-all duration-300 shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-4 h-4 rotate-90">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                          </div>
                        </div>
                        <div className="h-2.5 w-2.5 rounded-full bg-indigo-400 z-10 shadow-[0_0_8px_#6366f1]"></div>
                      </div>
                    </div>

                    {/* Arrival info */}
                    <div className="flex-1 md:text-right">
                      <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Arrival</span>
                      <h4 className="text-3xl font-black tracking-tight text-white">{flightData.destinationAirport}</h4>
                      <div className="text-xl font-bold text-slate-100 mt-1">{arrTime}</div>
                      <div className="text-xs text-slate-400 font-medium mt-0.5">{formatDate(arrDate)}</div>
                    </div>
                  </div>

                  {/* Passengers segment */}
                  {passengersList.length > 0 && (
                    <div className="pt-4 border-t border-white/5 flex flex-col gap-2.5">
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Passengers booked</div>
                      <div className="flex flex-wrap gap-2">
                        {passengersList.map((passenger, pIdx) => (
                          <span
                            key={pIdx}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-white/5 text-xs text-slate-200 font-semibold"
                          >
                            <span className="text-brand-400 text-sm">👤</span>
                            {passenger.title}. {passenger.firstName} {passenger.lastName}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions segment */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/5">
                    <div className="text-slate-400 text-xs font-semibold">
                      Booked On: {formatDate(flight.time?.split('T')[0])} {flight.time?.split('T')[1]?.substring(0, 5) || ''}
                    </div>

                    <div className="flex items-center gap-3">
                      <Link to="/eticket_" state={{ data: flight }}>
                        <button className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/40 transition-all duration-200 flex items-center justify-center gap-2 text-sm transform active:scale-95">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 1.522A1 1 0 0116.9 20.7H7.1a1 1 0 01-.989-1.178L6.34 18m11.32 0h-11.32m0 0h-.01m0 0h-.01m0 0h-.01m0 0H6.25m11.41 0h.01m0 0h.01m0 0h.01m0 0H17.75M12 3v9m0 0l-3-3m3 3l3-3" />
                          </svg>
                          Print E-Ticket
                        </button>
                      </Link>

                      {activeTab === 'upcoming' && (
                        <button
                          className="w-full sm:w-auto bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 font-bold px-6 py-3 rounded-xl transition-all duration-200 text-sm transform active:scale-95"
                          onClick={() => handleCancel(flightData.flightNumber)}
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MyFlights;
