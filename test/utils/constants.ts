import { ethers } from 'hardhat';

// Node types
export const rootNodeType = ethers.utils.toUtf8Bytes('Root');
export const vehicleNodeType = ethers.utils.toUtf8Bytes('Vehicle');
export const rootNodeTypeId = ethers.utils.keccak256(rootNodeType);
export const vehicleNodeTypeId = ethers.utils.keccak256(vehicleNodeType);

// Mock attributes
export const mockAttribute1 = 'mockAttribute1';
export const mockAttribute2 = 'mockAttribute2';
export const mockAttribute3 = 'mockAttribute3';
export const mockAttributes = [mockAttribute1, mockAttribute2];
export const attributesNotWhitelisted = [mockAttribute1, mockAttribute3];

// Infos associated with attributes
export const mockInfo1 = 'mockInfo1';
export const mockInfo2 = 'mockInfo2';
export const mockInfos = [mockInfo1, mockInfo2];
export const mockInfosWrongSize = [mockInfo1];
