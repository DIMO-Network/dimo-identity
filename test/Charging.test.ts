import chai from 'chai';
import { ethers, } from 'hardhat';
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';

import type {
  DimoAccessControl,
  Charging
} from '../typechain-types';
import { setup, createSnapshot, revertToSnapshot, C } from '../utils';

const { expect } = chai;

describe('Charging', function () {
  let snapshot: string;
  let dimoAccessControlInstance: DimoAccessControl;
  let chargingInstance: Charging;

  let admin: HardhatEthersSigner, nonAdmin: HardhatEthersSigner;

  before(async () => {
    [admin, nonAdmin] = await ethers.getSigners();

    const deployments = await setup(admin, {
      modules: ['DimoAccessControl', 'Charging'],
      nfts: [],
      upgradeableContracts: []
    });

    dimoAccessControlInstance = deployments.DimoAccessControl;
    chargingInstance = deployments.Charging;

    await dimoAccessControlInstance
      .connect(admin)
      .grantRole(C.ADMIN_ROLE, admin.address);
  });

  beforeEach(async () => {
    snapshot = await createSnapshot();
  });

  afterEach(async () => {
    await revertToSnapshot(snapshot);
  });

  describe('setOperationCost', () => {
    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          chargingInstance
            .connect(nonAdmin)
            .setDcxOperationCost(C.MOCK_OPERATION, C.MOCK_OPERATION_COST)
        ).to.be.rejectedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.ADMIN_ROLE
          }`
        );
      });
    });

    context('State', () => {
      it('Should correctly return the operation cost', async () => {
        await chargingInstance
          .connect(admin)
          .setDcxOperationCost(C.MOCK_OPERATION, C.MOCK_OPERATION_COST);

        const operationCost = await chargingInstance.getDcxOperationCost(C.MOCK_OPERATION);

        expect(operationCost).to.equal(C.MOCK_OPERATION_COST);
      });
    });

    context('Events', () => {
      it('Should emit OperationCostSet event with correct params', async () => {
        await expect(
          chargingInstance
            .connect(admin)
            .setDcxOperationCost(C.MOCK_OPERATION, C.MOCK_OPERATION_COST)
        )
          .to.emit(chargingInstance, 'OperationCostSet')
          .withArgs(C.MOCK_OPERATION, C.MOCK_OPERATION_COST);
      });
    });
  });
});
