// const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
require("dotenv").config();

describe("MainContract:", () => {
    let OwnerAddress = process.env.OWNER_ADDRESS
    let MerchantAddress = process.env.MERCHANT_ADDRESS
    let MerchantName = process.env.MERCHANT_NAME

    let MainContract
    let maincontract

    deployMainContract()

    async function deployMainContract() {
        MainContract = await ethers.getContractFactory("MainContract")
        maincontract = await MainContract.deploy(OwnerAddress)
    }

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await maincontract.owner()).to.equal(OwnerAddress);
        });
    });

    describe("AddMerchantContract", function () {
        describe("Validations", function () {
            it("Should revert with the right error if called from another account", async function () {
                await expect(maincontract.connect(MerchantAddress).addMerchantContract(MerchantAddress, MerchantName)).to.be.revertedWith(
                    "Only Owner can call this function"
                );
            });
        });

        describe("Events", function () {
            it("Should emit an event on CreateMerchantContract", async function () {
                await expect(maincontract.connect(OwnerAddress).addMerchantContract(MerchantAddress, MerchantName))
                    .to.emit(maincontract, "CreateMerchantContract")
                    .withArgs(anyValue, anyValue, MerchantAddress, MerchantName);
            });
        });

        describe("Add Merchant Contract", function () {
            it("Should add a new Merchant Contract", async function () {
                await expect(maincontract.connect(OwnerAddress).addMerchantContract(MerchantAddress, MerchantName)).not.to.be.reverted;
            });
        });
    });

    describe("ApproveMerchantContract", function () {
        describe("Validations", function () {
            it("Should revert with the right error if called from another account", async function () {
                await expect(maincontract.connect(MerchantAddress).approveMerchantContract(0)).to.be.revertedWith(
                    "Only Owner can call this function"
                );
            });

            it("Should revert because it's a private function", async function () {
                await expect(maincontract.connect(OwnerAddress).approveMerchantContract(0)).to.be.reverted;
            });
        });

        /* describe("Events", function () {
            it("Should emit an event on ApprovedMerchantContract", async function () {
                await expect(maincontract.connect(OwnerAddress).approveMerchantContract(0))
                    .to.emit(maincontract, "ApprovedMerchantContract")
                    .withArgs(anyValue, true);
            });
        });

        describe("Approve Merchant Contract", function () {
            it("Should approve Merchant Contract", async function () {
                await expect(maincontract.connect(OwnerAddress).approveMerchantContract(0)).not.to.be.reverted;
            });
        }); */
    });

    describe("DisapproveMerchantContract", function () {
        describe("Validations", function () {
            it("Should revert with the right error if called from another account", async function () {
                await expect(maincontract.connect(MerchantAddress).disapproveMerchantContract(0)).to.be.revertedWith(
                    "Only Owner can call this function"
                );
            });

            it("Should revert with the right error if not approved", async function () {
                await expect(maincontract.connect(OwnerAddress).disapproveMerchantContract(0)).to.be.revertedWith("This address isn't approved!");
            });

            /* it("Shouldn't fail if it's approved", async function () {
                await expect(maincontract.connect(OwnerAddress).disapproveMerchantContract(0)).not.to.be.reverted;
            }); */
        });

        /* describe("Events", function () {
            it("Should emit an event on ApprovedMerchantContract", async function () {
                await expect(maincontract.connect(OwnerAddress).disapproveMerchantContract(0))
                    .to.emit(maincontract, "ApprovedMerchantContract")
                    .withArgs(anyValue, false);
            });
        });

        describe("Disapprove Merchant Contract", function () {
            it("Should disapprove Merchant Contract", async function () {
                await expect(maincontract.connect(OwnerAddress).disapproveMerchantContract(0)).not.to.be.reverted;
            });
        }); */
    });

    describe("FreezeWithdrawalsMerchantContract", function () {
        describe("Validations", function () {
            it("Should revert with the right error if called from another account", async function () {
                await expect(maincontract.connect(MerchantAddress).freezeWithdrawalsMerchantContract(0)).to.be.revertedWith(
                    "Only Owner can call this function"
                );
            });

            it("Should revert if the withdrawals are paused", async function () {
                await expect(maincontract.connect(OwnerAddress).freezeWithdrawalsMerchantContract(0)).to.be.reverted;
            });

            it("Shouldn't fail if the withdrawals are unpaused", async function () {
                await expect(maincontract.connect(OwnerAddress).freezeWithdrawalsMerchantContract(0)).not.to.be.reverted;
            });
        });

        describe("Events", function () {
            it("Should emit an event on PausedMerchantContract", async function () {
                await expect(maincontract.connect(OwnerAddress).freezeWithdrawalsMerchantContract(0))
                    .to.emit(maincontract, "PausedMerchantContract")
                    .withArgs(anyValue, true);
            });
        });

        describe("Freeze Withdrawals Merchant Contract", function () {
            it("Should freeze withdrawals of the Merchant Contract", async function () {
                await expect(maincontract.connect(OwnerAddress).freezeWithdrawalsMerchantContract(0)).not.to.be.reverted;
            });
        });
    });

    describe("UnfreezeWithdrawalsMerchantContract", function () {
        describe("Validations", function () {
            it("Should revert with the right error if called from another account", async function () {
                await expect(maincontract.connect(MerchantAddress).unfreezeWithdrawalsMerchantContract(0)).to.be.revertedWith(
                    "Only Owner can call this function"
                );
            });

            it("Should revert if the withdrawals are unpaused", async function () {
                await expect(maincontract.connect(OwnerAddress).unfreezeWithdrawalsMerchantContract(0)).to.be.reverted;
            });

            it("Shouldn't fail if the withdrawals are paused", async function () {
                await expect(maincontract.connect(OwnerAddress).unfreezeWithdrawalsMerchantContract(0)).not.to.be.reverted;
            });
        });

        /* describe("Events", function () {
            it("Should emit an event on PausedMerchantContract", async function () {
                await expect(maincontract.connect(OwnerAddress).unfreezeWithdrawalsMerchantContract(0))
                    .to.emit(maincontract, "PausedMerchantContract")
                    .withArgs(anyValue, false);
            });
        });

        describe("Unfreeze Withdrawals Merchant Contract", function () {
            it("Should unfreeze withdrawals of the Merchant Contract", async function () {
                await expect(maincontract.connect(OwnerAddress).unfreezeWithdrawalsMerchantContract(0)).not.to.be.reverted;
            });
        }); */
    });
});
