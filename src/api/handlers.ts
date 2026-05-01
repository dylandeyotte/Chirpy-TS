import { NextFunction, Request, Response } from "express";
import { config } from "../config.js";

export function middlewareLogResponses(req: Request, res: Response, next: NextFunction) {
  res.on("finish", () => {
    if (res.statusCode >= 300) {
      console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);
    }
  });
  next();
}

export function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
  config.fileserverHits++;
  next();
}

export async function handlerMetrics(req: Request, res: Response) {
  res.send(`Hits: ${config.fileserverHits}`);
}

export async function handlerReset(req: Request, res: Response, next: NextFunction) {
  res.send("Hits reset");
  config.fileserverHits = 0;
  next();
}

export async function handlerReadiness(req: Request, res: Response) {
  res.set("Content-Type", "text/plain");
  res.send("OK");
}
