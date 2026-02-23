/**
 * Jurnal Mekari Node.js SDK
 *
 * Usage:
 *   import { JurnalClient } from 'jurnal-mekari-nodejs-sdk';
 *
 *   const client = new JurnalClient({
 *     clientId: 'YOUR_CLIENT_ID',
 *     clientSecret: 'YOUR_CLIENT_SECRET',
 *   });
 *
 *   // Accounts
 *   const { accounts } = await client.accounts.list({ page: 1 });
 *
 * Adding a new section later (e.g. "invoices"):
 *   1. Create src/types/invoices.ts
 *   2. Create src/resources/invoices/index.ts  (extends BaseResource)
 *   3. Import it here and add `this.invoices = new InvoicesResource(this._http);`
 */

import { HttpClient } from './http';
import { JurnalClientConfig } from './types/common';
import { AccountsResource } from './resources/accounts';
import { JournalEntriesResource } from './resources/journal-entries';

export class JurnalClient {
    /** Access all ACCOUNTS endpoints */
    public readonly accounts: AccountsResource;

    /** Access all JOURNAL ENTRIES endpoints */
    public readonly journalEntries: JournalEntriesResource;

    private readonly _http: HttpClient;

    constructor(config: JurnalClientConfig) {
        this._http = new HttpClient(config);

        // ── Register resources ──────────────────────────────────────────────────
        // Add new resource sections here as they are implemented.
        this.accounts = new AccountsResource(this._http);
        this.journalEntries = new JournalEntriesResource(this._http);
    }
}

// ─── Public API re-exports ────────────────────────────────────────────────────
// Consumers can import types directly from the SDK root.

export { JurnalApiError } from './http';
export type { JurnalClientConfig, PaginationParams, PaginatedMeta, ApiError } from './types/common';

// Accounts types
export type {
    Account,
    AccountListItem,
    AccountsListResponse,
    AccountResponse,
    BankStatementEntry,
    BankStatementsResponse,
    AccountResource,
    AccountResourcesResponse,
    ListAccountsParams,
    CreateAccountParams,
    UpdateAccountParams,
    ListBankStatementsParams,
    GetAccountResourceParams,
} from './resources/accounts';

// Journal Entries types
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
} from './resources/journal-entries';
