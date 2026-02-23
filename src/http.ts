/**
 * HTTP Client for Mekari Jurnal API
 *
 * Wraps Node.js native https module (no extra dependencies needed)
 * and handles HMAC auth, JSON serialization, and error handling.
 */

import https from 'https';
import http from 'http';
import { URL } from 'url';
import { buildHmacHeaders } from './auth';
import { JurnalClientConfig, ApiError } from './types/common';

interface RequestOptions {
    method: string;
    path: string;        // path + query string
    body?: object;
}

export class HttpClient {
    private readonly baseUrl: string;
    private readonly clientId: string;
    private readonly clientSecret: string;
    private readonly timeout: number;

    constructor(config: JurnalClientConfig) {
        this.baseUrl = (config.baseUrl ?? 'https://api.mekari.com').replace(/\/$/, '');
        this.clientId = config.clientId;
        this.clientSecret = config.clientSecret;
        this.timeout = config.timeout ?? 30_000;
    }

    /**
     * Perform a GET request.
     */
    async get<T>(path: string, query?: Record<string, string | number | boolean | undefined>): Promise<T> {
        const fullPath = this.buildPath(path, query);
        return this.request<T>({ method: 'GET', path: fullPath });
    }

    /**
     * Perform a POST request.
     */
    async post<T>(path: string, body?: object): Promise<T> {
        return this.request<T>({ method: 'POST', path, body });
    }

    /**
     * Perform a PATCH request.
     */
    async patch<T>(path: string, body?: object): Promise<T> {
        return this.request<T>({ method: 'PATCH', path, body });
    }

    /**
     * Perform a DELETE request.
     */
    async delete<T = void>(path: string): Promise<T> {
        return this.request<T>({ method: 'DELETE', path });
    }

    // ─── Internal ──────────────────────────────────────────────────────────────

    private buildPath(
        path: string,
        query?: Record<string, string | number | boolean | undefined>
    ): string {
        if (!query) return path;

        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(query)) {
            if (value !== undefined && value !== null) {
                params.set(key, String(value));
            }
        }

        const qs = params.toString();
        return qs ? `${path}?${qs}` : path;
    }

    private request<T>(options: RequestOptions): Promise<T> {
        return new Promise((resolve, reject) => {
            const url = new URL(this.baseUrl + options.path);
            const isHttps = url.protocol === 'https:';
            const transport = isHttps ? https : http;

            const bodyStr = options.body ? JSON.stringify(options.body) : undefined;
            const hmacHeaders = buildHmacHeaders(
                this.clientId,
                this.clientSecret,
                options.method,
                url.pathname + url.search
            );

            const reqOptions: https.RequestOptions = {
                hostname: url.hostname,
                port: url.port || (isHttps ? 443 : 80),
                path: url.pathname + url.search,
                method: options.method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...hmacHeaders,
                    ...(bodyStr ? { 'Content-Length': Buffer.byteLength(bodyStr) } : {}),
                },
            };

            const req = transport.request(reqOptions, (res) => {
                const chunks: Buffer[] = [];

                res.on('data', (chunk: Buffer) => chunks.push(chunk));
                res.on('end', () => {
                    const rawBody = Buffer.concat(chunks).toString('utf8');

                    // 204 No Content — return void
                    if (res.statusCode === 204) {
                        resolve(undefined as unknown as T);
                        return;
                    }

                    let parsed: unknown;
                    try {
                        parsed = rawBody ? JSON.parse(rawBody) : {};
                    } catch {
                        reject(new JurnalApiError(res.statusCode ?? 0, `Invalid JSON response: ${rawBody}`));
                        return;
                    }

                    if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(parsed as T);
                    } else {
                        const errBody = parsed as Record<string, unknown>;
                        reject(
                            new JurnalApiError(
                                res.statusCode ?? 0,
                                (errBody['message'] as string) ?? `HTTP ${res.statusCode}`,
                                errBody as Record<string, string[]>
                            )
                        );
                    }
                });
            });

            req.setTimeout(this.timeout, () => {
                req.destroy();
                reject(new JurnalApiError(408, 'Request timed out'));
            });

            req.on('error', (err) => reject(err));

            if (bodyStr) req.write(bodyStr);
            req.end();
        });
    }
}

/**
 * Custom error class for Jurnal API errors.
 */
export class JurnalApiError extends Error implements ApiError {
    constructor(
        public readonly statusCode: number,
        message: string,
        public readonly errors?: Record<string, string[]>
    ) {
        super(message);
        this.name = 'JurnalApiError';
        Object.setPrototypeOf(this, JurnalApiError.prototype);
    }
}
