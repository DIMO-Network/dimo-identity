import { ethers } from 'hardhat';

export const DIMO_STREAM_ENS = 'streams.dimo.eth';
export const MOCK_STREAM_PATH = '/mockStreamPath';
export const DIMO_STREAMR_NODE = '0x3F3ab5A20F704D6e7299EdEE84200fDA5d849BE7';

export const TRUSTED_ROLE = ethers.keccak256(
  ethers.toUtf8Bytes('TRUSTED_ROLE')
);

export const StreamrPermissionType = {
  'Edit': 0,
  'Delete': 1,
  'Publish': 2,
  'Subscribe': 3,
  'Grant': 4
}