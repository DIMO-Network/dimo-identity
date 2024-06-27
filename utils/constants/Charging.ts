import { ethers } from 'hardhat';

export const MOCK_OPERATION_COST = '1';
export const MINTING_OPERATION_COST = '1';

export const MOCK_OPERATION = ethers.keccak256(
    ethers.toUtf8Bytes('MOCK_OPERATION')
  );

export const MINTING_OPERATION = ethers.keccak256(
    ethers.toUtf8Bytes('MINTING_OPERATION')
  );