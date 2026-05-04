import { NextFunction, Request, Response } from "express";
import { config } from "../config.js";
import { respondWithJSON, respondWithError } from "./json.js";
import { BadRequest, Forbidden, Unauthorized, NotFound } from "./errors.js";

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.log(err.message);

  if (err instanceof BadRequest) {
    respondWithError(res, 400, err.message);
  } else if (err instanceof Unauthorized) {
    respondWithError(res, 401, err.message);
  } else if (err instanceof Forbidden) {
    respondWithError(res, 403, err.message);
  } else if (err instanceof NotFound) {
    respondWithError(res, 404, err.message);
  }

  respondWithError(res, 500, "something went wrong on our end");
}

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
  // Make parameters for request
  type parameters = {
    body: string;
  };

  // Parse request into params via express middleware
  const params: parameters = req.body;
  const body = params.body;

  // Check if length is too long
  if (params.body.length > 140) {
    throw new BadRequest("Chirp is too long. Max length is 140");
  }

  // Find bad words and censor them
  const splitWords = body.split(" ");

  for (let i = 0; i < splitWords.length; i++) {
    if (
      splitWords[i].toLowerCase() === "kerfuffle" ||
      splitWords[i].toLowerCase() === "sharbert" ||
      splitWords[i].toLowerCase() === "fornax"
    ) {
      // 1984
      splitWords[i] = "****";
    }
  }

  const newBody = splitWords.join(" ");

  // Respond with cleaned text
  respondWithJSON(res, 200, {
    cleanedBody: newBody,
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

export async function handlerReset(req: Request, res: Response) {
  res.send("Hits reset");
  config.fileserverHits = 0;
  res.end;
}

export async function handlerReadiness(req: Request, res: Response) {
  res.set("Content-Type", "text/plain");
  res.send("OK");
}
