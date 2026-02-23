/**
 * Type definitions for the ACCOUNTS resource.
 * Mirrors the Jurnal Mekari Swagger v2.0 schema.
 */

import { PaginationParams } from '../../types/common';

// ─── Core Models ──────────────────────────────────────────────────────────────

export interface AccountCategory {
    id: number;
    name: string;
}

export interface AccountCompany {
    id: number;
    name: string;
}

export interface AccountParent {
    id: number;
    name: string;
}

export interface AccountChild {
    id: number;
    name: string;
}

/** Full account object returned by GET /accounts/:id and POST /accounts */
export interface Account {
    id: number;
    name: string;
    description: string | null;
    number: string;
    company_id: number;
    custom_id: string | null;
    opening_balance: number | null;
    start_balance: number | null;
    company_tax_id: number | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    balance: string;
    balance_string: string;
    currency_code: string;
    category: AccountCategory;
    company: AccountCompany;
    children: AccountChild[];
    parent: AccountParent | AccountChild[] | null;
    transactions: object[];
}

/** Slimmer object used inside the list response */
export interface AccountListItem {
    id: number;
    name: string;
    number: string;
    description: string | null;
    custom_id: string | null;
    is_locked: boolean;
    indent: number;
    currency_code: string;
    /** Category name as a string in list context */
    category: string;
    category_id: number;
    balance: string;
    balance_amount: number;
    parent_id: number | null;
    parent: object[];
    children: object[] | null;
}

/** Entry returned by GET /accounts/:id/bank_statements */
export interface BankStatementEntry {
    id: number;
    transaction_no: string;
    transaction_date: string;
    description: string;
    amount: number;
    running_balance: number;
}

/** Item returned by GET /select2_resources/get_account */
export interface AccountResource {
    id: string;
    text: string;
}

// ─── Request Params ───────────────────────────────────────────────────────────

export interface ListAccountsParams extends PaginationParams {
    sort_key?: string;
    sort_order?: 'asc' | 'desc';
    type?: string;
    is_archived?: boolean;
}

export interface CreateAccountParams {
    /** Account name (required) */
    name: string;
    description?: string;
    /** Account number, e.g. "1-1000" */
    number?: string;
    /** Category name, e.g. "Cash & Bank" */
    category_name?: string;
    /** Set true to make this a child of parent_category_name */
    as_a_child?: boolean;
    parent_category_name?: string;
    /** Set true to make this a parent of children_names */
    as_a_parent?: boolean;
    company_tax_name?: string;
    children_names?: string[];
    custom_id?: string;
}

export type UpdateAccountParams = Partial<CreateAccountParams>;

export interface ListBankStatementsParams extends PaginationParams {
    start_date?: string;
    end_date?: string;
}

export interface GetAccountResourceParams {
    /** Search term */
    q?: string;
    page?: number;
}

// ─── API Response Wrappers ───────────────────────────────────────────────────

export interface AccountsListResponse {
    accounts: AccountListItem[];
    total_count: number;
    current_page: number;
    total_pages: number;
}

export interface AccountResponse {
    account: Account;
}

export interface BankStatementsResponse {
    bank_statements: BankStatementEntry[];
    total_count: number;
    current_page: number;
    total_pages: number;
}

export interface AccountResourcesResponse {
    results: AccountResource[];
    pagination?: {
        more: boolean;
    };
}
