const { MongoClient } = require('mongodb');
const uri = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri);

async function run() {
  await client.connect();
  const db = client.db('Airline');

  // ── Date helpers ──────────────────────────────────────
  const now = new Date();
  const formatDate = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const today = formatDate(now);
  const tomorrow = formatDate(new Date(now.getTime() + 86400000));
  const dayAfter = formatDate(new Date(now.getTime() + 2 * 86400000));

  // ── Airports ──────────────────────────────────────────
  const airports = ['DEL', 'BOM', 'MAA', 'CCU'];

  // ── Airlines with codes ───────────────────────────────
  const airlines = [
    { name: 'Air India', code: 'AI' },
    { name: 'IndiGo', code: '6E' },
    { name: 'SpiceJet', code: 'SG' },
  ];

  // ── Distance-based pricing (approx INR) ───────────────
  const routePricing = {
    'DEL-BOM': { economy: 5500, business: 14000, first: 28000 },
    'BOM-DEL': { economy: 5500, business: 14000, first: 28000 },
    'DEL-MAA': { economy: 6500, business: 16000, first: 32000 },
    'MAA-DEL': { economy: 6500, business: 16000, first: 32000 },
    'DEL-CCU': { economy: 6000, business: 15000, first: 30000 },
    'CCU-DEL': { economy: 6000, business: 15000, first: 30000 },
    'BOM-MAA': { economy: 4500, business: 11000, first: 22000 },
    'MAA-BOM': { economy: 4500, business: 11000, first: 22000 },
    'BOM-CCU': { economy: 7000, business: 17000, first: 34000 },
    'CCU-BOM': { economy: 7000, business: 17000, first: 34000 },
    'MAA-CCU': { economy: 5000, business: 12000, first: 25000 },
    'CCU-MAA': { economy: 5000, business: 12000, first: 25000 },
  };

  // ── Flight duration in hours (approx) ─────────────────
  const routeDuration = {
    'DEL-BOM': 2.25, 'BOM-DEL': 2.25,
    'DEL-MAA': 2.75, 'MAA-DEL': 2.75,
    'DEL-CCU': 2.25, 'CCU-DEL': 2.25,
    'BOM-MAA': 1.75, 'MAA-BOM': 1.75,
    'BOM-CCU': 2.75, 'CCU-BOM': 2.75,
    'MAA-CCU': 2.0,  'CCU-MAA': 2.0,
  };

  // ── Departure hours per airline per route ─────────────
  // Each airline gets 1 departure time per route to keep data manageable
  const airlineDepartureHours = {
    'AI': [6, 14, 22],   // morning, afternoon, night
    '6E': [8, 16, 20],
    'SG': [10, 12, 18],
  };

  // ── Build all flight routes and schedules ─────────────
  const flightDocs = [];
  const infoDocs = [];
  let flightCounter = {};

  for (const airline of airlines) {
    flightCounter[airline.code] = 100;

    for (let i = 0; i < airports.length; i++) {
      for (let j = 0; j < airports.length; j++) {
        if (i === j) continue;

        const origin = airports[i];
        const dest = airports[j];
        const routeKey = `${origin}-${dest}`;
        const flightNumber = `${airline.code}${flightCounter[airline.code]}`;
        flightCounter[airline.code] += 1;

        // Flight route document
        flightDocs.push({
          flightName: airline.name,
          flightNumber,
          originAirport: origin,
          destinationAirport: dest,
        });

        // Pick a departure hour for this airline
        const depHourIndex = (i + j) % airlineDepartureHours[airline.code].length;
        const depHour = airlineDepartureHours[airline.code][depHourIndex];
        const duration = routeDuration[routeKey] || 2;

        // Create flight info for today, tomorrow, and day after
        const dates = [today, tomorrow, dayAfter];
        for (const date of dates) {
          const depTime = `${date}T${String(depHour).padStart(2, '0')}:00`;

          // Calculate arrival time
          const depDate = new Date(`${date}T${String(depHour).padStart(2, '0')}:00:00`);
          const arrDate = new Date(depDate.getTime() + duration * 60 * 60 * 1000);
          const arrDateStr = formatDate(arrDate);
          const arrHour = String(arrDate.getHours()).padStart(2, '0');
          const arrMin = String(arrDate.getMinutes()).padStart(2, '0');
          const arrTime = `${arrDateStr}T${arrHour}:${arrMin}`;

          const prices = routePricing[routeKey] || { economy: 5000, business: 12000, first: 25000 };

          infoDocs.push({
            flightNumber,
            departureDate: date,
            departureTime: depTime,
            arrivalTime: arrTime,
            prices: { ...prices },
            seatsAvailable: { economy: 60, business: 12, first: 4 },
          });
        }
      }
    }
  }

  // ── Seed Airports collection ──────────────────────────
  const airportDocs = [
    { code: 'DEL', name: 'Delhi', country: 'India', city: 'New Delhi' },
    { code: 'BOM', name: 'Mumbai', country: 'India', city: 'Mumbai' },
    { code: 'MAA', name: 'Chennai', country: 'India', city: 'Chennai' },
    { code: 'CCU', name: 'Kolkata', country: 'India', city: 'Kolkata' },
  ];

  for (const doc of airportDocs) {
    await db.collection('Airports').updateOne(
      { code: doc.code },
      { $set: doc },
      { upsert: true }
    );
  }

  // ── Upsert flights ───────────────────────────────────
  for (const doc of flightDocs) {
    await db.collection('Flights').updateOne(
      { flightNumber: doc.flightNumber },
      { $set: doc },
      { upsert: true }
    );
  }

  // ── Upsert flight info ───────────────────────────────
  for (const doc of infoDocs) {
    await db.collection('Flight Info').updateOne(
      { flightNumber: doc.flightNumber, departureDate: doc.departureDate },
      { $set: doc },
      { upsert: true }
    );
  }

  console.log('=== Seed Complete ===');
  console.log(`Dates seeded: ${today}, ${tomorrow}, ${dayAfter}`);
  console.log(`Flight routes: ${flightDocs.length} (${airlines.length} airlines × ${airports.length * (airports.length - 1)} routes)`);
  console.log(`Flight schedules: ${infoDocs.length} (${flightDocs.length} routes × 3 days)`);
  console.log(`Airports: ${airportDocs.length}`);
  console.log('\nFlight numbers:');
  for (const airline of airlines) {
    const airlineFlights = flightDocs.filter(f => f.flightName === airline.name);
    console.log(`  ${airline.name}: ${airlineFlights.map(f => f.flightNumber).join(', ')}`);
  }

  await client.close();
}

run().catch((error) => {
  console.error('Seed error:', error);
  process.exit(1);
});
