const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("MerchantContract:", () => {
    async function deployMerchantContract() {
        // Contracts are deployed using the first signer/account by default
        const [OwnerSigner, MerchantSigner, BuyerSigner] = await ethers.getSigners()
        const OwnerAddress = OwnerSigner.address
        const MerchantAddress = MerchantSigner.address
        const BuyerAddress = BuyerSigner.address
        const MerchantName = "Test"

        const MerchantContract = await ethers.getContractFactory("MerchantContract")
        const merchantcontract = await MerchantContract.deploy(MerchantAddress, MerchantName)

        return { merchantcontract, OwnerSigner, MerchantSigner, BuyerSigner, OwnerAddress, MerchantAddress, MerchantName, BuyerSigner }
    }

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            const { merchantcontract, OwnerSigner, OwnerAddress } = await loadFixture(deployMerchantContract);

            expect(await merchantcontract.connect(OwnerSigner).getOwnerAddress()).to.equal(OwnerAddress);
        });
    });

    describe("CheckMyAddress", function () {
        describe("Validations", function () {
            it("Should revert with the right error if called from another account", async function () {
                const { merchantcontract, OwnerSigner } = await loadFixture(deployMerchantContract);

                // expect(new Promise((res,rej) => {rej()})).to.be.rejected
                await expect(merchantcontract.connect(OwnerSigner).checkMyAddress()).to.be.revertedWith(
                    "Only Merchant can call this function"
                );
            });

            it("Should revert with the right error if Merchant not approved", async function () {
                const { merchantcontract, MerchantSigner } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(MerchantSigner).checkMyAddress()).to.be.revertedWith(
                    "Merchant not approved!"
                );
            });
        });

        /* describe("Check Merchant Address", function () {
            it("Should return the Merchant Address", async function () {
                const { merchantcontract, MerchantSigner, MerchantAddress } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(MerchantSigner).checkMyAddress())
                // await expect(merchantcontract.connect(MerchantSigner).checkMyAddress()).to.equal(MerchantAddress);
            });
        }); */
    });

    describe("ChangeMyAddress", function () {
        describe("Validations", function () {
            it("Should revert with the right error if called from another account", async function () {
                const { merchantcontract, OwnerSigner, OwnerAddress } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(OwnerSigner).changeMyAddress(OwnerAddress)).to.be.revertedWith(
                    "Only Merchant can call this function"
                );
            });

            it("Should revert with the right error if Merchant not approved", async function () {
                const { merchantcontract, MerchantSigner, OwnerAddress } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(MerchantSigner).changeMyAddress(OwnerAddress)).to.be.revertedWith(
                    "Merchant not approved!"
                );
            });
        });

        /* describe("Change Merchant Address", function () {
            it("Should change Merchant Address", async function () {
                const { merchantcontract, MerchantSigner, OwnerAddress } = await loadFixture(deployMerchantContract);
                
                await expect(merchantcontract.connect(MerchantSigner).changeMyAddress(OwnerAddress)).not.to.be.reverted;
            });
        }); */
    });

    describe("CheckMyName", function () {
        describe("Validations", function () {
            it("Should revert with the right error if called from another account", async function () {
                const { merchantcontract, OwnerSigner } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(OwnerSigner).checkMyName()).to.be.revertedWith(
                    "Only Merchant can call this function"
                );
            });

            it("Should revert with the right error if Merchant not approved", async function () {
                const { merchantcontract, MerchantSigner } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(MerchantSigner).checkMyName()).to.be.revertedWith(
                    "Merchant not approved!"
                );
            });
        });

        /* describe("Check Merchant Name", function () {
            it("Should return the Merchant Name", async function () {
                const { merchantcontract, MerchantSigner, MerchantName } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(MerchantSigner).checkMyName())
                // await expect(merchantcontract.connect(MerchantSigner).checkMyName()).to.equal(MerchantName);
            });
        }); */
    });

    describe("CheckMyEscrowAmount", function () {
        describe("Validations", function () {
            it("Should revert with the right error if called from another account", async function () {
                const { merchantcontract, OwnerSigner } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(OwnerSigner).checkMyEscrowAmount()).to.be.revertedWith(
                    "Only Merchant can call this function"
                );
            });

            it("Should revert with the right error if Merchant not approved", async function () {
                const { merchantcontract, MerchantSigner } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(MerchantSigner).checkMyEscrowAmount()).to.be.revertedWith(
                    "Merchant not approved!"
                );
            });
        });

        /* describe("Check Merchant Escrow Amount", function () {
            it("Should return the Merchant Escrow Amount", async function () {
                const { merchantcontract, MerchantSigner } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(MerchantSigner).checkMyEscrowAmount())
                // await expect(merchantcontract.connect(MerchantSigner).checkMyEscrowAmount()).to.equal(0);
            });
        }); */
    });

    describe("CheckMyBalance", function () {
        describe("Validations", function () {
            it("Should revert with the right error if called from another account", async function () {
                const { merchantcontract, OwnerSigner } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(OwnerSigner).checkMyBalance()).to.be.revertedWith(
                    "Only Merchant can call this function"
                );
            });

            it("Should revert with the right error if Merchant not approved", async function () {
                const { merchantcontract, MerchantSigner } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(MerchantSigner).checkMyBalance()).to.be.revertedWith(
                    "Merchant not approved!"
                );
            });
        });

        /* describe("Check Merchant Balance", function () {
            it("Should return the Merchant Balance", async function () {
                const { merchantcontract, MerchantSigner } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(MerchantSigner).checkMyBalance())
                // await expect(merchantcontract.connect(MerchantSigner).checkMyBalance()).to.equal(0);
            });
        }); */
    });



    /* ----- Purchase Flow ----- */
    describe("CreatePurchase", function () {
        describe("Validations", function () {
            it("Should revert with the right error if called from another account", async function () {
                const { merchantcontract, OwnerSigner } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(OwnerSigner).createPurchase(10, 2, 1234)).to.be.revertedWith(
                    "Only Merchant can call this function"
                );
            });

            it("Should revert with the right error if Merchant not approved", async function () {
                const { merchantcontract, MerchantSigner } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(MerchantSigner).createPurchase(10, 2, 1234)).to.be.revertedWith(
                    "Merchant not approved!"
                );
            });
        });

        describe("Events", function () {
            it("Should emit an event on CreatePurchase", async function () {
                const { merchantcontract, MerchantSigner } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(MerchantSigner).createPurchase(10, 2, 1234))
                    .to.emit(merchantcontract, "CreatePurchase")
                    .withArgs(anyValue, 2, 1234);
            });
        });

        describe("Create a new Purchase", function () {
            it("Should create a new Purchase", async function () {
                const { merchantcontract, MerchantSigner } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(MerchantSigner).createPurchase(10, 2, 1234)).not.to.be.reverted;
            });
        });
    });

    describe("Buy", function () {
        describe("Validations", function () {
            it("Should revert with the right error if Merchant not approved", async function () {
                const { merchantcontract, MerchantSigner } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(MerchantSigner).buy(10, { value: 2 })).to.be.revertedWith(
                    "Merchant not approved!"
                );
            });

            it("Should revert if the msg.value is 0", async function () {
                const { merchantcontract, MerchantSigner } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(MerchantSigner).buy(10, { value: 0 })).to.be.revertedWith(
                    "Amount should be greater than 0!"
                );
            });

            it("Should revert if the purchase status is 0", async function () {
                const { merchantcontract, MerchantSigner } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(MerchantSigner).buy(10, { value: 2 })).to.be.revertedWith(
                    "The purchase doesn't exist!"
                );
            });

            it("Should revert if the purchase status is 2", async function () {
                const { merchantcontract, MerchantSigner } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(MerchantSigner).buy(10, { value: 2 })).to.be.revertedWith(
                    "The purchase has already been paid!"
                );
            });

            it("Should revert if the purchase status is 3", async function () {
                const { merchantcontract, MerchantSigner } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(MerchantSigner).buy(10, { value: 2 })).to.be.revertedWith(
                    "The purchase has already been refunded!"
                );
            });

            it("Should revert if the msg.value is different of purchase amount", async function () {
                const { merchantcontract, MerchantSigner } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(MerchantSigner).buy(10, { value: 1 })).to.be.revertedWith(
                    "Wrong amount!"
                );
            });
        });

        describe("Events", function () {
            it("Should emit an event on Buy", async function () {
                const { merchantcontract, BuyerAddress } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.buy(10, { value: 2 }))
                    .to.emit(merchantcontract, "Buy")
                    .withArgs(10, anyValue, BuyerAddress, anyValue, 2);
            });
        });

        describe("Buy a product", function () {
            it("Should buy a product", async function () {
                const { merchantcontract } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.buy(10, { value: 2 })).not.to.be.reverted;
            });
        });
    });

    describe("Complete", function () {
        describe("Validations", function () {
            it("Should revert with the right error if called from another account", async function () {
                const { merchantcontract, OwnerSigner } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(OwnerSigner).complete(10)).to.be.revertedWith(
                    "Only Merchant can call this function"
                );
            });

            it("Should revert with the right error if Merchant not approved", async function () {
                const { merchantcontract, MerchantSigner } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(MerchantSigner).complete(10)).to.be.revertedWith(
                    "Merchant not approved!"
                );
            });

            it("Should revert if purchase is still on escrow time", async function () { // ??
                const { merchantcontract, MerchantSigner } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(MerchantSigner).complete(10)).to.be.revertedWith(
                    "The escrow time of this purchase isn't over yet"
                );
            });
        });

        describe("Events", function () {
            it("Should emit an event on Complete", async function () {
                const { merchantcontract, MerchantSigner } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(MerchantSigner).complete(10))
                    .to.emit(merchantcontract, "Complete")
                    .withArgs(10);
            });
        });

        describe("Change a purchase to complete", function () {
            it("Should change a purchase to complete", async function () {
                const { merchantcontract, MerchantSigner } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(MerchantSigner).complete(10)).not.to.be.reverted;
            });
        });
    });

    describe("Withdrawal", function () {
        describe("Validations", function () {
            it("Should revert with the right error if called from another account", async function () {
                const { merchantcontract, OwnerSigner } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(OwnerSigner).withdrawal()).to.be.revertedWith(
                    "Only Merchant can call this function"
                );
            });

            it("Should revert with the right error if Merchant not approved", async function () {
                const { merchantcontract, MerchantSigner } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(MerchantSigner).withdrawal()).to.be.revertedWith(
                    "Merchant not approved!"
                );
            });

            it("Should revert with the right error if balance not be greater than 0", async function () {
                const { merchantcontract, MerchantSigner } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(MerchantSigner).withdrawal()).to.be.revertedWith(
                    "Balance should be greater than 0!!"
                );
            });

            it("Should revert if the withdrawals are paused", async function () {
                const { merchantcontract, MerchantSigner } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(MerchantSigner).withdrawal()).to.be.revertedWith(
                    "Withdrawals are paused!"
                );
            });

            it("Shouldn't fail if the withdrawals are unpaused", async function () {
                const { merchantcontract, MerchantSigner } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(MerchantSigner).withdrawal()).not.to.be.reverted;
            });
        });

        describe("Events", function () {
            it("Should emit an event on Withdrawal", async function () {
                const { merchantcontract, MerchantSigner } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(MerchantSigner).withdrawal())
                    .to.emit(merchantcontract, "Withdrawal")
                    .withArgs(anyValue, anyValue);
            });
        });

        describe("Withdrawal the money to Merchant Address", function () {
            it("Should withdrawal the money to Merchant Address", async function () {
                const { merchantcontract, MerchantSigner } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(MerchantSigner).withdrawal()).not.to.be.reverted;
            });
        });
    });

    /* describe("Refund", function () {
        describe("Validations", function () {
            // ----- Modifiers ----- //
            it("Should revert with the right error if called from another account", async function () {
                const { merchantcontract, OwnerSigner, BuyerAddress } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(OwnerSigner).refund(10, BuyerAddress, 1)).to.be.revertedWith(
                    "Only Merchant can call this function"
                );
            });

            it("Should revert with the right error if Merchant not approved", async function () {
                const { merchantcontract, MerchantSigner, BuyerAddress } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(MerchantSigner).refund(10, BuyerAddress, 1)).to.be.revertedWith(
                    "Merchant not approved!"
                );
            });

            it("Should revert if the withdrawals are paused", async function () {
                const { merchantcontract, MerchantSigner, BuyerAddress } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(MerchantSigner).refund(10, BuyerAddress, 1)).to.be.revertedWith(
                    "Withdrawals are paused!"
                );
            });

            it("Shouldn't fail if the withdrawals are unpaused", async function () {
                const { merchantcontract, MerchantSigner, BuyerAddress } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(MerchantSigner).refund(10, BuyerAddress, 1)).not.to.be.reverted;
            });
            // --------------------- //


            it("Should revert if the refundAmount not greater than 0", async function () {
                const { merchantcontract, MerchantSigner, BuyerAddress } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(MerchantSigner).refund(10, BuyerAddress, 0)).to.be.revertedWith(
                    "Refund amount should be greater than 0!!"
                );
            });

            it("Should revert if the refundAmount is greater than purchase amount", async function () {
                const { merchantcontract, MerchantSigner, BuyerAddress } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(MerchantSigner).refund(10, BuyerAddress, 3)).to.be.revertedWith(
                    "Refund amount shouldn't be greater than the purchaseAmount!"
                );
            });


            it("Should revert if the purchase status is 0", async function () {
                const { merchantcontract, MerchantSigner, BuyerAddress } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(MerchantSigner).refund(10, BuyerAddress, 1)).to.be.revertedWith(
                    "The purchase doesn't exist!"
                );
            });

            it("Should revert if the purchase status is 1", async function () {
                const { merchantcontract, MerchantSigner, BuyerAddress } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(MerchantSigner).refund(10, BuyerAddress, 1)).to.be.revertedWith(
                    "That purchase hasn't yet been paid!"
                );
            });

            it("Should revert if the purchase status is 3", async function () {
                const { merchantcontract, MerchantSigner, BuyerAddress } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(MerchantSigner).refund(10, BuyerAddress, 1)).to.be.revertedWith(
                    "That purchase has already been refunded!"
                );
            });


            it("Should revert if the totalEscrowAmount+balance < refundAmount", async function () {
                const { merchantcontract, MerchantSigner, BuyerAddress } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(MerchantSigner).refund(10, BuyerAddress, 1)).to.be.revertedWith(
                    "You don't have enough money in the smart-contract!"
                );
            });


            it("Should revert if the purchaseEscrowAmount or balance < refundAmount", async function () {
                const { merchantcontract, MerchantSigner, BuyerAddress } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(MerchantSigner).refund(10, BuyerAddress, 1)).to.be.revertedWith(
                    "Error processing refund, check your smart-contract balance!"
                );
            });
        });

        describe("Events", function () {
            it("Should emit an event on Refund", async function () {
                const { merchantcontract, MerchantSigner, BuyerAddress } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(MerchantSigner).refund(10, BuyerAddress, 1))
                    .to.emit(merchantcontract, "Refund")
                    .withArgs(anyValue, BuyerAddress, 1);
            });
        });

        describe("Refund Buyer", function () {
            it("Should refund Buyer", async function () {
                const { merchantcontract, MerchantSigner, BuyerAddress } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(MerchantSigner).refund(10, BuyerAddress, 1)).not.to.be.reverted;
            });
        });
    }); */

    describe("TopUpMyContract", function () {
        describe("Validations", function () {
            it("Should revert with the right error if called from another account", async function () {
                const { merchantcontract, OwnerSigner } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(OwnerSigner).topUpMyContract({ value: 2 })).to.be.revertedWith(
                    "Only Merchant can call this function"
                );
            });

            it("Should revert with the right error if Merchant not approved", async function () {
                const { merchantcontract, MerchantSigner } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(MerchantSigner).topUpMyContract({ value: 2 })).to.be.revertedWith(
                    "Merchant not approved!"
                );
            });

            it("Should revert with the right error if msg.value = 0", async function () {
                const { merchantcontract, MerchantSigner } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(MerchantSigner).topUpMyContract({ value: 0 })).to.be.revertedWith(
                    "Amount should be greater than 0!"
                );
            });
        });

        describe("Events", function () {
            it("Should emit an event on TopUpMyContract", async function () {
                const { merchantcontract, MerchantSigner } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(MerchantSigner).topUpMyContract({ value: 2 }))
                    .to.emit(merchantcontract, "TopUpMyContract")
                    .withArgs(anyValue, false);
            });
        });

        /* describe("Top Up Merchant Contract", function () {
            it("Should top up the Merchant Contract", async function () {
                const { merchantcontract, MerchantSigner } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.connect(MerchantSigner).topUpMyContract({ value: 2 })).not.to.be.reverted;
            });
        }); */
    });



    /* describe("Historic", function () {
        describe("Validations", function () {
            it("Should revert because it's a private function", async function () {
                const { merchantcontract, BuyerAddress } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.historic(BuyerAddress, 0)).to.be.reverted;
            });
        });

        describe("Events", function () {
            it("Should emit an event on Historic", async function () {
                const { merchantcontract, BuyerAddress } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.historic(BuyerAddress, 0))
                    .to.emit(merchantcontract, "Historic")
                    .withArgs(anyValue, anyValue, anyValue);
            });
        });

        describe("Save the Historic of the Merchant Contract", function () {
            it("Should save the historic of the Merchant Contract", async function () {
                const { merchantcontract, BuyerAddress } = await loadFixture(deployMerchantContract);

                await expect(merchantcontract.historic(BuyerAddress, 0)).not.to.be.reverted;
            });
        });
    }); */
});
