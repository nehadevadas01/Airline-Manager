import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faSpinner } from '@fortawesome/free-solid-svg-icons';
import NavbarM from '../components/NavbarM';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const Feedback = ({ user }) => {
  const storedUserStr = sessionStorage.getItem('user');
  const storedUser = storedUserStr ? JSON.parse(storedUserStr) : null;
  const activeUser = user || storedUser;
  const activeEmail = activeUser ? activeUser.email : '';

  const [formData, setFormData] = useState({
    email: activeEmail,
    firstImpression: '',
    hearAbout: '',
    missingAnything: '',
    rating: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (!activeUser) {
      alert('Please log in to leave feedback.');
      navigate('/login');
    }
  }, [activeUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRatingChange = (rating) => {
    setFormData((prevData) => ({
      ...prevData,
      rating,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.rating === 0) {
      alert('Please rate your experience.');
      return;
    }
    setIsSubmitting(true);
    try {
      console.log('Submitting feedback:', formData);
      const response = await fetch('http://localhost:3001/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log('Feedback Submitted:', data);
      if (data.success) {
        setIsSubmitted(true);
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    } catch (error) {
      console.error('There was an error submitting the feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white font-sans flex flex-col">
      <NavbarM user={activeUser} />

      <main className="flex-grow flex items-center justify-center py-16 px-4 relative overflow-hidden">
        {/* Decorative blur orbs */}
        <div className="absolute top-1/4 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-indigo-500/10 rounded-full blur-[80px] md:blur-[120px] pointer-events-none -z-10 animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] md:w-[450px] h-[300px] md:h-[450px] bg-purple-500/10 rounded-full blur-[80px] md:blur-[100px] pointer-events-none -z-10 animate-float" style={{ animationDelay: '-3s' }} />

        {isSubmitted ? (
          <div className="w-full max-w-lg glass border border-white/10 p-8 md:p-12 rounded-3xl shadow-glow text-center animate-slide-up">
            <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-4xl text-emerald-400 mx-auto mb-6 shadow-glow-sm animate-pulse">
              ✓
            </div>
            <h2 className="text-3xl font-extrabold text-white mb-3">Thank You!</h2>
            <p className="text-slate-400 text-sm max-w-xs mx-auto mb-6">
              Your feedback has been successfully submitted. We appreciate your response to help us improve.
            </p>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-brand-500 rounded-full animate-[progress_3s_linear]" style={{ width: '100%' }}></div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-lg glass border border-white/10 p-8 md:p-10 rounded-3xl shadow-glow relative animate-slide-up">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-12 w-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shadow-glow-sm">
                <FontAwesomeIcon icon={faCommentDots} className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-white">Share Your Feedback</h1>
                <p className="text-slate-400 text-xs mt-0.5">Help us build a better flight booking experience.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="firstImpression" className="block text-sm font-semibold text-slate-300 mb-2">
                  What was your first impression when you entered the website?
                </label>
                <textarea
                  id="firstImpression"
                  name="firstImpression"
                  value={formData.firstImpression}
                  onChange={handleChange}
                  placeholder="Tell us what you liked or what stood out..."
                  rows="3"
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200 resize-none text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="hearAbout" className="block text-sm font-semibold text-slate-300 mb-2">
                  How did you first hear about us?
                </label>
                <div className="relative">
                  <select
                    id="hearAbout"
                    name="hearAbout"
                    value={formData.hearAbout}
                    onChange={handleChange}
                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200 text-sm form-select"
                    required
                  >
                    <option value="" disabled className="bg-slate-950 text-slate-500">Select an option</option>
                    <option value="social_media" className="bg-slate-950 text-white">Social Media</option>
                    <option value="search_engine" className="bg-slate-950 text-white">Search Engine</option>
                    <option value="friend" className="bg-slate-950 text-white">Friend</option>
                    <option value="advertisement" className="bg-slate-950 text-white">Advertisement</option>
                    <option value="other" className="bg-slate-950 text-white">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="missingAnything" className="block text-sm font-semibold text-slate-300 mb-2">
                  Is there anything missing on this page?
                </label>
                <textarea
                  id="missingAnything"
                  name="missingAnything"
                  value={formData.missingAnything}
                  onChange={handleChange}
                  placeholder="Features, options, or info you wanted to see..."
                  rows="3"
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200 resize-none text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Rate your overall experience:
                </label>
                <div className="flex space-x-3 mt-1 bg-slate-900/40 border border-white/5 p-4 rounded-xl items-center justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <label
                      key={star}
                      className="cursor-pointer transition-all duration-200 transform hover:scale-125"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      <input
                        type="radio"
                        name="rating"
                        value={star}
                        checked={formData.rating === star}
                        onChange={() => handleRatingChange(star)}
                        className="hidden"
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        className={`w-8 h-8 transition-colors duration-150 ${
                          (hoverRating || formData.rating) >= star
                            ? 'text-amber-400 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                            : 'text-slate-600 hover:text-slate-500'
                        }`}
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 .587l3.668 7.429 8.2 1.191-5.918 5.765 1.395 8.128L12 18.902l-7.345 3.863 1.395-8.128L.737 9.207l8.2-1.191L12 .587z" />
                      </svg>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 disabled:from-brand-800 disabled:to-indigo-800 text-white font-bold rounded-xl shadow-glow hover:shadow-glow-lg transition-all duration-300 flex items-center justify-center gap-2 transform active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin h-5 w-5" />
                    Submitting...
                  </>
                ) : (
                  'Submit Feedback'
                )}
              </button>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Feedback;
