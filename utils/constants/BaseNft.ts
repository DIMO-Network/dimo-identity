import { ethers } from 'hardhat';

export const NFT_MINTER_ROLE = ethers.keccak256(
  ethers.toUtf8Bytes('MINTER_ROLE')
);
export const NFT_BURNER_ROLE = ethers.keccak256(
  ethers.toUtf8Bytes('BURNER_ROLE')
);
export const NFT_UPGRADER_ROLE = ethers.keccak256(
  ethers.toUtf8Bytes('UPGRADER_ROLE')
);
export const NFT_TRANSFERER_ROLE = ethers.keccak256(
  ethers.toUtf8Bytes('TRANSFERER_ROLE')
);
