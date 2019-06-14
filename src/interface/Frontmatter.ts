import { FrontmatterHandler } from '../util'
import { PaginationConfig } from './Pagination'

export interface FrontmatterClassificationPage {
  id: string;
  pagination: PaginationConfig;
  keys: string[];
  map: Record<string, any>;
  _handler: FrontmatterHandler;
}
