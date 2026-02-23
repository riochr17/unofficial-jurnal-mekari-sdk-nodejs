/**
 * Type definitions for the VENDOR CREDIT MEMO REFUND resource.
 * Mirrors the Jurnal Mekari Swagger v2.0 schema.
 */

// ─── Core Models ──────────────────────────────────────────────────────────────

export interface VendorCreditMemoRefundLine {
    id: number;
    credit_memo_id: number;
    description: string | null;
    refund_amount: string;
}

export interface VendorCreditMemoRefundTransactionType {
    id: number;
    name: string;
}

export interface VendorCreditMemoRefundTransactionStatus {
    id: number;
    name: string;
    name_bahasa: string;
}

export interface VendorCreditMemoRefundPerson {
    id: number;
    display_name: string;
    person_type: string;
}

export interface VendorCreditMemoRefund {
    id: number;
    transaction_no: string;
    token: string;
    email: string | null;
    address: string | null;
    memo: string | null;
    remaining: number;
    original_amount: string;
    created_at: string;
    updated_at: string;
    witholding_value: string;
    witholding_type: string;
    custom_id: string | null;
    tax_amount: string;
    deleted_at: string | null;
    credit_memo_refund_lines: VendorCreditMemoRefundLine[];
    deletable: boolean;
    editable: boolean;
    audited_by: string | null;
    transaction_date: string;
    due_date: string | null;
    balance_due: number;
    balance_due_currency_format: string;
    remaining_currency_format: string;
    subtotal: number;
    subtotal_currency_format: string;
    transaction_type: VendorCreditMemoRefundTransactionType;
    transaction_status: VendorCreditMemoRefundTransactionStatus;
    deposit_to_id: number;
    deposit_to_name: string;
    person: VendorCreditMemoRefundPerson;
    is_reconciled: boolean;
    attachments: object[];
    tags: string | null;
    tags_string: string;
    currency_code: string;
    currency_rate: number;
}

// ─── Request Bodies ───────────────────────────────────────────────────────────

export interface VendorCreditMemoRefundLineInput {
    /** Required when updating an existing line */
    id?: number;
    credit_memo_id: number;
    refund_amount: number;
    description?: string;
}

export interface CreateVendorCreditMemoRefundParams {
    person_id: number;
    deposit_to_id: number;
    credit_memo_refund_lines_attributes: VendorCreditMemoRefundLineInput[];
}

export interface UpdateVendorCreditMemoRefundParams {
    person_id?: number;
    deposit_to_id?: number;
    credit_memo_refund_lines_attributes?: VendorCreditMemoRefundLineInput[];
}

// ─── API Response Wrappers ────────────────────────────────────────────────────

export interface VendorCreditMemoRefundResponse {
    vendor_credit_memo_refund: VendorCreditMemoRefund;
}
