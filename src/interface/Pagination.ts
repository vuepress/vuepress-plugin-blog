import { PaginationConfig } from './Options'

export interface InternalPagination {
  pid: string;
  id: string;
  layout?: string;
  meta?: Record<string, any>;
  options: PaginationConfig;
  getUrl: (index: number) => string;
  getTitle?: any;
}
