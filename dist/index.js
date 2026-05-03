import express from "express";
import { handlerReadiness, handlerMetrics, handlerValidate, handlerReset, middlewareLogResponses, middlewareMetricsInc, } from "./api/handlers.js";
const app = express();
const PORT = 8080;
app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.get("/admin/metrics", handlerMetrics);
app.get("/api/healthz", handlerReadiness);
app.post("/admin/reset", handlerReset);
app.post("/api/validate_chirp", handlerValidate);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
