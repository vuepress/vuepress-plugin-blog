import { FrontmatterHandler } from '../util';
import { PaginationConfig } from './Options';
export interface FrontmatterClassificationPage {
    id: string;
    pagination: PaginationConfig;
    keys: string[];
    map: Record<string, any>;
    _handler: FrontmatterHandler;
}
