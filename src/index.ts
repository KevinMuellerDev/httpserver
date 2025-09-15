import express, { NextFunction, Request, Response } from "express";
import { config } from "./config.js";

type Middleware = (req: Request, res: Response, next: NextFunction) => void;

const app = express();
const PORT = 8080;


const middlewareLogResponses: Middleware = (req, res, next) => {
    res.on('finish', () => {
        const statusCode = res.statusCode;
        if (statusCode !== 200)
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${statusCode}`);
    });
    next();
};

const middlewareMetricsInc: Middleware = (req, res, next) => {
    config.fileserverHits++
    next();
}


const handlerReadiness = (req: Request, res: Response, next: NextFunction): void => {
    res.set({
        'Content-Type': 'text/plain'
    });
    res.send('OK');
    next();
}

const handlerMetrics = (req: Request, res: Response, next: NextFunction): void => {
    res.set({
        'Content-Type': 'text/plain'
    });
    res.send(`Hits: ${config.fileserverHits}`);
    next();
}

const handlerReset = (req: Request, res: Response, next: NextFunction): void => {
    config.fileserverHits = 0;
    res.set({
        'Content-Type': 'text/plain'
    });
    res.send('OK')
    next();
}

app.use(middlewareLogResponses);
app.use('/app', middlewareMetricsInc, express.static('./src/app'));


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

app.get('/healthz', handlerReadiness);
app.get('/metrics', handlerMetrics);
app.get('/reset', handlerReset);



