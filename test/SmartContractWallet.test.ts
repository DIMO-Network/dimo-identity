import chai from 'chai';
import { ethers, waffle } from 'hardhat';

import {
  ERC1271MaliciousMock__factory as ERC1271MaliciousMockFactory,
  ERC1271WalletMock__factory as ERC1271WalletMockFactory,
  MockSignatureChecker
} from '../typechain';
import { createSnapshot, revertToSnapshot } from '../utils';
import { hashMessage } from 'ethers/lib/utils';

const { expect } = chai;
const provider = waffle.provider;

const testMessageGood = 'good-message';
const testMessageBad = 'bad-message';

const hashGoodMessage = hashMessage(testMessageGood);
const hashBadMessage = hashMessage(testMessageBad);

describe('SmartContractWallet', function () {
  let snapshot: string;
  let mockERC1271WalletFactory: ERC1271WalletMockFactory;
  let mockMaliciousERC1271WalletFactory: ERC1271MaliciousMockFactory;
  let signatureChecker: MockSignatureChecker;
  const [signer] = provider.getWallets();

  before(async () => {
    mockERC1271WalletFactory = await ethers.getContractFactory(
      'ERC1271WalletMock'
    );
    mockMaliciousERC1271WalletFactory = await ethers.getContractFactory(
      'ERC1271MaliciousMock'
    );

    signatureChecker = await (
      await ethers.getContractFactory('MockSignatureChecker')
    )
      .connect(signer)
      .deploy();
  });

  beforeEach(async () => {
    snapshot = await createSnapshot();
  });

  afterEach(async () => {
    await revertToSnapshot(snapshot);
  });

  describe('MockERC12721Wallet', async () => {
    it('deploySmartContractWallet', async () => {
      const contractWallet = await mockERC1271WalletFactory
        .connect(signer)
        .deploy(signer.address);
      await expect(contractWallet.address).to.exist;
    });
    it('verifyValidSmartContractWalletSignature', async () => {
      const contractWallet = await mockERC1271WalletFactory
        .connect(signer)
        .deploy(signer.address);
      const signature = await signer.signMessage(testMessageGood);

      await expect(
        await contractWallet.isValidSignature(hashGoodMessage, signature)
      ).to.be.eq(contractWallet.interface.getSighash('isValidSignature'));

      await expect(
        await signatureChecker.verifySignature(
          contractWallet.address,
          hashGoodMessage,
          signature
        )
      ).to.be.eq(true);
    });
    it('verifyInvalidSmartContractWalletSignature', async () => {
      const contractWallet = await mockERC1271WalletFactory
        .connect(signer)
        .deploy(signer.address);
      const signature = await signer.signMessage(testMessageGood);

      await expect(
        await contractWallet.isValidSignature(hashBadMessage, signature)
      ).to.be.eq('0x00000000');

      await expect(
        await signatureChecker.verifySignature(
          contractWallet.address,
          hashBadMessage,
          signature
        )
      ).to.be.eq(false);
    });
  });

  describe('deployMaliciousSmartContractWallet', async () => {
    it('deployMaliciousSmartContractWallet', async () => {
      const contractWallet = await mockMaliciousERC1271WalletFactory
        .connect(signer)
        .deploy(signer.address);
      await expect(contractWallet.address).to.exist;
    });

    it('verifyMaliciousSmartContractWalletSignatureFails', async () => {
      const contractWallet = await mockMaliciousERC1271WalletFactory
        .connect(signer)
        .deploy(signer.address);
      const signature = await signer.signMessage(testMessageGood);
      await expect(
        await contractWallet.isValidSignature(hashBadMessage, signature)
      ).to.be.eq('0xffffffff');
      // await expect(
      //   await signatureChecker.verifySignature(
      //     contractWallet.address,
      //     hashBadMessage,
      //     signature
      //   )
      // ).to.be.reverted("CALL_EXCEPTION")
    });
  });
});
