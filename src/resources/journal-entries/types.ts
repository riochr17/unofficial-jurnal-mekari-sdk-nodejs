/**
 * Type definitions for the JOURNAL ENTRIES resource.
 * Mirrors the Jurnal Mekari Swagger v2.0 schema.
 */

import { PaginationParams } from '../../types/common';

// ─── Core Models ──────────────────────────────────────────────────────────────

export interface JournalEntryTransactionStatus {
    id: number;
    name: string;
    name_bahasa: string;
}

export interface JournalEntryAccountLineAccount {
    id: number;
    name: string;
    number: string;
}

/** A single debit/credit line within a journal entry */
export interface JournalEntryAccountLine {
    id: number;
    description: string | null;
    debit: number;
    credit: number;
    debit_currency_format: string;
    credit_currency_format: string;
    account: JournalEntryAccountLineAccount;
}

export interface JournalEntryTag {
    id: number;
    name: string;
}

export interface JournalEntryAttachment {
    id: number;
    filename: string;
    url: string;
}

/** Full journal entry object returned by most endpoints */
export interface JournalEntry {
    id: number;
    custom_id: string | null;
    transaction_no: string;
    memo: string | null;
    transaction_date: string;
    transaction_status: JournalEntryTransactionStatus;
    transaction_account_lines: JournalEntryAccountLine[];
    total_debit: number;
    total_credit: number;
    total_debit_currency_format: string;
    total_credit_currency_format: string;
    attachments: JournalEntryAttachment[];
    tags: JournalEntryTag[] | null;
    tags_string: string;
    locked: boolean;
    reconciled: boolean;
    created_at: string;
    updated_at: string;
    currency_code: string;
    currency_rate: number;
}

// ─── Request Params & Bodies ──────────────────────────────────────────────────

export interface ListJournalEntriesParams extends PaginationParams {
    sort_key?: string;
    sort_order?: 'asc' | 'desc';
    start_date?: string;
    end_date?: string;
    /** Filter by transaction number */
    transaction_no?: string;
}

/** A single account line when creating/updating a journal entry */
export interface JournalEntryAccountLineInput {
    /** Required on update to identify the line to edit */
    id?: number;
    /** Account name or number */
    account_name?: string;
    account_id?: number;
    description?: string;
    debit?: number;
    credit?: number;
}

export interface CreateJournalEntryParams {
    /** Date format accepted by API: DD-MM-YYYY or YYYY-MM-DD */
    transaction_date: string;
    transaction_no?: string;
    memo?: string;
    custom_id?: string;
    transaction_account_lines_attributes: JournalEntryAccountLineInput[];
    /** Tag names to attach */
    tags?: string[];
    /** Attachment IDs to include */
    included_attachment_ids?: number[];
}

export interface UpdateJournalEntryParams {
    transaction_date?: string;
    transaction_no?: string;
    memo?: string;
    custom_id?: string;
    transaction_account_lines_attributes?: JournalEntryAccountLineInput[];
    /** Use tag_name (array) when updating */
    tag_name?: string[];
    included_attachment_ids?: number[];
}

/** Wrapper used in batch_create body */
export interface JournalEntryBatchItem {
    journal_entry: CreateJournalEntryParams;
}

// ─── API Response Wrappers ────────────────────────────────────────────────────

export interface JournalEntriesListResponse {
    journal_entries: JournalEntry[];
    total_count: number;
    current_page: number;
    total_pages: number;
}

export interface JournalEntryResponse {
    journal_entry: JournalEntry;
}

export interface JournalEntriesBatchResponse {
    journal_entries: JournalEntry[];
}
