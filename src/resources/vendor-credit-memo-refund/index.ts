/**
 * VendorCreditMemoRefundResource
 *
 * Wraps all VENDOR CREDIT MEMO REFUND endpoints from the Jurnal Mekari API:
 *
 *   POST   /public/jurnal/api/v1/vendor_credit_memo_refund        → create()
 *   GET    /public/jurnal/api/v1/vendor_credit_memo_refund/:id    → get()
 *   PATCH  /public/jurnal/api/v1/vendor_credit_memo_refund/:id    → update()
 *   DELETE /public/jurnal/api/v1/vendor_credit_memo_refund/:id    → delete()
 */

import { BaseResource } from '../base';
import {
    VendorCreditMemoRefund,
    VendorCreditMemoRefundResponse,
    CreateVendorCreditMemoRefundParams,
    UpdateVendorCreditMemoRefundParams,
} from './types';

const BASE = '/public/jurnal/api/v1/vendor_credit_memo_refund';

export class VendorCreditMemoRefundResource extends BaseResource {
    /**
     * Get a vendor credit memo refund by ID.
     *
     * @example
     * const { vendor_credit_memo_refund } = await client.vendorCreditMemoRefund.get(619);
     */
    async get(id: number): Promise<VendorCreditMemoRefundResponse> {
        return this.http.get<VendorCreditMemoRefundResponse>(`${BASE}/${id}`);
    }

    /**
     * Create a new vendor credit memo refund.
     *
     * @example
     * const { vendor_credit_memo_refund } = await client.vendorCreditMemoRefund.create({
     *   person_id: 53,
     *   deposit_to_id: 14312,
     *   credit_memo_refund_lines_attributes: [
     *     { credit_memo_id: 736, refund_amount: 1, description: 'note' },
     *     { credit_memo_id: 737, refund_amount: 2 },
     *   ],
     * });
     */
    async create(params: CreateVendorCreditMemoRefundParams): Promise<VendorCreditMemoRefundResponse> {
        return this.http.post<VendorCreditMemoRefundResponse>(BASE, {
            vendor_credit_memo_refund: params,
        });
    }

    /**
     * Update an existing vendor credit memo refund by ID.
     * Include line `id` inside `credit_memo_refund_lines_attributes` to update existing lines.
     *
     * @example
     * const { vendor_credit_memo_refund } = await client.vendorCreditMemoRefund.update(921, {
     *   deposit_to_id: 14312,
     *   credit_memo_refund_lines_attributes: [
     *     { id: 109, credit_memo_id: 736, refund_amount: 1, description: 'updated' },
     *     { id: 110, credit_memo_id: 737, refund_amount: 2 },
     *   ],
     * });
     */
    async update(
        id: number,
        params: UpdateVendorCreditMemoRefundParams
    ): Promise<VendorCreditMemoRefundResponse> {
        return this.http.patch<VendorCreditMemoRefundResponse>(`${BASE}/${id}`, {
            vendor_credit_memo_refund: params,
        });
    }

    /**
     * Delete a vendor credit memo refund by ID.
     *
     * @example
     * await client.vendorCreditMemoRefund.delete(921);
     */
    async delete(id: number): Promise<void> {
        return this.http.delete<void>(`${BASE}/${id}`);
    }
}

// Re-export types
export type {
    VendorCreditMemoRefund,
    VendorCreditMemoRefundLine,
    VendorCreditMemoRefundPerson,
    VendorCreditMemoRefundTransactionType,
    VendorCreditMemoRefundTransactionStatus,
    VendorCreditMemoRefundLineInput,
    VendorCreditMemoRefundResponse,
    CreateVendorCreditMemoRefundParams,
    UpdateVendorCreditMemoRefundParams,
} from './types';
