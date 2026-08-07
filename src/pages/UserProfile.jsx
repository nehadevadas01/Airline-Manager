import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import NavbarM from '../components/NavbarM';
import Footer from '../components/Footer';

const UserProfile = ({ user, setUser }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state || {};

  const storedUserStr = sessionStorage.getItem('user');
  const storedUser = storedUserStr ? JSON.parse(storedUserStr) : null;
  const activeUser = data.userData || user || storedUser;

  const [userProfile, setUserProfile] = useState({
    title: '',
    firstName: '',
    lastName: '',
    email: '',
    birthday: '',
    gender: '',
    maritalStatus: '',
    address: '',
    mobileNumber: '',
  });

  const [profileImage, setProfileImage] = useState(null);
  const [completion, setCompletion] = useState(0);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingImage, setEditingImage] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!activeUser) {
      alert('Please log in to view your profile.');
      navigate('/login');
    }
  }, [activeUser, navigate]);

  // Load profile from activeUser prop/session and local storage image
  useEffect(() => {
    if (activeUser) {
      const initialProfile = {
        title: activeUser.title || '',
        firstName: activeUser.firstName || '',
        lastName: activeUser.lastName || '',
        email: activeUser.email || '',
        mobileNumber: activeUser.mobileNumber || '',
        birthday: activeUser.birthday || '',
        gender: activeUser.gender || '',
        maritalStatus: activeUser.maritalStatus || '',
        address: activeUser.address || '',
      };
      setUserProfile(initialProfile);
      calculateCompletion(initialProfile);

      const savedImage = localStorage.getItem(`profile_image_${activeUser.email}`);
      if (savedImage) {
        setProfileImage(savedImage);
      }
    }
  }, [activeUser]);

  // Fetch full details from database
  useEffect(() => {
    const fetchProfile = async () => {
      if (!activeUser || !activeUser.email) return;
      try {
        const response = await fetch('http://localhost:3001/api/users');
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const usersList = await response.json();
        const loggedInUser = usersList.find(profile => profile.email === activeUser.email);
        
        if (loggedInUser) {
          const updatedProfile = {
            title: loggedInUser.title || '',
            firstName: loggedInUser.firstName || '',
            lastName: loggedInUser.lastName || '',
            email: loggedInUser.email || '',
            mobileNumber: loggedInUser.mobileNumber || '',
            birthday: loggedInUser.birthday || '',
            gender: loggedInUser.gender || '',
            maritalStatus: loggedInUser.maritalStatus || '',
            address: loggedInUser.address || '',
          };
          setUserProfile(updatedProfile);
          calculateCompletion(updatedProfile);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    
    fetchProfile();
  }, [activeUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedProfile = {
      ...userProfile,
      [name]: value,
    };
    setUserProfile(updatedProfile);
    calculateCompletion(updatedProfile);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        if (userProfile.email) {
          localStorage.setItem(`profile_image_${userProfile.email}`, reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateCompletion = (profile) => {
    const fields = Object.values(profile);
    const completedFields = fields.filter((field) => field && field.trim() !== '');
    setCompletion(Math.round((completedFields.length / fields.length) * 100));
  };

  const toggleProfileEditing = () => {
    setEditingProfile(!editingProfile);
  };

  const toggleImageEditing = () => {
    setEditingImage(!editingImage);
  };

  const saveProfile = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userProfile.email,
          updatedProfile: { ...userProfile },
        }),
      });
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Network response was not ok: ${response.statusText}, ${errorMessage}`);
      }
      
      // Update session storage and app state
      const updatedSessionUser = {
        title: userProfile.title,
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        email: userProfile.email,
        mobileNumber: userProfile.mobileNumber,
        birthday: userProfile.birthday,
        gender: userProfile.gender,
        maritalStatus: userProfile.maritalStatus,
        address: userProfile.address,
      };
      
      sessionStorage.setItem('user', JSON.stringify(updatedSessionUser));
      if (setUser) {
        setUser(updatedSessionUser);
      }
      
      setEditingProfile(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert(`Error updating profile: ${error.message}`);
    }
  };

  const saveImage = () => {
    setEditingImage(false);
    alert('Image saved successfully!');
  };

  const renderInputField = (label, name, type = 'text') => {
    const isAddress = name === 'address';
    const wrapperClass = isAddress ? "md:col-span-2 mb-5" : "mb-5";
    
    if (type === 'select') {
      return (
        <div key={name} className={wrapperClass}>
          <label htmlFor={name} className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            {label}
          </label>
          <select
            id={name}
            name={name}
            value={userProfile[name]}
            onChange={handleChange}
            className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!editingProfile}
          >
            <option value="" className="bg-slate-900">{`Select ${label}`}</option>
            {name === 'title' && (
              <>
                <option value="Mr." className="bg-slate-900">Mr.</option>
                <option value="Ms." className="bg-slate-900">Ms.</option>
                <option value="Mrs." className="bg-slate-900">Mrs.</option>
                <option value="Dr." className="bg-slate-900">Dr.</option>
              </>
            )}
            {name === 'gender' && (
              <>
                <option value="male" className="bg-slate-900">Male</option>
                <option value="female" className="bg-slate-900">Female</option>
                <option value="other" className="bg-slate-900">Other</option>
              </>
            )}
            {name === 'maritalStatus' && (
              <>
                <option value="single" className="bg-slate-900">Single</option>
                <option value="married" className="bg-slate-900">Married</option>
              </>
            )}
          </select>
        </div>
      );
    } else {
      return (
        <div key={name} className={wrapperClass}>
          <label htmlFor={name} className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            {label}
          </label>
          <input
            type={type}
            id={name}
            name={name}
            value={userProfile[name]}
            onChange={handleChange}
            className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!editingProfile || name === 'email'}
            placeholder={`Enter your ${label.toLowerCase()}`}
          />
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white font-sans flex flex-col">
      <NavbarM user={activeUser} />

      <main className="flex-grow max-w-6xl w-full mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Profile Card & Sidebar Action Links */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            
            {/* Glass Card for Profile Image & Progress */}
            <div className="relative overflow-hidden rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-md p-8 shadow-2xl text-center">
              
              <div className="relative w-36 h-36 mx-auto rounded-full bg-slate-800/80 border-2 border-indigo-500/30 flex items-center justify-center overflow-hidden group shadow-lg">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-5xl">👤</span>
                )}
                
                {editingImage && (
                  <label
                    htmlFor="profileImageUpload"
                    className="absolute inset-0 bg-slate-950/60 flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-slate-950/80"
                  >
                    <span className="text-white text-sm font-semibold tracking-wide bg-indigo-600/80 px-3 py-1.5 rounded-full shadow">
                      Upload
                    </span>
                    <input
                      type="file"
                      id="profileImageUpload"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>

              <h2 className="mt-5 text-2xl font-bold tracking-tight text-white">
                {userProfile.firstName ? `${userProfile.title || ''} ${userProfile.firstName} ${userProfile.lastName || ''}` : 'Personal Profile'}
              </h2>
              <p className="text-slate-400 text-sm mt-1">{userProfile.email || 'flyhigh-member'}</p>

              {/* Progress Container */}
              <div className="mt-8 pt-6 border-t border-white/10 text-left">
                <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider mb-2">
                  <span className="text-slate-400">Profile Completion</span>
                  <span className="text-indigo-400">{completion}%</span>
                </div>
                <div className="bg-slate-950/50 h-3 rounded-full overflow-hidden border border-white/5 p-0.5">
                  <div
                    className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-2 rounded-full transition-all duration-700 ease-out shadow-glow"
                    style={{ width: `${completion}%` }}
                  ></div>
                </div>
              </div>

              {/* Edit Image Buttons */}
              <div className="mt-6 flex justify-center">
                {!editingImage ? (
                  <button
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 px-4 py-2 rounded-full transition-all border border-indigo-500/20"
                    onClick={toggleImageEditing}
                  >
                    ✏️ Change Avatar
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-full shadow transition-all"
                      onClick={saveImage}
                    >
                      Save Photo
                    </button>
                    <button
                      className="text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-full transition-all border border-white/5"
                      onClick={() => setEditingImage(false)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Links Card */}
            <div className="rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-md p-6 shadow-2xl">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4 px-2">Account Actions</h3>
              <div className="flex flex-col gap-2">
                <Link
                  to="/myflts"
                  state={{ email: userProfile.email }}
                  className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all font-medium text-slate-200 hover:text-white flex items-center gap-2"
                >
                  ✈️ My Flight Bookings
                </Link>
                <Link
                  to="/feedback"
                  className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all font-medium text-slate-200 hover:text-white flex items-center gap-2"
                >
                  💬 Submit Feedback Review
                </Link>
                <Link
                  to="/"
                  className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all font-medium text-slate-200 hover:text-white flex items-center gap-2"
                >
                  🏠 Back to Search Terminal
                </Link>
              </div>
            </div>

          </div>

          {/* Right Column: User Profile Fields Form */}
          <div className="w-full lg:w-2/3">
            <div className="rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-md p-8 shadow-2xl">
              
              {/* Form Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/10 mb-8">
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-white">Profile Settings</h1>
                  <p className="text-slate-400 text-sm mt-1">Manage your passenger information and flight preferences.</p>
                </div>
                
                <div className="flex items-center">
                  {!editingProfile ? (
                    <button
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 border border-indigo-500/30"
                      onClick={toggleProfileEditing}
                    >
                      <span>Edit Details</span> ✏️
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-600/20 transition-all"
                        onClick={saveProfile}
                      >
                        Save Settings
                      </button>
                      <button
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-5 py-2.5 rounded-xl transition-all border border-white/5"
                        onClick={() => {
                          setEditingProfile(false);
                          // Reset profile to activeUser state
                          setUserProfile({
                            title: activeUser.title || '',
                            firstName: activeUser.firstName || '',
                            lastName: activeUser.lastName || '',
                            email: activeUser.email || '',
                            mobileNumber: activeUser.mobileNumber || '',
                            birthday: activeUser.birthday || '',
                            gender: activeUser.gender || '',
                            maritalStatus: activeUser.maritalStatus || '',
                            address: activeUser.address || '',
                          });
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Grid */}
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                  {renderInputField("Prefix Title", "title", "select")}
                  {renderInputField("First Name", "firstName")}
                  {renderInputField("Last Name", "lastName")}
                  {renderInputField("Date of Birth", "birthday", "date")}
                  {renderInputField("Gender Identity", "gender", "select")}
                  {renderInputField("Marital Status", "maritalStatus", "select")}
                  {renderInputField("Registered Email Address (Locked)", "email", "email")}
                  {renderInputField("Mobile Number", "mobileNumber", "tel")}
                  {renderInputField("Permanent Residential Address", "address")}
                </div>
              </form>

            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserProfile;
