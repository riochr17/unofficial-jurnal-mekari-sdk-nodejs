/**
 * HMAC-SHA256 Authentication for Mekari Jurnal API
 *
 * The API requires HMAC signature in the Authorization header:
 *   Authorization: hmac username="CLIENT_ID", algorithm="hmac-sha256",
 *                  headers="date request-line", signature="SIGNATURE"
 *
 * The signature is computed over:
 *   date: <Date header value>
 *   request-line: <METHOD> <path> HTTP/1.1
 */

import crypto from 'crypto';

export interface HmacHeaders {
    Authorization: string;
    Date: string;
}

/**
 * Build HMAC-signed request headers for the Mekari Jurnal API.
 *
 * @param clientId     - Mekari Client ID
 * @param clientSecret - Mekari Client Secret
 * @param method       - HTTP method (GET, POST, PATCH, DELETE, etc.)
 * @param requestPath  - Full request path including query string, e.g. "/public/jurnal/api/v1/accounts?page=1"
 */
export function buildHmacHeaders(
    clientId: string,
    clientSecret: string,
    method: string,
    requestPath: string
): HmacHeaders {
    const date = new Date().toUTCString();
    const requestLine = `${method.toLowerCase()} ${requestPath} HTTP/1.1`;
    const signingString = `date: ${date}\n${requestLine}`;

    const signature = crypto
        .createHmac('sha256', clientSecret)
        .update(signingString)
        .digest('base64');

    const authorization =
        `hmac username="${clientId}", algorithm="hmac-sha256", ` +
        `headers="date request-line", signature="${signature}"`;

    return { Authorization: authorization, Date: date };
}
