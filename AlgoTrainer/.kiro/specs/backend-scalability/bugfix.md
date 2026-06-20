# Bugfix Requirements Document

## Introduction

The AlgoTrainer backend (`server.js`) is a single-file Express + Supabase server that currently works but is not production-ready. All application logic lives in one monolithic file, CORS is open to any origin, there is no rate limiting, no input validation layer, no structured error handling, no request logging, and no graceful shutdown. These gaps create real risk: the server is vulnerable to abuse (no rate limiting), susceptible to unexpected crashes from unhandled errors (no error boundary), leaks implementation details in error responses, and is difficult to extend or maintain as the app grows. This spec treats each structural gap as a defect to be corrected systematically.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN any client sends more than one request per second to any endpoint THEN the server processes all requests without restriction, allowing unlimited traffic from a single source.

1.2 WHEN a POST `/api/progress` request arrives with a `progress` object containing a `topic_id` value that is not a non-empty string THEN the server accepts and attempts to write the invalid value to the database without rejecting it at the application layer.

1.3 WHEN an unhandled error is thrown anywhere in the request lifecycle THEN the server either crashes or returns an unformatted, inconsistent error response with no standard shape.

1.4 WHEN any request is processed THEN the server does not emit a structured log entry, making it impossible to trace requests or diagnose latency in production.

1.5 WHEN a client from any origin sends a request THEN the server responds with permissive CORS headers (`Access-Control-Allow-Origin: *`), accepting requests from any domain.

1.6 WHEN GET `/api/progress` is called repeatedly by the same authenticated user within a short window THEN the server queries the Supabase database on every call with no in-process cache, adding unnecessary latency and database load.

1.7 WHEN the process receives a SIGTERM or SIGINT signal THEN the server terminates immediately without draining in-flight requests or closing the database connection gracefully.

1.8 WHEN all routes and middleware live in `server.js` THEN adding a new endpoint or changing behaviour requires editing the single shared file, increasing the risk of accidental regressions.

### Expected Behavior (Correct)

2.1 WHEN a single IP address exceeds a configurable request threshold (e.g., 100 requests per 15-minute window) THEN the server SHALL return HTTP 429 with a structured `{ error: "Too many requests" }` body and reject additional requests until the window resets.

2.2 WHEN a POST `/api/progress` request arrives with a `progress` value that fails schema validation (e.g., non-object, keys that are not non-empty strings, values that are not booleans) THEN the server SHALL return HTTP 400 with a structured `{ error: "<description>" }` body before any database operation is attempted.

2.3 WHEN any unhandled error propagates to the Express error handler THEN the server SHALL return a consistent `{ error: "Internal server error" }` JSON response with HTTP 500 and SHALL log the full error internally without exposing stack traces to the client.

2.4 WHEN any request completes THEN the server SHALL emit a structured log entry containing at minimum: HTTP method, path, status code, and response time in milliseconds.

2.5 WHEN a request arrives from an origin not present in the configured allowlist THEN the server SHALL reject the CORS preflight with the appropriate 4xx response and SHALL NOT include permissive CORS headers.

2.6 WHEN GET `/api/progress` is called for a user whose data was fetched within the last 30 seconds THEN the server SHALL return the cached result without querying the database again.

2.7 WHEN the process receives SIGTERM or SIGINT THEN the server SHALL stop accepting new connections, wait for in-flight requests to complete (up to a configurable timeout), and then exit cleanly.

2.8 WHEN route handlers and middleware are authored THEN they SHALL reside in their respective `routes/`, `controllers/`, and `middleware/` directories, with `server.js` acting only as the composition root.

### Unchanged Behavior (Regression Prevention)

3.1 WHEN an authenticated user calls GET `/api/progress` THEN the server SHALL CONTINUE TO return the same `{ progress: { [topicId]: true } }` shape it currently returns.

3.2 WHEN an authenticated user calls POST `/api/progress` with a valid `progress` object THEN the server SHALL CONTINUE TO upsert completed entries and delete entries marked `false` in Supabase, and return `{ success: true }`.

3.3 WHEN a request arrives without a `Bearer` token or with an expired/invalid token THEN the server SHALL CONTINUE TO return HTTP 401 with `{ error: "..." }` before reaching any route handler.

3.4 WHEN the server starts THEN it SHALL CONTINUE TO exit with a non-zero code if `SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY` are missing from the environment.

3.5 WHEN a client calls GET `/health` THEN the server SHALL CONTINUE TO return HTTP 200 with `{ status: "ok" }`.
