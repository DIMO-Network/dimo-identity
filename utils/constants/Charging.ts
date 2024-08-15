import { ethers } from 'hardhat';

export const MOCK_OPERATION_COST = ethers.parseEther('1');
export const MINT_VEHICLE_OPERATION_COST = ethers.parseEther('1');
export const MINT_AD_OPERATION_COST = ethers.parseEther('1');

export const MOCK_OPERATION = ethers.keccak256(
  ethers.toUtf8Bytes('MOCK_OPERATION')
);

export const MINT_VEHICLE_OPERATION = ethers.keccak256(
  ethers.toUtf8Bytes('MINT_VEHICLE_OPERATION')
);
export const MINT_AD_OPERATION = ethers.keccak256(
  ethers.toUtf8Bytes('MINT_AD_OPERATION')
);