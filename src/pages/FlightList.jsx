import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NavbarL from '../components/NavbarL';
import Footer from '../components/Footer';

const FlightList = ({ user, setUser }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state || {};
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3001/api/flights');
        if (!response.ok) {
          throw new Error('Failed to fetch flights');
        }
        const flightsData = await response.json();
        const filteredFlights = flightsData.filter(flight =>
          flight.originAirport === data.originAirport &&
          flight.destinationAirport === data.destinationAirport
        );

        const flightsWithDetails = [];
        for (const flight_ of filteredFlights) {
          const detailsResponse = await fetch('http://localhost:3001/api/flightinfo');
          if (detailsResponse.ok) {
            const detailsData = await detailsResponse.json();
            const flightDetails = detailsData.filter(flight =>
              flight.flightNumber === flight_.flightNumber &&
              formatDateTime(flight.departureTime)[0] === data.selectedDate?.toString()
            );
            if (flightDetails.length > 0) {
              flightsWithDetails.push({
                ...flight_,
                prices: flightDetails[0].prices,
                seatsAvailable: flightDetails[0].seatsAvailable,
                departureTime: flightDetails[0].departureTime,
                arrivalTime: flightDetails[0].arrivalTime
              });
            }
          }
        }
        setFlights(flightsWithDetails);
      } catch (err) {
        console.error("Error fetching flight list:", err);
      } finally {
        setLoading(false);
      }
    };

    if (data.originAirport && data.destinationAirport && data.selectedDate) {
      fetchFlights();
    } else {
      setLoading(false);
    }
  }, [data.originAirport, data.destinationAirport, data.selectedDate]);

  const timeDifference = (startTime, endTime) => {
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

  const getAirlineBadgeColor = (airlineName) => {
    if (!airlineName) return 'from-indigo-500 to-purple-500';
    if (airlineName.includes('Air India')) return 'from-red-500 to-amber-600';
    if (airlineName.includes('IndiGo')) return 'from-blue-600 to-indigo-600';
    if (airlineName.includes('SpiceJet')) return 'from-orange-500 to-amber-500';
    return 'from-brand-500 to-purple-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white font-sans flex flex-col">
      <NavbarL user={user} setUser={setUser} />

      {/* Main Container */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-4 py-8">
        
        {/* Search Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-white/[0.05] border border-white/10 p-6 md:p-8 backdrop-blur-xl shadow-2xl mb-8">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-400/20 text-brand-300 text-xs font-semibold uppercase tracking-wider mb-3">
                <svg className="w-4 h-4 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Available Flights
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
                <span>{data.originAirport || 'Origin'}</span>
                <span className="text-brand-400">→</span>
                <span>{data.destinationAirport || 'Destination'}</span>
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 mt-3 text-slate-300 text-sm">
                <span className="flex items-center gap-1.5 bg-white/[0.06] px-3 py-1 rounded-full border border-white/10">
                  📅 {formatDate(data.selectedDate)}
                </span>
                <span className="flex items-center gap-1.5 bg-white/[0.06] px-3 py-1 rounded-full border border-white/10">
                  👤 {data.passengers || 1} Passenger{(data.passengers || 1) > 1 ? 's' : ''}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/')}
              className="px-5 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-sm font-medium transition-all duration-200 flex items-center gap-2 group"
            >
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Modify Search
            </button>
          </div>
        </div>

        {/* Not Logged In Warning Banner */}
        {!user && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xl">💡</span>
              <span>You are currently viewing prices as a guest. <strong>Log in</strong> to select and book your tickets.</span>
            </div>
            <Link to="/login" className="px-4 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-100 font-semibold text-xs transition-all whitespace-nowrap">
              Log In Now
            </Link>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin mb-4" />
            <p className="text-slate-400 text-sm font-medium animate-pulse">Searching best available flights...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && flights.length === 0 && (
          <div className="text-center py-16 px-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-4xl text-indigo-400">
              ✈️
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No Flights Found</h3>
            <p className="text-slate-400 max-w-md mx-auto text-sm mb-8 leading-relaxed">
              We couldn't find any direct flights from <strong className="text-white">{data.originAirport}</strong> to <strong className="text-white">{data.destinationAirport}</strong> on {formatDate(data.selectedDate)}.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-500 to-purple-500 text-white font-semibold text-sm shadow-lg hover:shadow-glow hover:scale-105 transition-all duration-300"
            >
              Search Another Date
            </button>
          </div>
        )}

        {/* Flight Cards List */}
        {!loading && flights.length > 0 && (
          <div className="space-y-6">
            {flights.map((flight, index) => {
              const [depDate, depTime] = formatDateTime(flight.departureTime);
              const [arrDate, arrTime] = formatDateTime(flight.arrivalTime);
              const badgeGradient = getAirlineBadgeColor(flight.flightName);

              return (
                <div
                  key={index}
                  className="rounded-3xl bg-white/[0.04] hover:bg-white/[0.06] border border-white/10 p-6 md:p-8 backdrop-blur-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:border-white/20"
                >
                  {/* Flight Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 px-3.5 rounded-xl bg-gradient-to-r ${badgeGradient} flex items-center justify-center text-white font-extrabold text-sm shadow-md`}>
                        {flight.flightName}
                      </div>
                      <div>
                        <span className="font-mono text-slate-300 font-bold tracking-wider text-base">{flight.flightNumber}</span>
                        <span className="ml-3 text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                          Non-stop
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Route & Times */}
                  <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Origin */}
                    <div className="text-center md:text-left min-w-[120px]">
                      <p className="text-3xl font-extrabold text-white tracking-tight">{depTime}</p>
                      <p className="text-lg font-bold text-brand-300 mt-0.5">{flight.originAirport}</p>
                      <p className="text-xs text-slate-400">{formatDate(depDate)}</p>
                    </div>

                    {/* Flight Duration Visualizer */}
                    <div className="flex-1 w-full max-w-md flex flex-col items-center px-4">
                      <span className="text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                        ⏱️ {timeDifference(flight.departureTime, flight.arrivalTime)}
                      </span>
                      <div className="relative w-full flex items-center">
                        <div className="w-3 h-3 rounded-full bg-brand-400 shadow-glow" />
                        <div className="flex-1 h-0.5 bg-gradient-to-r from-brand-400 via-indigo-500 to-purple-400 relative">
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 px-2">
                            <span className="text-lg transform rotate-90 inline-block">✈️</span>
                          </div>
                        </div>
                        <div className="w-3 h-3 rounded-full bg-purple-400 shadow-glow" />
                      </div>
                    </div>

                    {/* Destination */}
                    <div className="text-center md:text-right min-w-[120px]">
                      <p className="text-3xl font-extrabold text-white tracking-tight">{arrTime}</p>
                      <p className="text-lg font-bold text-purple-300 mt-0.5">{flight.destinationAirport}</p>
                      <p className="text-xs text-slate-400">{formatDate(arrDate)}</p>
                    </div>
                  </div>

                  {/* Cabin Classes Section */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                    {/* Economy Class */}
                    <div className="rounded-2xl bg-slate-950/60 border border-white/10 p-5 flex flex-col justify-between hover:border-indigo-500/40 transition-colors">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-white text-base">Economy</h4>
                          <span className="text-xs text-slate-400 bg-white/5 px-2 py-0.5 rounded">Standard</span>
                        </div>
                        {flight.seatsAvailable.economy !== -1 ? (
                          <>
                            <div className="text-2xl font-extrabold text-emerald-400 mb-1">
                              ₹{flight.prices.economy?.toLocaleString('en-IN')}
                            </div>
                            <div className="text-xs text-slate-400 mb-4 flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-emerald-400" />
                              {flight.seatsAvailable.economy} seats remaining
                            </div>
                          </>
                        ) : (
                          <div className="text-rose-400 font-medium text-sm py-4">Not Available</div>
                        )}
                      </div>

                      {flight.seatsAvailable.economy !== -1 && (
                        user ? (
                          <Link
                            to="/passform"
                            state={{
                              originAirport: data.originAirport,
                              destinationAirport: data.destinationAirport,
                              passengers: data.passengers,
                              price: flight.prices.economy,
                              flightNumber: flight.flightNumber,
                              flightName: flight.flightName,
                              departureTime: flight.departureTime,
                              arrivalTime: flight.arrivalTime,
                              seat: "Economy"
                            }}
                          >
                            <button className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 transition-all duration-200">
                              Select Economy
                            </button>
                          </Link>
                        ) : (
                          <button
                            disabled
                            className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-500 font-semibold text-sm cursor-not-allowed border border-white/5"
                          >
                            Select Economy
                          </button>
                        )
                      )}
                    </div>

                    {/* Business Class */}
                    <div className="rounded-2xl bg-slate-950/60 border border-white/10 p-5 flex flex-col justify-between hover:border-purple-500/40 transition-colors">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-white text-base">Business</h4>
                          <span className="text-xs text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">Premium</span>
                        </div>
                        {flight.seatsAvailable.business !== -1 ? (
                          <>
                            <div className="text-2xl font-extrabold text-purple-400 mb-1">
                              ₹{flight.prices.business?.toLocaleString('en-IN')}
                            </div>
                            <div className="text-xs text-slate-400 mb-4 flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-purple-400" />
                              {flight.seatsAvailable.business} seats remaining
                            </div>
                          </>
                        ) : (
                          <div className="text-rose-400 font-medium text-sm py-4">Not Available</div>
                        )}
                      </div>

                      {flight.seatsAvailable.business !== -1 && (
                        user ? (
                          <Link
                            to="/passform"
                            state={{
                              originAirport: data.originAirport,
                              destinationAirport: data.destinationAirport,
                              passengers: data.passengers,
                              price: flight.prices.business,
                              flightNumber: flight.flightNumber,
                              flightName: flight.flightName,
                              departureTime: flight.departureTime,
                              arrivalTime: flight.arrivalTime,
                              seat: "Business"
                            }}
                          >
                            <button className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm shadow-lg shadow-purple-600/25 transition-all duration-200">
                              Select Business
                            </button>
                          </Link>
                        ) : (
                          <button
                            disabled
                            className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-500 font-semibold text-sm cursor-not-allowed border border-white/5"
                          >
                            Select Business
                          </button>
                        )
                      )}
                    </div>

                    {/* First Class */}
                    <div className="rounded-2xl bg-slate-950/60 border border-white/10 p-5 flex flex-col justify-between hover:border-amber-500/40 transition-colors">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-white text-base">First Class</h4>
                          <span className="text-xs text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">Luxury</span>
                        </div>
                        {flight.seatsAvailable.first !== -1 ? (
                          <>
                            <div className="text-2xl font-extrabold text-amber-400 mb-1">
                              ₹{flight.prices.first?.toLocaleString('en-IN')}
                            </div>
                            <div className="text-xs text-slate-400 mb-4 flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-amber-400" />
                              {flight.seatsAvailable.first} seats remaining
                            </div>
                          </>
                        ) : (
                          <div className="text-rose-400 font-medium text-sm py-4">Not Available</div>
                        )}
                      </div>

                      {flight.seatsAvailable.first !== -1 && (
                        user ? (
                          <Link
                            to="/passform"
                            state={{
                              originAirport: data.originAirport,
                              destinationAirport: data.destinationAirport,
                              passengers: data.passengers,
                              price: flight.prices.first,
                              flightNumber: flight.flightNumber,
                              flightName: flight.flightName,
                              departureTime: flight.departureTime,
                              arrivalTime: flight.arrivalTime,
                              seat: "First"
                            }}
                          >
                            <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-semibold text-sm shadow-lg shadow-amber-600/25 transition-all duration-200">
                              Select First Class
                            </button>
                          </Link>
                        ) : (
                          <button
                            disabled
                            className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-500 font-semibold text-sm cursor-not-allowed border border-white/5"
                          >
                            Select First Class
                          </button>
                        )
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

export default FlightList;
