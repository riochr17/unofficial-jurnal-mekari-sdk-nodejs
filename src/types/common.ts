/**
 * Common / shared types used across all SDK resources.
 */

// ─── SDK Config ───────────────────────────────────────────────────────────────

export interface JurnalClientConfig {
    /** Your Mekari Client ID */
    clientId: string;
    /** Your Mekari Client Secret */
    clientSecret: string;
    /** Override base URL (default: https://api.mekari.com) */
    baseUrl?: string;
    /** Request timeout in milliseconds (default: 30000) */
    timeout?: number;
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginationParams {
    /** Page number (1-indexed) */
    page?: number;
    /** Number of items per page */
    page_size?: number;
}

export interface PaginatedMeta {
    total_count: number;
    current_page: number;
    total_pages: number;
}

// ─── Error ────────────────────────────────────────────────────────────────────

export interface ApiError {
    statusCode: number;
    message: string;
    /** Field-level validation errors returned by the API */
    errors?: Record<string, string[]>;
}
