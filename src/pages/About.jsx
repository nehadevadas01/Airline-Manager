import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function About({ user, setUser }) {
  const sections = [
    {
      title: 'Our Mission',
      text: 'Our mission is to revolutionize the way you book flights, making it easier, faster, and more convenient than ever before. We strive to empower travelers by offering a user-friendly platform that enables hassle-free booking, comprehensive flight information, and exceptional customer service.',
      img: '/mission.jpeg',
      icon: (
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
        </svg>
      ),
    },
    {
      title: 'Who We Are',
      text: 'Flyhigh is a leading provider of online flight booking services, catering to travelers from all walks of life. Our team comprises dedicated professionals with extensive experience in the travel industry, committed to delivering excellence in every aspect of our service.',
      img: '/whoweare.webp',
      icon: (
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      ),
    },
    {
      title: 'Our Commitment To You',
      text: "At Flyhigh, we are committed to excellence in every aspect of our service. Whether you are planning a business trip, a family vacation, or a spontaneous getaway, we're here to make your travel dreams a reality. Trust us to be your companion in the skies, and let us take you to your next destination with ease and comfort.",
      img: '/commitment.jpeg',
      icon: (
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" />
        </svg>
      ),
    },
  ];

  /* Key Metrics & Stats */
  const stats = [
    { value: '500+', label: 'Global Routes' },
    { value: '10M+', label: 'Happy Travelers' },
    { value: '50+', label: 'Airline Partners' },
    { value: '99.8%', label: 'On-Time Arrival' },
  ];

  /* Core Values */
  const coreValues = [
    {
      title: 'Seamless Booking',
      desc: 'Intuitive interface designed to get you from searching to confirmed ticket in under 2 minutes.',
      icon: '⚡',
    },
    {
      title: 'Transparent Pricing',
      desc: 'Zero hidden fees or surprises. What you see is what you pay, guaranteed every single time.',
      icon: '💎',
    },
    {
      title: '24/7 Dedicated Support',
      desc: 'Our customer support team is always ready to assist you before, during, and after your flight.',
      icon: '🛡️',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
      {/* ── Global Navbar ─────────────────────────────────── */}
      <Navbar user={user} setUser={setUser} />

      <main className="flex-1 pt-[72px]">
        {/* ── Hero Banner ──────────────────────────────────── */}
        <section className="relative overflow-hidden py-24 px-6">
          {/* Background Ambient Glows */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-r from-brand-500/15 to-purple-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-4xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-brand-300 text-xs font-semibold uppercase tracking-widest mb-6 backdrop-blur-md">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
              About Flyhigh
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
              <span>Your Trusted Partner in</span>
              <br />
              <span className="gradient-text">Simplifying Air Travel</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              At Flyhigh, we are dedicated to providing you with a seamless and efficient booking experience, ensuring that your journey starts off on the right foot.
            </p>
          </div>
        </section>

        {/* ── Stats Bar ────────────────────────────────────── */}
        <section className="relative px-6 pb-20">
          <div className="max-w-5xl mx-auto">
            <div className="glass rounded-3xl p-8 md:p-10 grid grid-cols-2 md:grid-cols-4 gap-8 shadow-card border border-white/10">
              {stats.map((s, i) => (
                <div key={i} className="text-center group">
                  <div className="text-3xl md:text-4xl font-extrabold gradient-text mb-1 group-hover:scale-105 transition-transform duration-300">
                    {s.value}
                  </div>
                  <div className="text-slate-400 text-xs md:text-sm font-medium uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Main About Content Sections ──────────────────── */}
        <section className="px-6 pb-28">
          <div className="max-w-6xl mx-auto space-y-24">
            {sections.map((section, i) => {
              const isReversed = i % 2 !== 0;
              return (
                <div
                  key={i}
                  className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-16`}
                >
                  {/* Image Card */}
                  <div className="relative group w-full lg:w-1/2 flex-shrink-0">
                    <div className="absolute -inset-4 bg-gradient-to-r from-brand-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative overflow-hidden rounded-3xl ring-1 ring-white/10 shadow-2xl">
                      <img
                        src={section.img}
                        alt={section.title}
                        className="w-full h-[320px] md:h-[360px] object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-80" />
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-5">
                      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-brand-300 shadow-glow-sm">
                        {section.icon}
                      </div>
                      <h2 className="text-2xl md:text-3xl font-extrabold text-white">{section.title}</h2>
                    </div>
                    <div className="w-16 h-1 rounded-full bg-gradient-to-r from-brand-500 to-purple-500 mb-6" />
                    <p className="text-slate-300 text-base md:text-lg leading-relaxed font-normal">
                      {section.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Core Values Section ───────────────────────────── */}
        <section className="py-20 px-6 bg-slate-900/60 border-y border-white/[0.06] relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
                Why Travel With <span className="gradient-text">Flyhigh</span>
              </h2>
              <p className="text-slate-400 max-w-lg mx-auto text-sm md:text-base">
                We combine industry-leading technology with genuine hospitality to make flight booking effortless.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {coreValues.map((val, idx) => (
                <div
                  key={idx}
                  className="p-8 rounded-3xl bg-white/[0.03] border border-white/[0.08] hover:border-brand-500/30 hover:bg-white/[0.06] transition-all duration-300 hover:-translate-y-1 shadow-card"
                >
                  <div className="text-3xl mb-4">{val.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{val.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Section ──────────────────────────────────── */}
        <section className="px-6 py-24">
          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 p-10 md:p-14 text-center shadow-glow">
              {/* Subtle background graphics */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                  Ready to Experience Seamless Travel?
                </h2>
                <p className="text-white/80 text-base md:text-lg mb-8 max-w-xl mx-auto">
                  Book your next journey with Flyhigh today and discover how easy flight booking should be.
                </p>
                <Link to="/">
                  <button className="px-8 py-4 rounded-full bg-slate-950 text-white border border-white/20 font-extrabold text-sm shadow-2xl hover:bg-slate-900 hover:border-white/40 hover:scale-105 active:scale-95 transition-all duration-300">
                    Search Flights Now →
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Global Footer ─────────────────────────────────── */}
      <Footer />
    </div>
  )
}

export default About
