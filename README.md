# Disaster Management & Response Coordination Platform (SIH-2K26)

An advanced, real-time coordination dashboard built for Smart India Hackathon (SIH) 2026. This platform bridges first responders, disaster response teams (NDRF/SDRF), and coordination commanders through dynamic geospatial mapping, automated local telemetry, mobile communication channels, and secure administration consoles.

---

## 🌟 Key Features

### 📡 First Responder & User Portal
*   **Unified Command Dashboard:** Neumorphic real-time interface showing platform statuses, verify logs, and system metrics.
*   **Send Information Form:**
    *   **Auto-Detect Coordinates:** Integrates with the browser Geolocation API to auto-fill high-accuracy Latitude and Longitude.
    *   **Photograph Upload:** Encodes incident photos to Base64 directly in the browser for cloud-free database indexing.
    *   **Metadata Fields:** Capture submitter name, mobile contact, and specific notes.
*   **Real-time GIS Mapping:** Plot coordinates on a Leaflet-based interactive viewport centered specifically on critical areas, including the **NIT Rourkela** campus highlighted by a custom red dashed boundary.
*   **Alert Feed (Notifications):** Feed of incoming reports with contact links, metadata, and expandable image lightboxes.

### 🛡️ Administration Console
*   **Secure Administration:** Role-based access control (RBAC) powered by NextAuth. Admin users are redirected to a dedicated control dashboard.
*   **User Submissions Control Tab:**
    *   Inspect cards showing the user name, date, mobile number, coordinates, uploaded photograph, and notes.
    *   **Dismiss Alerts:** Safely archive/delete reports directly from the MongoDB collection.
    *   **Search Filters:** Quick search for reports by name or mobile number.
*   **Admin GIS Map View:** Renders the identical Leaflet tracking map centered on NIT Rourkela, complete with the custom dashed boundary and real-time database marker coordinates.

---

## 🛠️ Technology Stack

*   **Frontend Framework:** Next.js (App Router), React, TypeScript.
*   **Backend Server:** Node.js, Express.js.
*   **Database (Core Auth):** SQLite managed via Prisma ORM.
*   **Database (Incident Reports):** MongoDB Atlas connected via Mongoose.
*   **Geospatial Library:** Leaflet, React-Leaflet.
*   **Styling & Icons:** Tailwind CSS, Lucide React.
*   **Security & Authentication:** NextAuth.js.

---

## 📁 Repository Structure

```text
SIH-2K26/
├── client/                 # Next.js Frontend App
│   ├── app/                # Page routes (maps, notifications, send-info, etc.)
│   ├── components/         # Neumorphic components for User & Admin portals
│   ├── lib/                # Database clients, Twilio, and NextAuth options
│   ├── prisma/             # Schema definitions and SQLite dev.db
│   └── package.json
├── server/                 # Express.js Backend Server
│   ├── models/             # Mongoose schemas (Incident.js)
│   ├── index.js            # Express routing, CORS, and MongoDB connectivity
│   └── package.json
└── .env                    # Shared root environment variables file
```

---

## ⚙️ Environment Variables Config (.env)

The project leverages a single consolidated `.env` file at the root directory of the workspace. Ensure `.env` is created with the following schema:

```env
# Database & Server Ports
PORT=5000
DATABASE_URL="file:./dev.db"

# MongoDB Configuration
uid="your_mongodb_user"
pass="your_mongodb_password"
MONGO_URI="mongodb+srv://..."
mongo_url="mongodb+srv://..."

# NextAuth Settings
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_nextauth_secret_key"

# Admin Dashboard Auth Credentials
ADMIN_EMAIL="admin@disasterresponse.gov"
ADMIN_PASSWORD="your_secure_password"
admin_user="admin_phone_or_id"
admin_password="admin_numerical_password"

# Map Configuration
NEXT_PUBLIC_CARTO_API_KEY="your_carto_basemap_key"
```

---

## 🚀 Setup & Execution Guide

### 1. Prerequisite Installations
*   Ensure Node.js (v18+) is installed on your local system.
*   Ensure a local or cloud-based MongoDB database is active.

### 2. Install Dependencies
Run the install script in both directories:

**Express Server Setup:**
```bash
cd server
npm install
```

**Next.js Frontend Setup:**
```bash
cd client
npm install
```

### 3. Initialize SQLite Auth Database (Prisma)
From the `client` directory, synchronize the SQLite database schemas:
```bash
npx prisma db push
```

### 4. Running the Project locally
To launch the development servers, run the dev commands in separate terminal sessions:

**Start Express Server (Backend):**
```bash
cd server
npm run dev
```
*   Server spins up on `http://localhost:5000` and establishes the MongoDB database link.

**Start Next.js Client (Frontend):**
```bash
cd client
npm run dev
```
*   Client starts on `http://localhost:3000`.

Open `http://localhost:3000` in your browser to access the Coordination Platform!
