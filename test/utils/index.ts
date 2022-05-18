import { ethers } from 'hardhat';

export function nodeHash(inputName: string) {
  let node = '00'.repeat(32);

  if (inputName) {
    const labels = inputName.split('.');

    for (let i = labels.length - 1; i >= 0; i--) {
      const labelHash = ethers.utils.keccak256(Buffer.from(labels[i]));
      node = ethers.utils.solidityKeccak256(
        ['uint256', 'uint256'],
        [node, labelHash]
      );
    }
  }

  return node;
}

export function getSelectors(intf: any): Array<string> {
  return Object.keys(intf.functions).map((item) => intf.getSighash(item));
}
