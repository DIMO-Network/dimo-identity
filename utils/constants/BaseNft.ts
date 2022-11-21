import { ethers } from 'hardhat';

export const NFT_MINTER_ROLE = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes('MINTER_ROLE')
);
export const NFT_BURNER_ROLE = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes('BURNER_ROLE')
);
export const NFT_TRANSFERER_ROLE = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes('TRANSFERER_ROLE')
);
