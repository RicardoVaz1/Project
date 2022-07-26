// const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
require("dotenv").config();

describe("MerchantContract:", () => {
    let OwnerAddress = process.env.OWNER_ADDRESS
    let MerchantAddress = process.env.MERCHANT_ADDRESS
    let MerchantName = process.env.MERCHANT_NAME
    let BuyerAddress = process.env.BUYER_ADDRESS

    let MerchantContract
    let merchantcontract

    deployMerchantContract()

    async function deployMerchantContract() {
        MerchantContract = await ethers.getContractFactory("MerchantContract")
        merchantcontract = await MerchantContract.deploy(/* OwnerAddress, */ MerchantAddress, MerchantName) // .call({from: OwnerAddress})
        // merchantcontract = await MerchantContract.connect(OwnerAddress).deploy(/* OwnerAddress, */ MerchantAddress, MerchantName) // .call({from: OwnerAddress})
    }

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await merchantcontract.owner()).to.equal(OwnerAddress);
        });
    });

    describe("CheckMyAddress", function () {
        describe("Validations", function () {
            it("Should revert with the right error if called from another account", async function () {
                await expect(merchantcontract.connect(OwnerAddress).checkMyAddress()).to.be.revertedWith(
                    "Only Merchant can call this function"
                );
            });

            it("Should revert with the right error if Merchant not approved", async function () {
                await expect(merchantcontract.connect(MerchantAddress).checkMyAddress()).to.be.revertedWith(
                    "Merchant not approved!"
                );
            });
        });

        describe("Check Merchant Address", function () {
            it("Should return the Merchant Address", async function () {
                await expect(merchantcontract.connect(MerchantAddress).checkMyAddress()).to.equal(MerchantAddress);
            });
        });
    });

    describe("ChangeMyAddress", function () {
        describe("Validations", function () {
            it("Should revert with the right error if called from another account", async function () {
                await expect(merchantcontract.connect(OwnerAddress).changeMyAddress(OwnerAddress)).to.be.revertedWith(
                    "Only Merchant can call this function"
                );
            });

            it("Should revert with the right error if Merchant not approved", async function () {
                await expect(merchantcontract.connect(MerchantAddress).changeMyAddress(OwnerAddress)).to.be.revertedWith(
                    "Merchant not approved!"
                );
            });
        });

        /* describe("Change Merchant Address", function () {
            it("Should change Merchant Address", async function () {
                await expect(merchantcontract.connect(MerchantAddress).changeMyAddress(OwnerAddress)).not.to.be.reverted;
            });
        }); */
    });

    describe("CheckMyName", function () {
        describe("Validations", function () {
            it("Should revert with the right error if called from another account", async function () {
                await expect(merchantcontract.connect(OwnerAddress).checkMyName()).to.be.revertedWith(
                    "Only Merchant can call this function"
                );
            });

            it("Should revert with the right error if Merchant not approved", async function () {
                await expect(merchantcontract.connect(MerchantAddress).checkMyName()).to.be.revertedWith(
                    "Merchant not approved!"
                );
            });
        });

        describe("Check Merchant Name", function () {
            it("Should return the Merchant Name", async function () {
                await expect(merchantcontract.connect(MerchantAddress).checkMyName()).to.equal(MerchantName);
            });
        });
    });

    describe("CheckMyEscrowAmount", function () {
        describe("Validations", function () {
            it("Should revert with the right error if called from another account", async function () {
                await expect(merchantcontract.connect(OwnerAddress).checkMyEscrowAmount()).to.be.revertedWith(
                    "Only Merchant can call this function"
                );
            });

            it("Should revert with the right error if Merchant not approved", async function () {
                await expect(merchantcontract.connect(MerchantAddress).checkMyEscrowAmount()).to.be.revertedWith(
                    "Merchant not approved!"
                );
            });
        });

        describe("Check Merchant Escrow Amount", function () {
            it("Should return the Merchant Escrow Amount", async function () {
                await expect(merchantcontract.connect(MerchantAddress).checkMyEscrowAmount()).to.equal(0);
            });
        });
    });

    describe("CheckMyBalance", function () {
        describe("Validations", function () {
            it("Should revert with the right error if called from another account", async function () {
                await expect(merchantcontract.connect(OwnerAddress).checkMyBalance()).to.be.revertedWith(
                    "Only Merchant can call this function"
                );
            });

            it("Should revert with the right error if Merchant not approved", async function () {
                await expect(merchantcontract.connect(MerchantAddress).checkMyBalance()).to.be.revertedWith(
                    "Merchant not approved!"
                );
            });
        });

        describe("Check Merchant Balance", function () {
            it("Should return the Merchant Balance", async function () {
                await expect(merchantcontract.connect(MerchantAddress).checkMyBalance()).to.equal(0);
            });
        });
    });



    /* ----- Purchase Flow ----- */
    describe("CreatePurchase", function () {
        describe("Validations", function () {
            it("Should revert with the right error if called from another account", async function () {
                await expect(merchantcontract.connect(OwnerAddress).createPurchase(10, 2, 1234)).to.be.revertedWith(
                    "Only Merchant can call this function"
                );
            });

            it("Should revert with the right error if Merchant not approved", async function () {
                await expect(merchantcontract.connect(MerchantAddress).createPurchase(10, 2, 1234)).to.be.revertedWith(
                    "Merchant not approved!"
                );
            });
        });

        describe("Events", function () {
            it("Should emit an event on CreatePurchase", async function () {
                await expect(merchantcontract.connect(MerchantAddress).createPurchase(10, 2, 1234))
                    .to.emit(merchantcontract, "CreatePurchase")
                    .withArgs(anyValue, 2, 1234);
            });
        });

        describe("Create a new Purchase", function () {
            it("Should create a new Purchase", async function () {
                await expect(merchantcontract.connect(MerchantAddress).createPurchase(10, 2, 1234)).not.to.be.reverted;
            });
        });
    });

    describe("Buy", function () {
        describe("Validations", function () {
            it("Should revert with the right error if Merchant not approved", async function () {
                await expect(merchantcontract.connect(MerchantAddress).buy(10, { value: 2 })).to.be.revertedWith(
                    "Merchant not approved!"
                );
            });

            it("Should revert if the msg.value is 0", async function () {
                await expect(merchantcontract.connect(MerchantAddress).buy(10, { value: 0 })).to.be.revertedWith(
                    "Amount should be greater than 0!"
                );
            });

            it("Should revert if the purchase status is 0", async function () {
                await expect(merchantcontract.connect(MerchantAddress).buy(10, { value: 2 })).to.be.revertedWith(
                    "The purchase doesn't exist!"
                );
            });

            it("Should revert if the purchase status is 2", async function () {
                await expect(merchantcontract.connect(MerchantAddress).buy(10, { value: 2 })).to.be.revertedWith(
                    "The purchase has already been paid!"
                );
            });

            it("Should revert if the purchase status is 3", async function () {
                await expect(merchantcontract.connect(MerchantAddress).buy(10, { value: 2 })).to.be.revertedWith(
                    "The purchase has already been refunded!"
                );
            });

            it("Should revert if the msg.value is different of purchase amount", async function () {
                await expect(merchantcontract.connect(MerchantAddress).buy(10, { value: 1 })).to.be.revertedWith(
                    "Wrong amount!"
                );
            });
        });

        describe("Events", function () {
            it("Should emit an event on Buy", async function () {
                await expect(merchantcontract.buy(10, { value: 2 }))
                    .to.emit(merchantcontract, "Buy")
                    .withArgs(10, anyValue, BuyerAddress, anyValue, 2);
            });
        });

        describe("Buy a product", function () {
            it("Should buy a product", async function () {
                await expect(merchantcontract.buy(10, { value: 2 })).not.to.be.reverted;
            });
        });
    });

    describe("Complete", function () {
        describe("Validations", function () {
            it("Should revert with the right error if called from another account", async function () {
                await expect(merchantcontract.connect(OwnerAddress).complete(10)).to.be.revertedWith(
                    "Only Merchant can call this function"
                );
            });

            it("Should revert with the right error if Merchant not approved", async function () {
                await expect(merchantcontract.connect(MerchantAddress).complete(10)).to.be.revertedWith(
                    "Merchant not approved!"
                );
            });

            it("Should revert if purchase is still on escrow time", async function () { // ??
                await expect(merchantcontract.connect(MerchantAddress).complete(10)).to.be.revertedWith(
                    "The escrow time of this purchase isn't over yet"
                );
            });
        });

        describe("Events", function () {
            it("Should emit an event on Complete", async function () {
                await expect(merchantcontract.connect(MerchantAddress).complete(10))
                    .to.emit(merchantcontract, "Complete")
                    .withArgs(10);
            });
        });

        describe("Change a purchase to complete", function () {
            it("Should change a purchase to complete", async function () {
                await expect(merchantcontract.connect(MerchantAddress).complete(10)).not.to.be.reverted;
            });
        });
    });

    describe("Withdrawal", function () {
        describe("Validations", function () {
            it("Should revert with the right error if called from another account", async function () {
                await expect(merchantcontract.connect(OwnerAddress).withdrawal()).to.be.revertedWith(
                    "Only Merchant can call this function"
                );
            });

            it("Should revert with the right error if Merchant not approved", async function () {
                await expect(merchantcontract.connect(MerchantAddress).withdrawal()).to.be.revertedWith(
                    "Merchant not approved!"
                );
            });

            it("Should revert with the right error if balance not be greater than 0", async function () {
                await expect(merchantcontract.connect(MerchantAddress).withdrawal()).to.be.revertedWith(
                    "Balance should be greater than 0!!"
                );
            });

            it("Should revert if the withdrawals are paused", async function () {
                await expect(merchantcontract.connect(MerchantAddress).withdrawal()).to.be.revertedWith(
                    "Withdrawals are paused!"
                );
            });

            it("Shouldn't fail if the withdrawals are unpaused", async function () {
                await expect(merchantcontract.connect(MerchantAddress).withdrawal()).not.to.be.reverted;
            });
        });

        describe("Events", function () {
            it("Should emit an event on Withdrawal", async function () {
                await expect(merchantcontract.connect(MerchantAddress).withdrawal())
                    .to.emit(merchantcontract, "Withdrawal")
                    .withArgs(anyValue, anyValue);
            });
        });

        describe("Withdrawal the money to Merchant Address", function () {
            it("Should withdrawal the money to Merchant Address", async function () {
                await expect(merchantcontract.connect(MerchantAddress).withdrawal()).not.to.be.reverted;
            });
        });
    });

    describe("Refund", function () {
        describe("Validations", function () {
            /* ----- Modifiers ----- */
            it("Should revert with the right error if called from another account", async function () {
                await expect(merchantcontract.connect(OwnerAddress).refund(10, BuyerAddress, 1)).to.be.revertedWith(
                    "Only Merchant can call this function"
                );
            });

            it("Should revert with the right error if Merchant not approved", async function () {
                await expect(merchantcontract.connect(MerchantAddress).refund(10, BuyerAddress, 1)).to.be.revertedWith(
                    "Merchant not approved!"
                );
            });

            it("Should revert if the withdrawals are paused", async function () {
                await expect(merchantcontract.connect(MerchantAddress).refund(10, BuyerAddress, 1)).to.be.revertedWith(
                    "Withdrawals are paused!"
                );
            });

            it("Shouldn't fail if the withdrawals are unpaused", async function () {
                await expect(merchantcontract.connect(MerchantAddress).refund(10, BuyerAddress, 1)).not.to.be.reverted;
            });
            /* --------------------- */


            it("Should revert if the refundAmount not greater than 0", async function () {
                await expect(merchantcontract.connect(MerchantAddress).refund(10, BuyerAddress, 0)).to.be.revertedWith(
                    "Refund amount should be greater than 0!!"
                );
            });

            it("Should revert if the refundAmount is greater than purchase amount", async function () {
                await expect(merchantcontract.connect(MerchantAddress).refund(10, BuyerAddress, 3)).to.be.revertedWith(
                    "Refund amount shouldn't be greater than the purchaseAmount!"
                );
            });


            it("Should revert if the purchase status is 0", async function () {
                await expect(merchantcontract.connect(MerchantAddress).refund(10, BuyerAddress, 1)).to.be.revertedWith(
                    "The purchase doesn't exist!"
                );
            });

            it("Should revert if the purchase status is 1", async function () {
                await expect(merchantcontract.connect(MerchantAddress).refund(10, BuyerAddress, 1)).to.be.revertedWith(
                    "That purchase hasn't yet been paid!"
                );
            });

            it("Should revert if the purchase status is 3", async function () {
                await expect(merchantcontract.connect(MerchantAddress).refund(10, BuyerAddress, 1)).to.be.revertedWith(
                    "That purchase has already been refunded!"
                );
            });

            
            it("Should revert if the totalEscrowAmount+balance < refundAmount", async function () {
                await expect(merchantcontract.connect(MerchantAddress).refund(10, BuyerAddress, 1)).to.be.revertedWith(
                    "You don't have enough money in the smart-contract!"
                );
            });


            it("Should revert if the purchaseEscrowAmount or balance < refundAmount", async function () {
                await expect(merchantcontract.connect(MerchantAddress).refund(10, BuyerAddress, 1)).to.be.revertedWith(
                    "Error processing refund, check your smart-contract balance!"
                );
            });
        });

        describe("Events", function () {
            it("Should emit an event on Refund", async function () {
                await expect(merchantcontract.connect(MerchantAddress).refund(10, BuyerAddress, 1))
                    .to.emit(merchantcontract, "Refund")
                    .withArgs(anyValue, BuyerAddress, 1);
            });
        });

        describe("Refund Buyer", function () {
            it("Should refund Buyer", async function () {
                await expect(merchantcontract.connect(MerchantAddress).refund(10, BuyerAddress, 1)).not.to.be.reverted;
            });
        });
    });

    describe("TopUpMyContract", function () {
        describe("Validations", function () {
            it("Should revert with the right error if called from another account", async function () {
                await expect(merchantcontract.connect(OwnerAddress).topUpMyContract({ value: 2 })).to.be.revertedWith(
                    "Only Merchant can call this function"
                );
            });

            it("Should revert with the right error if Merchant not approved", async function () {
                await expect(merchantcontract.connect(MerchantAddress).topUpMyContract({ value: 2 })).to.be.revertedWith(
                    "Merchant not approved!"
                );
            });

            it("Should revert with the right error if msg.value = 0", async function () {
                await expect(merchantcontract.connect(MerchantAddress).topUpMyContract({ value: 0 })).to.be.revertedWith(
                    "Amount should be greater than 0!"
                );
            });
        });

        describe("Events", function () {
            it("Should emit an event on TopUpMyContract", async function () {
                await expect(merchantcontract.connect(MerchantAddress).topUpMyContract({ value: 2 }))
                    .to.emit(merchantcontract, "TopUpMyContract")
                    .withArgs(anyValue, false);
            });
        });

        describe("Top Up Merchant Contract", function () {
            it("Should top up the Merchant Contract", async function () {
                await expect(merchantcontract.connect(MerchantAddress).topUpMyContract({ value: 2 })).not.to.be.reverted;
            });
        });
    });



    describe("Historic", function () {
        describe("Validations", function () {
            it("Should revert because it's a private function", async function () {
                await expect(merchantcontract.historic(BuyerAddress, 0)).to.be.reverted;
            });
        });

        /* describe("Events", function () {
            it("Should emit an event on Historic", async function () {
                await expect(merchantcontract.historic(BuyerAddress, 0))
                    .to.emit(merchantcontract, "Historic")
                    .withArgs(anyValue, anyValue, anyValue);
            });
        });

        describe("Save the Historic of the Merchant Contract", function () {
            it("Should save the historic of the Merchant Contract", async function () {
                await expect(merchantcontract.historic(BuyerAddress, 0)).not.to.be.reverted;
            });
        }); */
    });
});
