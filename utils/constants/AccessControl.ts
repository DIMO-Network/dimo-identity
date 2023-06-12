import { ethers } from 'hardhat';

export const DEFAULT_ADMIN_ROLE =
  '0x0000000000000000000000000000000000000000000000000000000000000000';
export const ADMIN_ROLE = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes('ADMIN_ROLE')
);
export const MOCK_ROLE = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes('MOCK')
);
export const MINTER_ROLE = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes('Minter')
);
