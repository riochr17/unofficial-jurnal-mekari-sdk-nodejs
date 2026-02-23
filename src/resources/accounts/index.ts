/**
 * AccountsResource
 *
 * Wraps all ACCOUNTS endpoints from the Jurnal Mekari API:
 *
 *   GET    /public/jurnal/api/v1/accounts                          → list()
 *   POST   /public/jurnal/api/v1/accounts                          → create()
 *   GET    /public/jurnal/api/v1/accounts/:id                      → get()
 *   PATCH  /public/jurnal/api/v1/accounts/:id                      → update()
 *   DELETE /public/jurnal/api/v1/accounts/:id                      → delete()
 *   GET    /public/jurnal/api/v1/accounts/export                   → export()
 *   GET    /public/jurnal/api/v1/accounts/:id/bank_statements      → bankStatements()
 *   GET    /public/jurnal/api/v1/select2_resources/get_account     → getResource()
 */

import { BaseResource } from '../base';
import {
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
} from './types';

const BASE = '/public/jurnal/api/v1/accounts';
const RESOURCE_PATH = '/public/jurnal/api/v1/select2_resources/get_account';

export class AccountsResource extends BaseResource {
    /**
     * Get a paginated list of accounts.
     *
     * @example
     * const { accounts, total_count } = await client.accounts.list({ page: 1, page_size: 20 });
     */
    async list(params?: ListAccountsParams): Promise<AccountsListResponse> {
        return this.http.get<AccountsListResponse>(BASE, params as Record<string, string | number | boolean | undefined>);
    }

    /**
     * Get a single account by ID.
     *
     * @example
     * const { account } = await client.accounts.get(41483);
     */
    async get(id: number): Promise<AccountResponse> {
        return this.http.get<AccountResponse>(`${BASE}/${id}`);
    }

    /**
     * Create a new account.
     *
     * @example
     * const { account } = await client.accounts.create({
     *   name: 'Cash',
     *   number: '1-1000',
     *   category_name: 'Cash & Bank',
     * });
     */
    async create(params: CreateAccountParams): Promise<AccountResponse> {
        return this.http.post<AccountResponse>(BASE, { account: params });
    }

    /**
     * Update an existing account by ID.
     *
     * @example
     * const { account } = await client.accounts.update(41483, { name: 'Cash Updated' });
     */
    async update(id: number, params: UpdateAccountParams): Promise<AccountResponse> {
        return this.http.patch<AccountResponse>(`${BASE}/${id}`, { account: params });
    }

    /**
     * Delete an account by ID.
     *
     * @example
     * await client.accounts.delete(41483);
     */
    async delete(id: number): Promise<void> {
        return this.http.delete<void>(`${BASE}/${id}`);
    }

    /**
     * Export accounts list (returns raw CSV/spreadsheet data as a string).
     *
     * @example
     * const csv = await client.accounts.export();
     */
    async export(): Promise<string> {
        return this.http.get<string>(`${BASE}/export`);
    }

    /**
     * Get the transaction history of a bank account.
     *
     * @example
     * const { bank_statements } = await client.accounts.bankStatements(41483, {
     *   start_date: '2024-01-01',
     *   end_date: '2024-12-31',
     * });
     */
    async bankStatements(
        accountId: number,
        params?: ListBankStatementsParams
    ): Promise<BankStatementsResponse> {
        return this.http.get<BankStatementsResponse>(
            `${BASE}/${accountId}/bank_statements`,
            params as Record<string, string | number | boolean | undefined>
        );
    }

    /**
     * Search accounts for use in dropdowns / form selects (select2-style).
     *
     * @example
     * const { results } = await client.accounts.getResource({ q: 'cash' });
     */
    async getResource(params?: GetAccountResourceParams): Promise<AccountResourcesResponse> {
        return this.http.get<AccountResourcesResponse>(
            RESOURCE_PATH,
            params as Record<string, string | number | boolean | undefined>
        );
    }
}

// Re-export types so consumers can import from one place
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
};
