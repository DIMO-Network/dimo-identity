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

export async function getGasPrice(bump: bigint = 20n): Promise<bigint> {
  const price = (await ethers.provider.getFeeData()).gasPrice as bigint;
  return (price * bump / 100n + price);
}

export async function getGasPriceWithSleep(
  bump: bigint = 20n,
  sleepInterval: number = 5000,
  priceLimit?: bigint
): Promise<bigint> {
  let returnPrice = await getGasPrice(bump);

  if (priceLimit) {
    while (returnPrice > priceLimit) {
      console.log(`Gas price too high: ${returnPrice}\nSleeping ${sleepInterval} ms...`);
      await sleep(sleepInterval);
      console.log('Done sleeping');

      returnPrice = await getGasPrice(bump);
    }
  }

  return returnPrice;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));