import { ethers } from 'hardhat';
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';
import { GenericKeyAny } from '../utils/types';

const testNetworks = ['hardhat', 'localhost', 'tenderly'];
const validNetworks = ['polygon', 'amoy'];

const signers: GenericKeyAny = {
    'polygon': '0xCED3c922200559128930180d3f0bfFd4d9f4F123',
    'amoy': '0xC008EF40B0b42AAD7e34879EB024385024f753ea'
}
const sharedAccount = '0xC008EF40B0b42AAD7e34879EB024385024f753ea';

export async function getAccounts(
    networkName: string,
    forkNetwork?: string
): Promise<HardhatEthersSigner[]> {
    // eslint-disable-next-line prefer-const
    let [signer, sponsor, shared] = await ethers.getSigners();

    if (testNetworks.includes(networkName)) {
        if (forkNetwork && validNetworks.includes(forkNetwork)) {
            signer = await ethers.getImpersonatedSigner(signers[forkNetwork]);
            await sponsor.sendTransaction({
                to: signer.address,
                value: ethers.parseEther('10')
            });
        }

        shared = await ethers.getImpersonatedSigner(sharedAccount);
        await sponsor.sendTransaction({
            to: shared.address,
            value: ethers.parseEther('10')
        });

        return [signer, shared];
    }

    return [signer];
}