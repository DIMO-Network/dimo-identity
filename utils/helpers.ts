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

export function getSelectors(_interface: any): Array<string> {
  return Object.keys(_interface.functions).map((item) =>
    _interface.getSighash(item)
  );
}

export function bytesToHex(uint8a: Uint8Array): string {
  const hexes = Array.from({ length: 256 }, (v, i) =>
    i.toString(16).padStart(2, '0')
  );

  let hex = '';
  for (let i = 0; i < uint8a.length; i++) {
    hex += hexes[uint8a[i]];
  }
  return hex;
}
