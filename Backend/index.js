import express from "express";
import bodyParser from "body-parser";
import passport from "./config/passportConfig.js";
import session from "express-session";
import cors from 'cors';
import env from "dotenv";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import appRoutes from "./routes/appRoutes.js";

// Import Passport Configuration
// Initialize express app
const app = express();
const port = 3000;

env.config();

app.use(cors({
  origin: 'http://localhost:5174', // React
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use(passport.initialize());
app.use(passport.session());

// Use routes
app.use("/auth", authRoutes);
app.use("/api", appRoutes);
// app.use("/api", authRoutes);


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
