import express from "express";
import { middlewareLogResponses, middlewareMetricsInc } from "./api/middleware.js";
import { handlerReset } from "./api/reset.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerReadiness } from "./api/readiness.js";
import { handlerValidateChirp } from "./api/validate_chirp.js";

console.log(typeof (handlerValidateChirp))

const app = express();
const PORT = 8080;

app.use(express.json())
app.use(middlewareLogResponses);
app.use('/app', middlewareMetricsInc, express.static('./src/app'));

app.get('/api/healthz', handlerReadiness);
app.post('/api/validate_chirp', handlerValidateChirp);
app.get('/admin/metrics', handlerMetrics);
app.post('/admin/reset', handlerReset);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});


