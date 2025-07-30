import { stringToUint256WithHash } from '../helpers';

export const STORAGE_NODE_LABEL_DEFAULT = 'StorageNodeLabelDefault'
export const STORAGE_NODE_LABEL_1 = 'StorageNodeLabel1'
export const STORAGE_NODE_LABEL_2 = 'StorageNodeLabel2'
export const STORAGE_NODE_ID_DEFAULT = stringToUint256WithHash(STORAGE_NODE_LABEL_DEFAULT)
export const STORAGE_NODE_ID_1 = stringToUint256WithHash(STORAGE_NODE_LABEL_1)
export const STORAGE_NODE_ID_2 = stringToUint256WithHash(STORAGE_NODE_LABEL_2)