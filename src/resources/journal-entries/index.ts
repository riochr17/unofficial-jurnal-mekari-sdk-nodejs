/**
 * JournalEntriesResource
 *
 * Wraps all JOURNAL ENTRIES endpoints from the Jurnal Mekari API:
 *
 *   GET    /public/jurnal/api/v1/journal_entries              → list()
 *   POST   /public/jurnal/api/v1/journal_entries              → create()
 *   GET    /public/jurnal/api/v1/journal_entries/:id          → get()
 *   PATCH  /public/jurnal/api/v1/journal_entries/:id          → update()
 *   DELETE /public/jurnal/api/v1/journal_entries/:id          → delete()
 *   POST   /public/jurnal/api/v1/journal_entries/batch_create → batchCreate()
 */

import { BaseResource } from '../base';
import {
    JournalEntry,
    JournalEntriesListResponse,
    JournalEntryResponse,
    JournalEntriesBatchResponse,
    ListJournalEntriesParams,
    CreateJournalEntryParams,
    UpdateJournalEntryParams,
    JournalEntryBatchItem,
} from './types';

const BASE = '/public/jurnal/api/v1/journal_entries';

export class JournalEntriesResource extends BaseResource {
    /**
     * Get a paginated list of journal entries.
     *
     * @example
     * const { journal_entries, total_count } = await client.journalEntries.list({
     *   page: 1,
     *   page_size: 20,
     *   start_date: '2024-01-01',
     *   end_date: '2024-12-31',
     * });
     */
    async list(params?: ListJournalEntriesParams): Promise<JournalEntriesListResponse> {
        return this.http.get<JournalEntriesListResponse>(
            BASE,
            params as Record<string, string | number | boolean | undefined>
        );
    }

    /**
     * Get a single journal entry by ID.
     *
     * @example
     * const { journal_entry } = await client.journalEntries.get(123);
     */
    async get(id: number): Promise<JournalEntryResponse> {
        return this.http.get<JournalEntryResponse>(`${BASE}/${id}`);
    }

    /**
     * Create a new journal entry.
     * Note: debits and credits in `transaction_account_lines_attributes` must balance.
     *
     * @example
     * const { journal_entry } = await client.journalEntries.create({
     *   transaction_date: '15-06-2024',
     *   transaction_no: 'JE001',
     *   memo: 'Opening entry',
     *   transaction_account_lines_attributes: [
     *     { account_name: 'Cash', debit: 50000 },
     *     { account_name: 'Bank Loans', credit: 50000 },
     *   ],
     *   tags: ['opening'],
     * });
     */
    async create(params: CreateJournalEntryParams): Promise<JournalEntryResponse> {
        return this.http.post<JournalEntryResponse>(BASE, { journal_entry: params });
    }

    /**
     * Update an existing journal entry by ID.
     * Supply the line `id` inside `transaction_account_lines_attributes` to update existing lines.
     *
     * @example
     * const { journal_entry } = await client.journalEntries.update(123, {
     *   memo: 'Updated memo',
     *   transaction_account_lines_attributes: [
     *     { id: 1, account_name: 'Cash', debit: 60000 },
     *     { account_name: 'Bank Loans', credit: 60000 },
     *   ],
     * });
     */
    async update(id: number, params: UpdateJournalEntryParams): Promise<JournalEntryResponse> {
        return this.http.patch<JournalEntryResponse>(`${BASE}/${id}`, { journal_entry: params });
    }

    /**
     * Delete a journal entry by ID.
     *
     * @example
     * await client.journalEntries.delete(123);
     */
    async delete(id: number): Promise<void> {
        return this.http.delete<void>(`${BASE}/${id}`);
    }

    /**
     * Create multiple journal entries in a single request.
     *
     * @example
     * const { journal_entries } = await client.journalEntries.batchCreate([
     *   {
     *     journal_entry: {
     *       transaction_date: '15-06-2024',
     *       transaction_no: 'JE089',
     *       memo: 'Entry one',
     *       transaction_account_lines_attributes: [
     *         { account_name: 'Cash', debit: 30000 },
     *         { account_name: 'Bank Loans', credit: 30000 },
     *       ],
     *     },
     *   },
     *   {
     *     journal_entry: {
     *       transaction_date: '15-06-2024',
     *       transaction_no: 'JE090',
     *       memo: 'Entry two',
     *       transaction_account_lines_attributes: [
     *         { account_name: 'Cash', debit: 20000 },
     *         { account_name: 'Bank Loans', credit: 20000 },
     *       ],
     *     },
     *   },
     * ]);
     */
    async batchCreate(entries: JournalEntryBatchItem[]): Promise<JournalEntriesBatchResponse> {
        return this.http.post<JournalEntriesBatchResponse>(`${BASE}/batch_create`, {
            journal_entries: entries,
        });
    }
}

// Re-export all types for convenient single-location imports
export type {
    JournalEntry,
    JournalEntriesListResponse,
    JournalEntryResponse,
    JournalEntriesBatchResponse,
    ListJournalEntriesParams,
    CreateJournalEntryParams,
    UpdateJournalEntryParams,
    JournalEntryBatchItem,
    JournalEntryAccountLine,
    JournalEntryAccountLineInput,
    JournalEntryTag,
    JournalEntryAttachment,
    JournalEntryTransactionStatus,
} from './types';
