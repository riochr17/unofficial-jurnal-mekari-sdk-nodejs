/**
 * BaseResource
 *
 * All API resource classes extend this to get access to the shared HttpClient.
 * When adding a new section (e.g. invoices, contacts), simply extend this class.
 */

import { HttpClient } from '../http';

export abstract class BaseResource {
    constructor(protected readonly http: HttpClient) { }
}
