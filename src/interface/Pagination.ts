import { PaginationConfig } from './Options'

export interface InternalPagination {
  pid: string;
  id: string;
  options: PaginationConfig;
  getUrl: (index: number) => string;
  getTitle?: any;
}
