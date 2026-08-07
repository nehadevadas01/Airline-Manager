import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="relative bg-slate-950 text-white overflow-hidden">
      {/* Decorative gradient line at the top */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <img src="/plane.png" alt="Flyhigh" className="h-8 w-8" />
              <span className="text-2xl font-extrabold gradient-text">Flyhigh</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Your premium airline partner. Book flights, manage reservations, and explore destinations worldwide.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="h-9 w-9 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center hover:bg-brand-500/20 hover:border-brand-400/30 transition-all duration-300">
                <img src="/facebook.png" alt="Facebook" className="h-4 w-4 invert opacity-60" />
              </a>
              <a href="#" className="h-9 w-9 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center hover:bg-brand-500/20 hover:border-brand-400/30 transition-all duration-300">
                <img src="/instagram.png" alt="Instagram" className="h-4 w-4 invert opacity-60" />
              </a>
              <a href="#" className="h-9 w-9 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center hover:bg-brand-500/20 hover:border-brand-400/30 transition-all duration-300">
                <img src="/twitter.png" alt="Twitter" className="h-4 w-4 invert opacity-60" />
              </a>
              <a href="#" className="h-9 w-9 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center hover:bg-brand-500/20 hover:border-brand-400/30 transition-all duration-300">
                <img src="/youtube.png" alt="YouTube" className="h-4 w-4 invert opacity-60" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-widest text-white/60 mb-5">Navigate</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-slate-400 hover:text-brand-300 text-sm transition-colors duration-200">Home</Link></li>
              <li><Link to="/about" className="text-slate-400 hover:text-brand-300 text-sm transition-colors duration-200">About Us</Link></li>
              <li><Link to="/feedback" className="text-slate-400 hover:text-brand-300 text-sm transition-colors duration-200">Feedback</Link></li>
              <li><Link to="/myflts" className="text-slate-400 hover:text-brand-300 text-sm transition-colors duration-200">My Flights</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-widest text-white/60 mb-5">Services</h3>
            <ul className="space-y-3">
              <li><span className="text-slate-400 text-sm">Flight Booking</span></li>
              <li><span className="text-slate-400 text-sm">Flight Status</span></li>
              <li><span className="text-slate-400 text-sm">Seat Selection</span></li>
              <li><span className="text-slate-400 text-sm">E-Tickets</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-widest text-white/60 mb-5">Contact</h3>
            <ul className="space-y-3">
              <li className="text-slate-400 text-sm flex items-center gap-2">
                <svg className="h-4 w-4 text-brand-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                flyhigh@gmail.com
              </li>
              <li className="text-slate-400 text-sm flex items-center gap-2">
                <svg className="h-4 w-4 text-brand-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +91 1800-123-4567
              </li>
              <li className="text-slate-400 text-sm flex items-start gap-2">
                <svg className="h-4 w-4 text-brand-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                New Delhi, India
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-white/[0.06] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">&copy; {new Date().getFullYear()} Flyhigh Airlines. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">Privacy Policy</a>
            <a href="#" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">Terms of Service</a>
            <a href="#" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>

      {/* Decorative blur */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />
    </footer>
  )
}

export default Footer
