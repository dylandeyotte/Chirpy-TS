import { NextFunction, Request, Response } from "express";
import { config } from "../config.js";
import { respondWithJSON, respondWithError } from "./json.js";

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

export async function handlerValidate(req: Request, res: Response) {
  type parameters = {
    body: string;
  };

  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  let params: parameters;
  req.on("end", () => {
    try {
      params = JSON.parse(body);
    } catch (err) {
      respondWithError(res, 400, "Something went wrong");
      return;
    }
    if (params.body.length > 140) {
      respondWithError(res, 400, "Chirp is too long");
      return;
    }
    respondWithJSON(res, 200, {
      valid: true,
    });
  });
}

export async function handlerMetrics(req: Request, res: Response) {
  res.set("Content-Type", "text/html");
  res.send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.fileserverHits} times!</p>
  </body>
</html>`);
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
