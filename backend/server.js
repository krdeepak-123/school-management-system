const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');   // ✅ ADD
const dns = require('node:dns'); // DNS bootstrap fallback (SRV hostnames only)

require('dotenv').config();

const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const studentRoutes = require('./routes/studentRoutes');
const classRoutes = require("./routes/classRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const feeRoutes = require("./routes/feeRoutes");
const resultRoutes = require("./routes/resultRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const timetableRoutes = require("./routes/timetableRoutes");
const examRoutes = require("./routes/examRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const studyMaterialRoutes = require("./routes/studyMaterialRoutes");
const leaveRoutes = require("./routes/leaveRoutes");

const User = require('./models/User');

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Uploads Folder Public
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/students', studentRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/materials", studyMaterialRoutes);
app.use("/api/leaves", leaveRoutes);

// ==========================================
// BOOTSTRAP: Create a default admin only if
// (a) configured via environment variables and
// (b) no admin account exists. Admin creation is
// otherwise protected (see /api/auth/register-admin).
// No credentials are hard-coded.
// ==========================================
async function seedDefaultAdmin() {
  const email = process.env.DEFAULT_ADMIN_EMAIL;
  const password = process.env.DEFAULT_ADMIN_PASSWORD;

  if (!email || !password) {
    console.log('Default admin not configured (set DEFAULT_ADMIN_EMAIL / DEFAULT_ADMIN_PASSWORD).');
    return;
  }

  const existingAdmin = await User.findOne({ role: 'admin' });
  if (!existingAdmin) {
    await User.create({
      userId: process.env.DEFAULT_ADMIN_USER_ID || 'ADM-001',
      name: process.env.DEFAULT_ADMIN_NAME || 'System Admin',
      email: email.toLowerCase().trim(),
      password,
      mobile: process.env.DEFAULT_ADMIN_MOBILE || '0000000000',
      role: 'admin',
    });
    console.log(`Default admin created → email: ${email.toLowerCase().trim()}`);
  }
}

// ==========================================
// DNS BOOTSTRAP (safe, diagnostic only)
// ------------------------------------------------------------
// Mongo Atlas SRV lookups are sometimes blocked by a local
// resolver / VPN / proxy even though `nslookup ... 8.8.8.8`
// works. This grabs the SRV hostname from MONGO_URI (host
// only — never the user/password), resolves _mongodb._tcp,
// and if the default resolver refuses, verifies the lookup through
// public resolvers with a scoped dns.Resolver. If the public resolvers
// answer and the process-wide default resolver is broken (observed as
// `querySrv ECONNREFUSED _mongodb._tcp.<cluster>.mongodb.net`), the
// default resolver is pointed at the public resolvers so the SRV lookup
// performed by mongoose.connect() actually succeeds. Only hostnames are
// printed. The default resolver is never mutated unless the fallback
// resolvers have just proven they can answer.
// ==========================================
const { Resolver, resolveSrv } = require('node:dns').promises;

function extractSrvHost(uri = '') {
  const rest = uri.replace(/^mongodb(?:\+srv)?:\/\//, '');
  const hostPart = rest.split('/')[0];
  const host = hostPart.includes('@') ? hostPart.split('@').pop() : hostPart;
  return host.split(':')[0]; // hostname only, no credentials
}

async function bootstrapDns() {
  const host = extractSrvHost(process.env.MONGO_URI);
  if (!host || !host.endsWith('.mongodb.net')) {
    console.log('DNS bootstrap: no Atlas SRV host to probe (hostname only, no secrets revealed).');
    return;
  }
  const srvName = `_mongodb._tcp.${host}`;
  const attempt = async () => (await resolveSrv(srvName)).map((r) => r.name);

  try {
    const hosts = await attempt();
    console.log(`DNS bootstrap ✔ resolveSrv(${srvName}) → ${hosts.join(', ')}`);
  } catch (err) {
    console.log(`DNS bootstrap: default resolver failed (${err.code || err.message}) — retrying via 8.8.8.8 / 1.1.1.1`);
    try {
      const resolver = new Resolver();
      resolver.setServers(['8.8.8.8', '1.1.1.1']);
      const hosts = (await resolver.resolveSrv(srvName)).map((r) => r.name);
      console.log(`DNS bootstrap ✔ resolveSrv via public resolvers → ${hosts.join(', ')}`);
      dns.setServers(['8.8.8.8', '1.1.1.1']);
      console.log('DNS bootstrap: default resolver updated to public resolvers (it was broken for SRV).');
    } catch (err2) {
      console.log(`DNS bootstrap: STILL failing via public resolvers (${err2.code || err2.message}). SRV lookup cannot complete; MongoDB connect may fail.`);
    }
  }
}

// ==========================================
// /api/health — server liveness, independent of
// MongoDB. Express always listens even if MongoDB
// is temporarily unreachable, so the app (and the
// frontend's health check) stays up.
// ==========================================
app.get('/api/health', (req, res) => {
  const mongoUp = mongoose.connection.readyState === 1;
  res.status(mongoUp ? 200 : 200).json({
    success: true,
    message: 'School Management API is running',
    mongodb: mongoUp ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// MongoDB Connection.
// The server only starts listening AFTER the initial connection is
// confirmed, so requests are never served against a dead database (the
// previous fire-and-forget connect left every `User.findOne()` buffered
// until it died with "buffering timed out after 10000ms"). Connect is
// retried with backoff; after a successful connect the driver
// auto-reconnects on later drops, and connection events are logged so
// real MongoDB errors are never hidden.
const CONNECT_ATTEMPTS = 10;
const CONNECT_RETRY_DELAY_MS = 3000;

async function connectWithRetry() {
  for (let attempt = 1; attempt <= CONNECT_ATTEMPTS; attempt += 1) {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      return;
    } catch (err) {
      console.error(`MongoDB connection attempt ${attempt}/${CONNECT_ATTEMPTS} failed: ${err.code || err.message}`);
      if (attempt === CONNECT_ATTEMPTS) throw err;
      await new Promise((resolve) => setTimeout(resolve, CONNECT_RETRY_DELAY_MS));
    }
  }
}

async function startServer() {
  try {
    await bootstrapDns();
  } catch (err) {
    console.log(`DNS bootstrap error: ${err.message}`);
  }

  mongoose.connection.on('connected', () => console.log('MongoDB Connected'));
  mongoose.connection.on('disconnected', () =>
    console.error('MongoDB disconnected — driver is reconnecting; requests are buffered until then')
  );
  mongoose.connection.on('reconnected', () => console.log('MongoDB reconnected'));
  mongoose.connection.on('error', (err) => console.error('MongoDB connection error:', err.message));

  try {
    await connectWithRetry();
  } catch (err) {
    console.error('MongoDB connection failed after retries — exiting so the platform restarts cleanly. Error:', err.message);
    process.exit(1);
  }

  try {
    await seedDefaultAdmin();
  } catch (se) {
    console.error('Admin seed error:', se.message);
  }

  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
  });
}

startServer();