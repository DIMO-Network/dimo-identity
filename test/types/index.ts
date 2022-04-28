import { BigNumber } from 'ethers';

export type Controller = {
  isController: boolean,
  rootMinted: boolean
};

export type Record = {
  originNode: BigNumber,
  root: boolean
};
