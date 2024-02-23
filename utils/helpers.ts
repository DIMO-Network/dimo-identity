import { ethers } from 'hardhat';

export function getSelectors(_interface: any): Array<string> {
  return _interface.fragments
    .filter((frag: any) => frag.type === 'function')
    .map((frag: any) => ethers.id(frag.format('sighash')).substring(0, 10));
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

export function dimoStreamMetadata(vehicleId: number | string) {
  return `{"partitions":1,"description":"DIMO Vehicle Stream for Vehicle ${vehicleId}","config":{"fields":[]}}`;
}
