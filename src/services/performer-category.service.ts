import { APIRequest } from './api-request';

export class PerformerCategoryService extends APIRequest {
  search(query?: Record<string, any>) {
    return this.get(
      this.buildUrl('/performer-categories', query)
    );
  }
}

export const performerCategoryService = new PerformerCategoryService();
