import express from "express";
import { handlerReadiness, handlerMetrics, handlerReset, middlewareLogResponses, middlewareMetricsInc } from "./api/handlers.js";
const app = express();
const PORT = 8080;
app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.get("/metrics", handlerMetrics);
app.get("/reset", handlerReset);
app.get("/healthz", handlerReadiness);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
