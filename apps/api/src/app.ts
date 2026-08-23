import express from "express";
import cors from "cors";
import helmet from "helmet";

import merchantRoutes from "./routes/merchant.routes.js";
import productRoutes from "./routes/product.routes.js";
import catalogRoutes from "./routes/catalog.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import orderRoutes from "./routes/order.routes.js";
import agentActionRoutes from "./routes/agent-action.routes.js";
import agentRoutes from "./routes/agent.routes.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001"
    ],
    credentials: true
  })
);

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    success: true,
    service: "raze-api",
    status: "healthy"
  });
});

app.use("/api/merchants", merchantRoutes);
app.use("/api/merchants", productRoutes);
app.use("/api/catalog", catalogRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/orders", orderRoutes);
app.use(
  "/api/agent-actions",
  agentActionRoutes
);
app.use(
 "/api/agent",
 agentRoutes
);

export default app;