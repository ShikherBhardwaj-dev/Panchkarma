// Load environment variables from .env when present (development)
import 'dotenv/config';
import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';

const app = express();

// ---------------- Connect Database ----------------
connectDB();

// ---------------- Middleware ----------------
app.use(express.json());
app.use(cors());

// Debug middleware
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path}`, {
    token: req.header('x-auth-token'),
    body: req.body
  });
  next();
});

// ---------------- Routes ----------------
// Import all route modules
import authRoutes from './routes/auth.js';
import therapyRoutes from './routes/therapy.js';
import sessionsRoutes from './routes/sessions.js';
import dashboardRoutes from './routes/dashboard.js';
import chatRoutes from './routes/chatRoutes.js';
import practitionerRoutes from './routes/practitioner.js';
import messageRoutes from './routes/messages.js';
import notificationRoutes from './routes/notifications.js';
import adminNotificationRoutes from './routes/adminNotifications.js';
import debugRoutes from './routes/debugRoutes.js';

// Apply routes
app.use("/api/auth", authRoutes);
app.use("/api/therapy", therapyRoutes);
app.use("/api/sessions", sessionsRoutes);
app.use("/api/dashboard", dashboardRoutes); // ✅ Patient & Practitioner dashboards
app.use("/api/chat", chatRoutes); // ✅ AI Chatbot route
app.use("/api/practitioner", practitionerRoutes); // ✅ Practitioner patient management
// New messaging and notification routes
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
// Admin / debug endpoints (test WhatsApp send, list recent notifications)
app.use('/admin', adminNotificationRoutes);

// Debug routes (temporary, for auth debugging)
app.use('/debug', debugRoutes);

// Start notification worker (sends email/SMS/in-app reminders)
import startNotificationWorker from './workers/notificationWorker.js';
startNotificationWorker();

// ---------------- Server ----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));


