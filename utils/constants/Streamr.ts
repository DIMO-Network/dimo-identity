import { ethers } from 'hardhat';

export const DIMO_STREAMR_ENS = 'streams.dimo.eth';

export const TRUSTED_ROLE = ethers.keccak256(
    ethers.toUtf8Bytes('TRUSTED_ROLE')
  );