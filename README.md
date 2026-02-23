# Jurnal Mekari Node.js SDK

TypeScript/Node.js SDK for the [Jurnal Mekari API](https://developers.mekari.com).  
Uses **zero runtime dependencies** — only Node.js built-ins (`https`, `crypto`).

## Installation

```bash
npm install --save unofficial-jurnal-mekari-nodejs-sdk
```

## Project Structure

```
src/
  auth.ts                      ← HMAC-SHA256 signature builder
  http.ts                      ← HTTP client (native https, no deps)
  index.ts                     ← JurnalClient (main entry)
  types/
    common.ts                  ← Shared: config, pagination, error types
  resources/
    base.ts                    ← BaseResource (extended by each section)
    accounts/
      types.ts                 ← Account types
      index.ts                 ← AccountsResource (8 endpoints)
    journal-entries/
      types.ts                 ← Journal Entry types
      index.ts                 ← JournalEntriesResource (6 endpoints)
    vendor-credit-memo-refund/
      types.ts                 ← Vendor Credit Memo Refund types
      index.ts                 ← VendorCreditMemoRefundResource (4 endpoints)
```

> **Adding a new API section** (e.g. "invoices"):
> 1. Create `src/resources/invoices/types.ts`
> 2. Create `src/resources/invoices/index.ts` → `extends BaseResource`
> 3. In `src/index.ts`, add `this.invoices = new InvoicesResource(this._http);`

---

## Dev Installation

```bash
npm install     # Installation
npm run build   # Build project
```

---

## Authentication

The Jurnal API uses **HMAC-SHA256** signatures. Get your credentials from:  
https://developers.mekari.com/dashboard/applications

---

## Usage

```typescript
import { JurnalClient } from 'unofficial-jurnal-mekari-nodejs-sdk';

const client = new JurnalClient({
  clientId: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET',
  // baseUrl: 'https://api.mekari.com',  // optional
  // timeout: 30000,                      // optional, ms
});
```

---

## Accounts API

| Method | Endpoint | SDK call |
|---|---|---|
| GET | `/accounts` | `client.accounts.list(params?)` |
| POST | `/accounts` | `client.accounts.create(params)` |
| GET | `/accounts/:id` | `client.accounts.get(id)` |
| PATCH | `/accounts/:id` | `client.accounts.update(id, params)` |
| DELETE | `/accounts/:id` | `client.accounts.delete(id)` |
| GET | `/accounts/export` | `client.accounts.export()` |
| GET | `/accounts/:id/bank_statements` | `client.accounts.bankStatements(id, params?)` |
| GET | `/select2_resources/get_account` | `client.accounts.getResource(params?)` |

```typescript
// List
const { accounts, total_count } = await client.accounts.list({ page: 1, page_size: 20 });

// Get one
const { account } = await client.accounts.get(41483);

// Create
const { account } = await client.accounts.create({
  name: 'Cash',
  number: '1-1000',
  category_name: 'Cash & Bank',
});

// Update
await client.accounts.update(41483, { name: 'Cash (Updated)' });

// Delete
await client.accounts.delete(41483);

// Bank statements
const { bank_statements } = await client.accounts.bankStatements(41483, {
  start_date: '2024-01-01',
  end_date: '2024-12-31',
});

// Search (select2)
const { results } = await client.accounts.getResource({ q: 'cash' });
```

---

## Journal Entries API

| Method | Endpoint | SDK call |
|---|---|---|
| GET | `/journal_entries` | `client.journalEntries.list(params?)` |
| POST | `/journal_entries` | `client.journalEntries.create(params)` |
| GET | `/journal_entries/:id` | `client.journalEntries.get(id)` |
| PATCH | `/journal_entries/:id` | `client.journalEntries.update(id, params)` |
| DELETE | `/journal_entries/:id` | `client.journalEntries.delete(id)` |
| POST | `/journal_entries/batch_create` | `client.journalEntries.batchCreate(entries)` |

```typescript
// List
const { journal_entries, total_count } = await client.journalEntries.list({
  page: 1,
  start_date: '2024-01-01',
  end_date: '2024-12-31',
});

// Get one
const { journal_entry } = await client.journalEntries.get(123);

// Create (debits and credits must balance)
const { journal_entry } = await client.journalEntries.create({
  transaction_date: '15-06-2024',
  transaction_no: 'JE001',
  memo: 'Opening entry',
  transaction_account_lines_attributes: [
    { account_name: 'Cash', debit: 50000 },
    { account_name: 'Bank Loans', credit: 50000 },
  ],
  tags: ['opening'],
});

// Update (include line id to update existing lines)
await client.journalEntries.update(123, {
  memo: 'Updated memo',
  transaction_account_lines_attributes: [
    { id: 1, account_name: 'Cash', debit: 60000 },
    { account_name: 'Bank Loans', credit: 60000 },
  ],
});

// Delete
await client.journalEntries.delete(123);

// Batch create
const { journal_entries } = await client.journalEntries.batchCreate([
  {
    journal_entry: {
      transaction_date: '15-06-2024',
      transaction_no: 'JE089',
      memo: 'Entry one',
      transaction_account_lines_attributes: [
        { account_name: 'Cash', debit: 30000 },
        { account_name: 'Bank Loans', credit: 30000 },
      ],
    },
  },
]);
```

---

## Vendor Credit Memo Refund API

| Method | Endpoint | SDK call |
|---|---|---|
| POST | `/vendor_credit_memo_refund` | `client.vendorCreditMemoRefund.create(params)` |
| GET | `/vendor_credit_memo_refund/:id` | `client.vendorCreditMemoRefund.get(id)` |
| PATCH | `/vendor_credit_memo_refund/:id` | `client.vendorCreditMemoRefund.update(id, params)` |
| DELETE | `/vendor_credit_memo_refund/:id` | `client.vendorCreditMemoRefund.delete(id)` |

```typescript
// Get one
const { vendor_credit_memo_refund } = await client.vendorCreditMemoRefund.get(619);

// Create
const { vendor_credit_memo_refund } = await client.vendorCreditMemoRefund.create({
  person_id: 53,
  deposit_to_id: 14312,
  credit_memo_refund_lines_attributes: [
    { credit_memo_id: 736, refund_amount: 1, description: 'note' },
    { credit_memo_id: 737, refund_amount: 2 },
  ],
});

// Update (include line id to update existing lines)
await client.vendorCreditMemoRefund.update(921, {
  deposit_to_id: 14312,
  credit_memo_refund_lines_attributes: [
    { id: 109, credit_memo_id: 736, refund_amount: 5 },
    { id: 110, credit_memo_id: 737, refund_amount: 3 },
  ],
});

// Delete
await client.vendorCreditMemoRefund.delete(921);
```

---

## Error Handling

```typescript
import { JurnalApiError } from 'unofficial-jurnal-mekari-nodejs-sdk';

try {
  await client.journalEntries.get(99999);
} catch (err) {
  if (err instanceof JurnalApiError) {
    console.error(err.statusCode, err.message, err.errors);
  }
}
```

---
