const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("MainContract:", () => {
    async function deployMainContract() {
        // Contracts are deployed using the first signer/account by default
        const [OwnerSigner, MerchantSigner] = await ethers.getSigners()
        const OwnerAddress = OwnerSigner.address
        const MerchantAddress = MerchantSigner.address
        const MerchantName = "Test"

        const MainContract = await ethers.getContractFactory("MainContract")
        const maincontract = await MainContract.deploy()

        const MerchantContractAddress = "0xCE0C00dA6f172A9214FE28362da2fbBcf08838Ff"


        return { maincontract, OwnerSigner, MerchantSigner, OwnerAddress, MerchantAddress, MerchantName, MerchantContractAddress }
    }

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            const { maincontract, OwnerSigner, OwnerAddress } = await loadFixture(deployMainContract);

            expect(await maincontract.connect(OwnerSigner).getOwnerAddress()).to.equal(OwnerAddress);
        });
    });

    /* describe("GetMerchantWalletAddress", function () {
        it("Should get the Merchant Wallet Address", async function () {
            const { maincontract, OwnerSigner, MerchantContractAddress, MerchantAddress } = await loadFixture(deployMainContract);

            expect(await maincontract.connect(OwnerSigner).getMerchantWalletAddress(MerchantContractAddress)).to.equal(MerchantAddress);
        });
    }); */

    describe("AddMerchantContract", function () {
        describe("Validations", function () {
            it("Should revert with the right error if called from another account", async function () {
                const { maincontract, MerchantSigner, MerchantAddress, MerchantName } = await loadFixture(deployMainContract);

                await expect(maincontract.connect(MerchantSigner).addMerchantContract(MerchantAddress, MerchantName)).to.be.revertedWith(
                    "Only Owner can call this function"
                );
            });
        });

        describe("Events", function () {
            it("Should emit an event on CreateMerchantContract", async function () {
                const { maincontract, OwnerSigner, MerchantAddress, MerchantName } = await loadFixture(deployMainContract);

                await expect(maincontract.connect(OwnerSigner).addMerchantContract(MerchantAddress, MerchantName))
                    .to.emit(maincontract, "CreateMerchantContract")
                    .withArgs(anyValue, MerchantAddress, MerchantName);
            });
        });

        describe("Add Merchant Contract", function () {
            it("Should add a new Merchant Contract", async function () {
                const { maincontract, OwnerSigner, MerchantAddress, MerchantName } = await loadFixture(deployMainContract);

                await expect(maincontract.connect(OwnerSigner).addMerchantContract(MerchantAddress, MerchantName)).not.to.be.reverted;
            });
        });
    });

    /* describe("ApproveMerchantContract", function () {
        describe("Validations", function () {
            it("Should revert because it's a private function", async function () {
                const { maincontract, MerchantContractAddress } = await loadFixture(deployMainContract);

                await expect(maincontract.approveMerchantContract(MerchantContractAddress)).to.be.reverted;
            });
        });

         describe("Events", function () {
            it("Should emit an event on ApprovedMerchantContract", async function () {
                const { maincontract, MerchantContractAddress } = await loadFixture(deployMainContract);

                await expect(maincontract.approveMerchantContract(MerchantContractAddress))
                    .to.emit(maincontract, "ApprovedMerchantContract")
                    .withArgs(anyValue, false);
            });
        });

        describe("Approve Merchant Contract", function () {
            it("Should approve Merchant Contract", async function () {
                const { maincontract, MerchantContractAddress } = await loadFixture(deployMainContract);

                await expect(maincontract.approveMerchantContract(MerchantContractAddress)).not.to.be.reverted;
            });
        }); 
    }); */

    describe("DisapproveMerchantContract", function () {
        describe("Validations", function () {
            it("Should revert with the right error if called from another account", async function () {
                const { maincontract, MerchantSigner, MerchantContractAddress } = await loadFixture(deployMainContract);

                await expect(maincontract.connect(MerchantSigner).disapproveMerchantContract(MerchantContractAddress)).to.be.revertedWith(
                    "Only Owner can call this function"
                );
            });

            it("Should revert with the right error if not approved", async function () {
                const { maincontract, OwnerSigner, MerchantContractAddress } = await loadFixture(deployMainContract);

                await expect(maincontract.connect(OwnerSigner).disapproveMerchantContract(MerchantContractAddress)).to.be.revertedWith("This address isn't approved!");
            });

            /* it("Shouldn't fail if it's approved", async function () {
                const { maincontract, OwnerSigner, MerchantContractAddress } = await loadFixture(deployMainContract);

                await expect(maincontract.connect(OwnerSigner).disapproveMerchantContract(MerchantContractAddress)).not.to.be.reverted;
            }); */
        });

        /* describe("Events", function () {
            it("Should emit an event on ApprovedMerchantContract", async function () {
                const { maincontract, OwnerSigner, MerchantContractAddress } = await loadFixture(deployMainContract);
                
                await expect(maincontract.connect(OwnerSigner).disapproveMerchantContract(MerchantContractAddress))
                    .to.emit(maincontract, "ApprovedMerchantContract")
                    .withArgs(anyValue, false);
            });
        });

        describe("Disapprove Merchant Contract", function () {
            it("Should disapprove Merchant Contract", async function () {
                const { maincontract, OwnerSigner, MerchantContractAddress } = await loadFixture(deployMainContract);
                
                await expect(maincontract.connect(OwnerSigner).disapproveMerchantContract(MerchantContractAddress)).not.to.be.reverted;
            });
        }); */
    });

    describe("FreezeWithdrawalsMerchantContract", function () {
        describe("Validations", function () {
            it("Should revert with the right error if called from another account", async function () {
                const { maincontract, MerchantSigner, MerchantContractAddress } = await loadFixture(deployMainContract);

                await expect(maincontract.connect(MerchantSigner).freezeWithdrawalsMerchantContract(MerchantContractAddress)).to.be.revertedWith(
                    "Only Owner can call this function"
                );
            });

            it("Should revert if the withdrawals are paused", async function () {
                const { maincontract, OwnerSigner, MerchantContractAddress } = await loadFixture(deployMainContract);

                await expect(maincontract.connect(OwnerSigner).freezeWithdrawalsMerchantContract(MerchantContractAddress)).to.be.reverted;
            });

            /* it("Shouldn't fail if the withdrawals are unpaused", async function () {
                const { maincontract, OwnerSigner, MerchantContractAddress } = await loadFixture(deployMainContract);

                await expect(maincontract.connect(OwnerSigner).freezeWithdrawalsMerchantContract(MerchantContractAddress)).not.to.be.reverted;
            }); */
        });

        /* describe("Events", function () {
            it("Should emit an event on PausedMerchantContract", async function () {
                const { maincontract, OwnerSigner, MerchantContractAddress } = await loadFixture(deployMainContract);

                await expect(maincontract.connect(OwnerSigner).freezeWithdrawalsMerchantContract(MerchantContractAddress))
                    .to.emit(maincontract, "PausedMerchantContract")
                    .withArgs(anyValue, true);
            });
        });

        describe("Freeze Withdrawals Merchant Contract", function () {
            it("Should freeze withdrawals of the Merchant Contract", async function () {
                const { maincontract, OwnerSigner, MerchantContractAddress } = await loadFixture(deployMainContract);

                await expect(maincontract.connect(OwnerSigner).freezeWithdrawalsMerchantContract(MerchantContractAddress)).not.to.be.reverted;
            });
        }); */
    });

    describe("UnfreezeWithdrawalsMerchantContract", function () {
        describe("Validations", function () {
            it("Should revert with the right error if called from another account", async function () {
                const { maincontract, MerchantSigner, MerchantContractAddress } = await loadFixture(deployMainContract);

                await expect(maincontract.connect(MerchantSigner).unfreezeWithdrawalsMerchantContract(MerchantContractAddress)).to.be.revertedWith(
                    "Only Owner can call this function"
                );
            });

            it("Should revert if the withdrawals are unpaused", async function () {
                const { maincontract, OwnerSigner, MerchantContractAddress } = await loadFixture(deployMainContract);

                await expect(maincontract.connect(OwnerSigner).unfreezeWithdrawalsMerchantContract(MerchantContractAddress)).to.be.reverted;
            });

            /* it("Shouldn't fail if the withdrawals are paused", async function () {
                const { maincontract, OwnerSigner, MerchantContractAddress } = await loadFixture(deployMainContract);

                await expect(maincontract.connect(OwnerSigner).unfreezeWithdrawalsMerchantContract(MerchantContractAddress)).not.to.be.reverted;
            }); */
        });

        /* describe("Events", function () {
            it("Should emit an event on PausedMerchantContract", async function () {
                const { maincontract, OwnerSigner, MerchantContractAddress } = await loadFixture(deployMainContract);
                
                await expect(maincontract.connect(OwnerSigner).unfreezeWithdrawalsMerchantContract(MerchantContractAddress))
                    .to.emit(maincontract, "PausedMerchantContract")
                    .withArgs(anyValue, false);
            });
        });

        describe("Unfreeze Withdrawals Merchant Contract", function () {
            it("Should unfreeze withdrawals of the Merchant Contract", async function () {
                const { maincontract, OwnerSigner, MerchantContractAddress } = await loadFixture(deployMainContract);
                
                await expect(maincontract.connect(OwnerSigner).unfreezeWithdrawalsMerchantContract(MerchantContractAddress)).not.to.be.reverted;
            });
        }); */
    });

    /* describe("VoteNewMerchantContractApproval", function () {
        describe("Validations", function () {
        });

        describe("Events", function () {
        });

        describe("Vote New Merchant Contract Approval", function () {
        });
    });

    describe("SaveHistoric", function () {
        describe("Validations", function () {
        });

        describe("Events", function () {
        });

        describe("Save Historic", function () {
        });
    }); */
});
