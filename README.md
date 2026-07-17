# 📚 LMS – Library Management System

A full-stack **Library / Study Room Management System** built for small businesses (study libraries, reading rooms, co-working/seat-rental spaces) to manage seats, student subscriptions, attendance, payments, and reporting — all from one dashboard.

🔗 **Live Demo:** [lms-beige-five-33.vercel.app](https://lms-beige-five-33.vercel.app/)

---

## ✨ Features

### 👨‍💼 Admin
- **Dashboard & Analytics** – real-time overview of students, seats, revenue, and attendance trends (charts via Recharts)
- **Seat Management** – add, edit, and track seat availability and occupancy
- **Student Management** – add/edit students, view detailed profiles and history
- **Subscription & Plans** – create subscription plans and manage student subscriptions, with automatic expiry handling (cron jobs)
- **Payments** – track payments, pending fees, and generate PDF/Excel reports and receipts
- **Seat Requests** – approve/reject seat allotment requests from students
- **Attendance Reports** – GPS-verified attendance tracking and reporting
- **Library Settings** – configure library details, GPS geofence radius, etc.
- **Audit Logs** – track admin actions for accountability
- **Notifications** – real-time notifications via Socket.IO

### 🎓 Student
- **Self Dashboard** – view seat, subscription status, and notifications
- **GPS-based Attendance** – check in/out validated against the library's geolocation (Haversine distance check)
- **Attendance History** – calendar heatmap of attendance
- **Available Seats** – browse and request open seats
- **Payment Receipts** – view/download payment receipts (PDF)
- **Profile Management** – update profile photo (Cloudinary) and change password

### 🔐 Auth & Security
- JWT-based authentication with role-based access (Admin / Student)
- Protected & public route guards on the frontend
- Password hashing with bcrypt

### ⚡ Real-time
- Live updates (notifications, seat status, attendance) via **Socket.IO**

---

## 🛠️ Tech Stack

**Frontend**
- React 19 + Vite
- React Router DOM
- Tailwind CSS
- Recharts (analytics/charts)
- React Calendar Heatmap
- Axios
- Socket.IO Client
- React Hot Toast, React Icons, Lucide React

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- Socket.IO
- JWT (jsonwebtoken) + bcryptjs
- Cloudinary + Multer (image uploads)
- node-cron (scheduled jobs — subscription expiry, notification cleanup)
- PDFKit (PDF receipts/reports) + ExcelJS (Excel reports)
- QRCode (QR-based sessions)
- Nodemailer (email notifications)

---

## 📂 Project Structure

```
LMS/
├── backend/
│   ├── config/          # DB & Cloudinary configuration
│   ├── controllers/     # Route logic (auth, students, seats, payments, etc.)
│   ├── jobs/             # Cron jobs (subscription expiry, notification cleanup)
│   ├── middlewares/      # Auth, admin, and upload middlewares
│   ├── models/            # Mongoose schemas
│   ├── routes/            # Express route definitions
│   ├── socket/            # Socket.IO setup
│   ├── utils/              # Helpers (PDF/Excel generation, GPS validation, etc.)
│   └── server.js
│
└── fronend/
    ├── src/
    │   ├── components/    # Shared UI components (Navbar, Sidebar, etc.)
    │   ├── context/        # Auth context
    │   ├── hooks/           # Custom hooks
    │   ├── layouts/          # Admin & Student layouts
    │   ├── pages/
    │   │   ├── admin/        # Admin pages
    │   │   ├── auth/          # Login
    │   │   └── student/       # Student pages
    │   ├── services/          # API service calls
    │   ├── socket/             # Socket.IO client setup
    │   └── utils/               # Constants, date formatting
    └── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB database (local or Atlas)
- Cloudinary account (for image uploads)

### 1. Clone the repository
```bash
git clone https://github.com/souravkumar-cloud/LMS.git
cd LMS
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Run the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../fronend
npm install
```

Create a `.env` file inside `fronend/` (if required by your API service config) pointing to your backend URL, e.g.:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Run the frontend:
```bash
npm run dev
```

The app will be available at `http://localhost:5173` (default Vite port), with the backend running on `http://localhost:5000`.

---

## 📸 Screenshots

> _Add screenshots or a GIF walkthrough of the Admin Dashboard, Student Dashboard, and Attendance flow here._

---

## 🗺️ Roadmap / Ideas
- [ ] Multi-library / multi-branch support
- [ ] SMS notifications
- [ ] Automated fee reminders
- [ ] Mobile app version

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome. Feel free to check the [issues page](https://github.com/souravkumar-cloud/LMS/issues).

---

## 📄 License
This project is licensed under the ISC License.

---

## 👤 Author
**Sourav Kumar**
GitHub: [@souravkumar-cloud](https://github.com/souravkumar-cloud)
