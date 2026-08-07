# ✈️ Flyhigh - Premium Airline Booking & Management System

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](#)
[![Package Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](#)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](#)
[![Database](https://img.shields.io/badge/database-MongoDB-emerald.svg)](#)
[![Payments](https://img.shields.io/badge/payments-Stripe-indigo.svg)](#)

A sleek, premium, full-stack airline reservation and operations management application designed for modern travelers and airline managers.

---

## 📽️ Visual Preview
*(Placeholder: Add your demo video link or animation GIF here)*

---

## 📖 Project Description
Flyhigh is a state-of-the-art web application that solves the complexity of travel planning by offering users a seamless booking flow, secure profile management, real-time flight route search, and e-ticket generation. In addition to customer-facing services, Flyhigh features a robust Admin Portal that enables operators to coordinate seat configurations, add new routes, manage existing fleets, and oversee customer feedback.

---

## 🗺️ Table of Contents
- [✨ Core Features](#-core-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [💻 Technical Setup & Operation](#-technical-setup--operation)
  - [Prerequisites](#prerequisites)
  - [Installation Steps](#installation-steps)
  - [Configuration](#configuration)
  - [Seeding the Database](#seeding-the-database)
  - [Running the Application](#running-the-application)
- [🏢 Database Models & Architecture](#-database-models--architecture)
- [💳 Stripe Payment Integration](#-stripe-payment-integration)
- [🤝 Ecosystem & Governance](#-ecosystem--governance)
  - [Contributing Guidelines](#contributing-guidelines)
  - [Roadmap & Known Issues](#roadmap--known-issues)
  - [License](#license)
  - [Credits & Acknowledgments](#credits--acknowledgments)

---

## ✨ Core Features

### 👤 Customer Experience
* **Search & Book Flights**: Multi-city origin/destination search with seat class selection (Economy, Business, and First Class).
* **Smart Boarding Passes**: Automatic generation of individual, print-ready passenger E-Tickets with mock barcode stub graphics.
* **SSL Secured Checkout**: Integration with Stripe Checkout for processing secure online ticket payments.
* **Authentication**: Seamless user sign-in/up including Google OAuth support.
* **Real-time Flight Tracker**: Check active flight schedules and statuses by route and date.
* **Interactive Feedback**: Leave ratings and reviews about your flight experience.

### 🏢 Administrative Tools
* **Route Catalog Manager**: Add, modify, and delete flight routes.
* **Scheduler**: Allocate dates, pricing tiers, and cabin capacities for scheduled flights.
* **Passenger Manifests**: Fetch and review active passenger manifests for scheduled flights.

---

## 🛠️ Tech Stack
* **Frontend**: React (Vite), Tailwind CSS, React Router DOM, React-to-Print
* **Backend**: Node.js, Express.js
* **Database**: MongoDB (Native Driver)
* **Payments**: Stripe Node SDK

---

## 💻 Technical Setup & Operation

### Prerequisites
* **Node.js**: `v18.0.0` or higher
* **MongoDB Community Server**: `v6.0` or higher (running locally on port `27017`)
* **Package Manager**: `npm`

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/Airline-Manager.git
   cd Airline-Manager
   ```

2. **Install Frontend Dependencies:**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   cd ..
   ```

### Configuration

The backend looks for environment configuration inside the `backend/env.txt` file.

1. **Create or open the configuration file:**
   [backend/env.txt](file:///c:/Tech/Projects/Airline-Manager/backend/env.txt)

2. **Add the required environment configurations:**
   ```env
   MONGO_URI=mongodb://localhost:27017
   STRIPE_SECRET_KEY=your_stripe_test_secret_key_here
   ```

### Seeding the Database
To populate your database with the default airports and a combinatorial grid of 36 flight routes and 108 scheduled flights (today, tomorrow, day after) across `DEL`, `BOM`, `MAA`, and `CCU`:

```bash
cd backend
node seedFlights.js
cd ..
```

### Running the Application

To run the application locally, you will need to start both the backend and frontend servers in separate terminal windows.

#### 1. Start MongoDB (if not already running)
* **Windows PowerShell (Admin):**
  ```powershell
  Start-Service -Name "MongoDB"
  ```
* **Command Prompt (Admin):**
  ```cmd
  net start MongoDB
  ```

#### 2. Start the Backend Server
```bash
cd backend
node server.js
```
The backend server runs on `http://localhost:3001`.

#### 3. Start the Frontend Server
Open a new terminal tab at the root of the project:
```bash
npm run dev
```
The frontend application will boot at `http://localhost:5173`.

---

## 🏢 Database Models & Architecture

Your local MongoDB database contains the following collection configurations:

* **`Airports`**: List of serving airports (`DEL`, `BOM`, `MAA`, `CCU`) with names and locations.
* **`Flights`**: Catalog of active route routes including flight numbers and carrier names.
* **`Flight Info`**: Active departure tables, pricing plans, and seat counts per date.
* **`Bookings`**: Successfully compiled customer travel itineraries.
* **`Users`**: Standard profile registrations.
* **`Feedback`**: User ratings and responses.

---

## 💳 Stripe Payment Integration

Payment checkout is integrated directly into the purchase flow.
* When clicking **Proceed** on the Preview screen, the backend initiates a secure Checkout Session.
* If a valid Stripe Test key (`sk_test_...`) is provided in `env.txt`, you will be redirected to the secure `stripe.com` test checkout. Use Stripe's card number `4242 4242 4242 4242` to simulate successful payment.
* If no key is set, the system falls back to a sandbox booking mode for testing convenience.

---

## 🤝 Ecosystem & Governance

### Contributing Guidelines
Contributions are welcome! Please fork the repository and open a pull request with your changes. Ensure code is formatted correctly and any backend logic additions are properly structured.

### Roadmap & Known Issues
* [ ] Implement JWT-based user session authentication.
* [ ] Add dynamic seat-mapping grid overlays.
* [ ] Integrate automated email confirmations upon booking completions.
* **Known Issue**: In sandbox/offline mode, payment checks are bypassed immediately to allow UI testing.

### License
This project is licensed under the MIT License - see the `LICENSE` file for details.

### Credits & Acknowledgments
* **Stripe** for handling payment checkouts.
* **Vite** for the blistering fast development setup.
* Creative assets sourced from Unsplash and Flaticon.
