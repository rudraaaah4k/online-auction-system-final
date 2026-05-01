import { config } from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

import { connection } from "./database/connection.js";
import { errorMiddleware } from "./middlewares/error.js";

import userRouter from "./router/userRoutes.js";
import auctionItemRouter from "./router/auctionItemRoutes.js";
import bidRouter from "./router/bidRoutes.js";
import commissionRouter from "./router/commissionRouter.js";
import superAdminRouter from "./router/superAdminRoutes.js";

import { endedAuctionCron } from "./automation/endedAuctionCron.js";
import { verifyCommissionCron } from "./automation/verifyCommissionCron.js";

const app = express();

// Load environment variables
config({
  path: "./config/config.env",
});

// Allowed origins
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:5174",
].filter(Boolean);

app.get("/", (req, res) => {
  res.send("Auction API is running 🚀");
});


// ✅ 1. HEALTHCHECK ROUTE (NO DB DEPENDENCY)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});


// ✅ 2. MIDDLEWARES
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: false,
  })
);


// ✅ 3. API ROUTES
app.use("/api/v1/user", userRouter);
app.use("/api/v1/auctionitem", auctionItemRouter);
app.use("/api/v1/bid", bidRouter);
app.use("/api/v1/commission", commissionRouter);
app.use("/api/v1/superadmin", superAdminRouter);


// ✅ 4. CRON JOBS (only run locally or server, not Vercel)
if (process.env.VERCEL !== "1") {
  endedAuctionCron();
  verifyCommissionCron();
}


// ✅ 5. DATABASE CONNECTION
connection();


// ✅ 6. ERROR HANDLER (after routes)
app.use(errorMiddleware);


// ✅ 7. 404 HANDLER (VERY LAST)
app.all("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Not Found - ${req.originalUrl}`,
  });
});


export default app;
