import express from "express";
import { middlewareLogResponses, middlewareMetricsInc } from "./api/middleware.js";
import { handlerReset } from "./api/reset.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerReadiness } from "./api/readiness.js";

const app = express();
const PORT = 8080;


app.use(middlewareLogResponses);
app.use('/app', middlewareMetricsInc, express.static('./src/app'));


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

app.get('/api/healthz', handlerReadiness);
app.get('/admin/metrics', handlerMetrics);
app.post('/admin/reset', handlerReset);



