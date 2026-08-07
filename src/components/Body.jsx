import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const Body = () => {
  const [showBookFlight, setShowBookFlight] = useState(true);
  const [airports, setAirports] = useState([]);
  const [airports_, setAirports_] = useState([]);
  const [originAirport, setOriginAirport] = useState('NULL');
  const [originAirport_, setOriginAirport_] = useState('NULL');
  const [destinationAirport, setDestinationAirport] = useState('NULL');
  const [destinationAirport_, setDestinationAirport_] = useState('NULL');
  const [filteredAirports, setFilteredAirports] = useState([]);
  const [filteredAirports_, setFilteredAirports_] = useState([]);
  const [passengers, setPassengers] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDate_, setSelectedDate_] = useState('');

  const navigate = useNavigate();

  const currentDateUTC = new Date();
  const currentDateIST = new Date(currentDateUTC.getTime() + (5.5 * 60 * 60 * 1000));
  console.log(currentDateIST);
  const currentDate = currentDateIST.toISOString().split('T')[0];

  const handleChangeP = (event) => {
    setPassengers(parseInt(event.target.value));
  };

  const handleChangeD = (event) => {
    setSelectedDate(event.target.value);
  };
  
  const handleChangeD_ = (event) => {
    setSelectedDate_(event.target.value);
  };

  useEffect(() => {
    fetch('http://localhost:3001/api/airports')
      .then(response => response.json())
      .then(data => {
        const Filter = data.filter(airport => airport.code !== destinationAirport);
        setAirports(Filter);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [destinationAirport]);

  useEffect(() => {
    fetch('http://localhost:3001/api/airports')
      .then(response => response.json())
      .then(data => {
        const Filter = data.filter(airport => airport.code !== destinationAirport_);
        setAirports_(Filter);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [destinationAirport_]);

  useEffect(() => {
    fetch('http://localhost:3001/api/airports')
      .then(response => response.json())
      .then(data => {
        const filtered = data.filter(airport => airport.code !== originAirport);
        setFilteredAirports(filtered);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [originAirport]);
  
  useEffect(() => {
    fetch('http://localhost:3001/api/airports')
      .then(response => response.json())
      .then(data => {
        const filtered = data.filter(airport => airport.code !== originAirport_);
        setFilteredAirports_(filtered);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [originAirport_]);

  const handleToggleToBook = () => {
    setShowBookFlight(true);
  };

  const handleToggleToStatus = () => {
    setShowBookFlight(false);
  };

  const handleChange = event => {
    setOriginAirport(event.target.value);
  };
  
  const handleChangeF = event => {
    setOriginAirport_(event.target.value);
  };

  const handleChange_ = event => {
    setDestinationAirport(event.target.value);
  };
  
  const handleChangeF_ = event => {
    setDestinationAirport_(event.target.value);
  };

  useEffect(() => {
    console.log('Origin airport selected:', originAirport);
  }, [originAirport]);
  
  useEffect(() => {
    console.log('Destination airport selected:', destinationAirport);
  }, [destinationAirport]);

  useEffect(() => {
    console.log('Passengers:',passengers);
  }, [passengers])

  useEffect(() => {
    console.log('Date:',selectedDate);
  }, [selectedDate])

  useEffect(() => {
    // Function to set the current date to state
    const setSystemDate = () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      setSelectedDate(formattedDate);
      setSelectedDate_(formattedDate);
    };
    // Call the function to set the current date when the component mounts
    setSystemDate();
  }, []);

  const handleSubmit = async () => {
    if (showBookFlight)
    {
      console.log("Submitting booking information");
      const data = {
        originAirport,
        destinationAirport,
        selectedDate,
        passengers
      };
      console.log("Booking submitted:", data);
    } 
    else 
    {
      console.log("Submitting flight status information");
      console.log("Flight status submitted:", {
        originAirport_,
        destinationAirport_,
        selectedDate_,
      });
      const data = {
        originAirport_,
        destinationAirport_,
        selectedDate_,
      };
      let response = await fetch("http://localhost:3001/fltstatus", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (response.ok) 
      {
        const result = await response.json();
        console.log('Flight Status submitted successfully:', result);
      } 
      else
      console.error('Failed to submit flight status:', response.statusText);
    }
  };

  /* ── Feature items data ──────────────────────────────── */
  const features = [
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
        </svg>
      ),
      title: 'Experience Tranquility',
      desc: 'Serenity Haven offers a tranquil escape, featuring comfortable seating, calming ambiance and attentive service.',
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      ),
      title: 'Elevate Your Experience',
      desc: 'Designed for discerning travelers, this exclusive lounge offers premium amenities, assistance and private workspace.',
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
      title: 'A Welcoming Space',
      desc: 'Create a family-friendly atmosphere, The Family Zone is the perfect haven for parents and children.',
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5V4.5m6 0v3.75m-6-3.75h6M6 13.12v5.38a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 18.5v-5.38" />
        </svg>
      ),
      title: 'A Culinary Delight',
      desc: 'Immerse yourself in a world of flavors, offering international cuisines, gourmet dishes and carefully curated beverages.',
    },
  ];

  /* ── Destination data ────────────────────────────────── */
  const destinations = [
    { name: 'Mumbai',  img: '/mumbai.jpg',   position: 'bg-bottom' },
    { name: 'Chennai', img: '/chennai.jpg',  position: 'bg-bottom' },
    { name: 'Kolkata', img: '/kolkata.jpeg', position: 'bg-bottom' },
    { name: 'Delhi',   img: '/delhi.jpg',    position: 'bg-top'    },
  ];

  /* ── Shared input class ──────────────────────────────── */
  const inputClass = "mt-1.5 block w-full rounded-xl bg-white/[0.07] border border-white/[0.12] text-white text-sm h-11 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400/40 transition-all duration-200 placeholder:text-white/30 form-select";
  const dateInputClass = "mt-1.5 block w-full rounded-xl bg-white/[0.07] border border-white/[0.12] text-white text-sm h-11 pl-4 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400/40 transition-all duration-200 [color-scheme:dark]";
  const labelClass = "block text-xs font-medium text-white/50 uppercase tracking-wider mt-4 first:mt-0";

  return (
    <>
      {/* ═══════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Video Background */}
        <video
          src="/bghome.mp4"
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/90" />

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center w-full max-w-2xl mx-auto px-4 pt-24 pb-16">
          {/* Headline */}
          <h1 className="text-5xl md:text-6xl font-extrabold text-center leading-tight mb-4 animate-fade-in">
            <span className="text-white">Explore the World</span>
            <br />
            <span className="gradient-text">with Flyhigh</span>
          </h1>
          <p className="text-white/50 text-center text-lg mb-10 animate-fade-in" style={{ animationDelay: '0.15s' }}>
            Book your next adventure in seconds. Premium flights, unbeatable prices.
          </p>

          {/* ── Booking Card ────────────────────────────── */}
          <div className="w-full glass rounded-3xl p-8 shadow-2xl animate-slide-up" style={{ animationDelay: '0.3s' }}>
            {/* Tabs */}
            <div className="flex gap-2 mb-7">
              <button
                onClick={handleToggleToBook}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  showBookFlight
                    ? 'bg-gradient-to-r from-brand-500 to-purple-500 text-white shadow-glow-sm'
                    : 'bg-white/[0.06] text-white/50 hover:text-white/80 hover:bg-white/[0.1]'
                }`}
              >
                Book a Flight
              </button>
              <button
                onClick={handleToggleToStatus}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  !showBookFlight
                    ? 'bg-gradient-to-r from-brand-500 to-purple-500 text-white shadow-glow-sm'
                    : 'bg-white/[0.06] text-white/50 hover:text-white/80 hover:bg-white/[0.1]'
                }`}
              >
                Flight Status
              </button>
            </div>

            {/* Book a Flight Form */}
            <div style={{ display: showBookFlight ? 'block' : 'none' }}>
              <label htmlFor="from" className={labelClass}>From</label>
              <select id="from" value={originAirport} onChange={handleChange} className={inputClass}>
                <option value="NULL" key="NULL" className="bg-slate-900 text-white">Select Origin</option>
                {airports.map(airport => (
                  <option key={airport.code} value={airport.code} className="bg-slate-900 text-white">
                    {airport.name} ({airport.code}) - {airport.country}
                  </option>
                ))}
              </select>

              <label htmlFor="to" className={labelClass}>To</label>
              <select id="to" value={destinationAirport} onChange={handleChange_} className={inputClass}>
                <option value="NULL" key="NULL" className="bg-slate-900 text-white">Select Destination</option>
                {filteredAirports.map(airport => (
                  <option key={airport.code} value={airport.code} className="bg-slate-900 text-white">
                    {airport.name} ({airport.code}) - {airport.country}
                  </option>
                ))}
              </select>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <label htmlFor="date" className={labelClass}>Date</label>
                  <input type="date" id="date" value={selectedDate} onChange={handleChangeD} min={currentDate} name="date" className={dateInputClass} />
                </div>
                <div>
                  <label htmlFor="passengers" className={labelClass}>Passengers</label>
                  <input type="number" id="passengers" className={dateInputClass} min="1" value={passengers} onChange={handleChangeP} />
                </div>
              </div>
            </div>

            {/* Flight Status Form */}
            <div style={{ display: showBookFlight ? 'none' : 'block' }}>
              <label htmlFor="fromStatus" className={labelClass}>From</label>
              <select id="fromStatus" value={originAirport_} onChange={handleChangeF} className={inputClass}>
                <option value="NULL" key="NULL" className="bg-slate-900 text-white">Select Origin</option>
                {airports_.map(airport => (
                  <option key={airport.code} value={airport.code} className="bg-slate-900 text-white">
                    {airport.name} ({airport.code}) - {airport.country}
                  </option>
                ))}
              </select>

              <label htmlFor="toStatus" className={labelClass}>To</label>
              <select id="toStatus" value={destinationAirport_} onChange={handleChangeF_} className={inputClass}>
                <option value="NULL" key="NULL" className="bg-slate-900 text-white">Select Destination</option>
                {filteredAirports_.map(airport => (
                  <option key={airport.code} value={airport.code} className="bg-slate-900 text-white">
                    {airport.name} ({airport.code}) - {airport.country}
                  </option>
                ))}
              </select>

              <div className="mt-6">
                <label htmlFor="dateStatus" className={labelClass}>Date</label>
                <input type="date" id="dateStatus" value={selectedDate_} onChange={handleChangeD_} min={currentDate} className={dateInputClass} />
              </div>
            </div>

            {/* Submit */}
            <div className="mt-8">
              {showBookFlight ? (
                <Link to={`/fltlist/origin=${originAirport}/destination=${destinationAirport}/date=${selectedDate}/passengers=${passengers}`} state={{ originAirport, destinationAirport, selectedDate, passengers }}>
                  <button
                    type="submit"
                    id="submit"
                    onClick={handleSubmit}
                    disabled={originAirport === "NULL" || destinationAirport === "NULL"}
                    className="group relative w-full py-4 rounded-2xl bg-gradient-to-r from-brand-500 via-purple-600 to-indigo-600 text-white font-bold text-base shadow-xl shadow-brand-500/25 hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden border border-white/20"
                  >
                    <span className="relative z-10 flex items-center gap-2 tracking-wide">
                      <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Search Available Flights
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-indigo-500 to-brand-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </Link>
              ) : (
                <Link to={`/fltstatus/origin=${originAirport_}/destination=${destinationAirport_}/date=${selectedDate_}`} state={{ originAirport: originAirport_, destinationAirport: destinationAirport_, selectedDate: selectedDate_ }}>
                  <button
                    type="submit"
                    id="submit"
                    onClick={handleSubmit}
                    disabled={originAirport_ === "NULL" || destinationAirport_ === "NULL"}
                    className="group relative w-full py-4 rounded-2xl bg-gradient-to-r from-brand-500 via-purple-600 to-indigo-600 text-white font-bold text-base shadow-xl shadow-brand-500/25 hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden border border-white/20"
                  >
                    <span className="relative z-10 flex items-center gap-2 tracking-wide">
                      <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Search Flight Status
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-indigo-500 to-brand-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-float">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
            <div className="w-1 h-2.5 rounded-full bg-white/40 animate-bounce" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FEATURES SECTION
      ═══════════════════════════════════════════════════ */}
      <section className="relative py-24 px-6 bg-gradient-to-b from-slate-900 to-slate-950 overflow-hidden">
        {/* Decorative blurs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image Side */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-brand-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div
                className="relative h-[380px] rounded-3xl bg-[url('/airplane.avif')] bg-center bg-cover shadow-2xl ring-1 ring-white/10"
              />
            </div>

            {/* Content Side */}
            <div>
              <h2 className="text-4xl font-extrabold text-white mb-2">
                Start Planning Your
              </h2>
              <h2 className="text-4xl font-extrabold gradient-text mb-10">
                Next Trip
              </h2>

              <div className="grid sm:grid-cols-2 gap-5">
                {features.map((f, i) => (
                  <div
                    key={i}
                    className="group p-5 rounded-2xl bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.08] hover:border-white/[0.18] hover:shadow-card transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-500/30 border border-white/10 group-hover:scale-110 transition-transform duration-300">
                      {f.icon}
                    </div>
                    <h3 className="font-semibold text-white text-sm mb-1.5">{f.title}</h3>
                    <p className="text-slate-400 text-xs leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          DESTINATIONS SECTION
      ═══════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold text-white mb-3">
              Explore <span className="gradient-text">New Places</span>
            </h2>
            <p className="text-slate-400 max-w-md mx-auto">
              Discover India's most vibrant cities with Flyhigh's premium routes.
            </p>
            <div className="mt-4 mx-auto w-20 h-1 rounded-full bg-gradient-to-r from-brand-500 to-purple-500" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((d, i) => (
              <div
                key={i}
                className="destination-card group cursor-pointer hover:scale-[1.03] transition-transform duration-500"
              >
                <div
                  className={`h-[320px] w-full bg-cover ${d.position} transition-transform duration-700 group-hover:scale-110`}
                  style={{ backgroundImage: `url('${d.img}')` }}
                />
                <span className="city-name">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Body;
