import { SacdInput } from '../types';

export const MOCK_SACD_PERMISSIONS = '816' // 11 00 11 00 00
export const MOCK_SACD_SOURCE = 'https://ipfs.io/ipfs/QmYA2fn8cMbVWo4v95RwcwJVyQsNtnEwHerfWR8UNtEwoE'

export const mockSacdInput: SacdInput = {
    grantee: '',
    permissions: MOCK_SACD_PERMISSIONS,
    expiration: '',
    source: MOCK_SACD_SOURCE
}
