const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const { clientUrl } = require("./config/env");

const authRoutes = require("./modules/auth/auth.routes");
const adminRoutes = require("./modules/admin/admin.routes");
const zoneRoutes = require("./modules/zones/zone.routes");
const areaRoutes = require("./modules/zones/area.routes");
const pricingRoutes = require("./modules/pricing/pricing.routes");
const orderRoutes = require("./modules/orders/order.routes");
const trackingRoutes = require("./modules/tracking/tracking.routes");
const agentRoutes = require("./modules/agents/agent.routes");
const assignmentRoutes = require("./modules/assignment/assignment.routes");







const app = express();

app.use(
    cors({
        origin: clientUrl,
        credentials: true,
    })
);

app.use(helmet());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "test") {
    app.use(morgan("dev"));
}

app.get("/api/v1/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Last-Mile Delivery Tracker API is running",
    });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/zones", zoneRoutes);
app.use("/api/v1/areas", areaRoutes);
app.use("/api/v1/pricing", pricingRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1", trackingRoutes);
app.use("/api/v1/agent", agentRoutes);
app.use("/api/v1/admin", assignmentRoutes);


module.exports = app;