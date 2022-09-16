const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs")
const { expect } = require("chai")


describe("MainContract:", () => {
    async function deployMainContract() {
        const [OwnerSigner, MerchantSigner, OtherSigner] = await ethers.getSigners()
        const OwnerAddress = OwnerSigner.address
        const MerchantAddress = MerchantSigner.address
        const OtherAddress = OtherSigner.address
        const MerchantName = "Test"

        const MainContract = await ethers.getContractFactory("MainContract")
        const maincontract = await MainContract.deploy()

        const MerchantContractAddress = "0xCE0C00dA6f172A9214FE28362da2fbBcf08838Ff"

        return { OwnerSigner, MerchantSigner, OtherSigner, OwnerAddress, MerchantAddress, OtherAddress, MerchantName, maincontract, MerchantContractAddress }
    }

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            const { maincontract, OwnerSigner, OwnerAddress } = await loadFixture(deployMainContract)
            expect(await maincontract.connect(OwnerSigner).getOwnerAddress()).to.equal(OwnerAddress)
        })
    })

    describe("CreateMerchantContract", function () {
        describe("Validations", function () {
            it("Should revert with the right error if called from another account", async function () {
                const { maincontract, MerchantSigner, MerchantAddress, MerchantName } = await loadFixture(deployMainContract)
                expect(maincontract.connect(MerchantSigner).createMerchantContract(MerchantAddress, MerchantName)).to.be.revertedWith("Only Owner can call this function")
            })
        })

        describe("Events", function () {
            it("Should emit an event on CreatedMerchantContract", async function () {
                const { maincontract, OwnerSigner, MerchantAddress, MerchantName } = await loadFixture(deployMainContract)
                expect(maincontract.connect(OwnerSigner).createMerchantContract(MerchantAddress, MerchantName)).to.emit(maincontract, "CreatedMerchantContract").withArgs(anyValue, MerchantAddress, MerchantName)
            })
        })

        describe("Create Merchant Contract", function () {
            it("Should create a new Merchant Contract", async function () {
                const { maincontract, OwnerSigner, MerchantAddress, MerchantName } = await loadFixture(deployMainContract)
                expect(maincontract.connect(OwnerSigner).createMerchantContract(MerchantAddress, MerchantName)).not.to.be.reverted
            })
        })
    })

    describe("VoteNewMerchantContractApproval", function () {
        describe("Validations", function () {
            it("Should revert if the MerchantContract staus is 0", async function () {
                const { maincontract, OwnerSigner, MerchantContractAddress } = await loadFixture(deployMainContract)
                expect(maincontract.connect(OwnerSigner).voteNewMerchantContractApproval(MerchantContractAddress)).to.be.revertedWith("Merchant doesn't exist!")
            })

            it("Shouldn't fail if the MerchantContract staus is 1", async function () {
                const { maincontract, OwnerSigner, MerchantContractAddress } = await loadFixture(deployMainContract)
                expect(maincontract.connect(OwnerSigner).voteNewMerchantContractApproval(MerchantContractAddress)).not.to.be.reverted
            })

            it("Should revert if the MerchantContract staus is 2", async function () {
                const { maincontract, OwnerSigner, MerchantSigner, OtherSigner, MerchantContractAddress } = await loadFixture(deployMainContract)
                expect(maincontract.connect(OwnerSigner).voteNewMerchantContractApproval(MerchantContractAddress)).not.to.be.reverted
                expect(maincontract.connect(MerchantSigner).voteNewMerchantContractApproval(MerchantContractAddress)).not.to.be.reverted
                expect(maincontract.connect(OtherSigner).voteNewMerchantContractApproval(MerchantContractAddress)).not.to.be.reverted
                expect(maincontract.connect(OwnerSigner).voteNewMerchantContractApproval(MerchantContractAddress)).to.be.revertedWith("Merchant has already been approved!")
            })
        })

        describe("Events", function () {
            it("Should revert if the MerchantContract staus is 2", async function () {
                const { maincontract, OwnerSigner, MerchantSigner, OtherSigner, OtherAddress, MerchantContractAddress } = await loadFixture(deployMainContract)
                expect(maincontract.connect(OwnerSigner).voteNewMerchantContractApproval(MerchantContractAddress)).not.to.be.reverted
                expect(maincontract.connect(MerchantSigner).voteNewMerchantContractApproval(MerchantContractAddress)).not.to.be.reverted
                expect(maincontract.connect(OtherSigner).voteNewMerchantContractApproval(MerchantContractAddress)).not.to.be.reverted
                expect(maincontract.connect(OtherSigner).voteNewMerchantContractApproval(MerchantContractAddress)).to.emit(maincontract, "VoteNewMerchantContract").withArgs(OtherAddress, MerchantContractAddress)
            })
        })

        describe("Vote New Merchant Contract Approval", function () {
            it("Should vote in new Merchant Contract", async function () {
                const { maincontract, OtherSigner, MerchantContractAddress } = await loadFixture(deployMainContract)
                expect(maincontract.connect(OtherSigner).voteNewMerchantContractApproval(MerchantContractAddress)).not.to.be.reverted
            })
        })
    })

    describe("FreezeWithdrawalsMerchantContract", function () {
        describe("Validations", function () {
            it("Should revert with the right error if called from another account", async function () {
                const { maincontract, MerchantSigner, MerchantContractAddress } = await loadFixture(deployMainContract)
                expect(maincontract.connect(MerchantSigner).freezeWithdrawalsMerchantContract(MerchantContractAddress)).to.be.revertedWith("Only Owner can call this function")
            })

            it("Should revert if the withdrawals are paused", async function () {
                const { maincontract, OwnerSigner, MerchantContractAddress } = await loadFixture(deployMainContract)
                expect(maincontract.connect(OwnerSigner).freezeWithdrawalsMerchantContract(MerchantContractAddress)).to.be.reverted
            })

            it("Shouldn't fail if the withdrawals are unpaused", async function () {
                const { maincontract, OwnerSigner, MerchantContractAddress } = await loadFixture(deployMainContract)
                expect(maincontract.connect(OwnerSigner).freezeWithdrawalsMerchantContract(MerchantContractAddress)).not.to.be.reverted
            })
        })

        describe("Events", function () {
            it("Should emit an event on PausedMerchantContract", async function () {
                const { maincontract, OwnerSigner, MerchantContractAddress } = await loadFixture(deployMainContract)
                expect(maincontract.connect(OwnerSigner).freezeWithdrawalsMerchantContract(MerchantContractAddress)).to.emit(maincontract, "PausedMerchantContract").withArgs(anyValue, true)
            })
        })

        describe("Freeze Withdrawals Merchant Contract", function () {
            it("Should freeze withdrawals of the Merchant Contract", async function () {
                const { maincontract, OwnerSigner, MerchantContractAddress } = await loadFixture(deployMainContract)
                expect(maincontract.connect(OwnerSigner).freezeWithdrawalsMerchantContract(MerchantContractAddress)).not.to.be.reverted
            })
        })
    })

    describe("UnfreezeWithdrawalsMerchantContract", function () {
        describe("Validations", function () {
            it("Should revert with the right error if called from another account", async function () {
                const { maincontract, MerchantSigner, MerchantContractAddress } = await loadFixture(deployMainContract)
                expect(maincontract.connect(MerchantSigner).unfreezeWithdrawalsMerchantContract(MerchantContractAddress)).to.be.revertedWith("Only Owner can call this function")
            })

            it("Should revert if the withdrawals are unpaused", async function () {
                const { maincontract, OwnerSigner, MerchantContractAddress } = await loadFixture(deployMainContract)
                expect(maincontract.connect(OwnerSigner).unfreezeWithdrawalsMerchantContract(MerchantContractAddress)).to.be.reverted
            })

            it("Shouldn't fail if the withdrawals are paused", async function () {
                const { maincontract, OwnerSigner, MerchantContractAddress } = await loadFixture(deployMainContract)
                expect(maincontract.connect(OwnerSigner).unfreezeWithdrawalsMerchantContract(MerchantContractAddress)).not.to.be.reverted
            })
        })

        describe("Events", function () {
            it("Should emit an event on PausedMerchantContract", async function () {
                const { maincontract, OwnerSigner, MerchantContractAddress } = await loadFixture(deployMainContract)
                expect(maincontract.connect(OwnerSigner).unfreezeWithdrawalsMerchantContract(MerchantContractAddress)).to.emit(maincontract, "PausedMerchantContract").withArgs(anyValue, false)
            })
        })

        describe("Unfreeze Withdrawals Merchant Contract", function () {
            it("Should unfreeze withdrawals of the Merchant Contract", async function () {
                const { maincontract, OwnerSigner, MerchantContractAddress } = await loadFixture(deployMainContract)
                expect(maincontract.connect(OwnerSigner).unfreezeWithdrawalsMerchantContract(MerchantContractAddress)).not.to.be.reverted
            })
        })
    })

    describe("DisapproveMerchantContract", function () {
        describe("Validations", function () {
            it("Should revert with the right error if called from another account", async function () {
                const { maincontract, MerchantSigner, MerchantContractAddress } = await loadFixture(deployMainContract)
                expect(maincontract.connect(MerchantSigner).disapproveMerchantContract(MerchantContractAddress)).to.be.revertedWith("Only Owner can call this function")
            })

            it("Should revert with the right error if not approved", async function () {
                const { maincontract, OwnerSigner, MerchantContractAddress } = await loadFixture(deployMainContract)
                expect(maincontract.connect(OwnerSigner).disapproveMerchantContract(MerchantContractAddress)).to.be.revertedWith("This address isn't approved!")
            })

            it("Shouldn't fail if it's approved", async function () {
                const { maincontract, OwnerSigner, MerchantContractAddress } = await loadFixture(deployMainContract)
                expect(maincontract.connect(OwnerSigner).disapproveMerchantContract(MerchantContractAddress)).not.to.be.reverted
            })
        })

        describe("Events", function () {
            it("Should emit an event on ApprovedMerchantContract", async function () {
                const { maincontract, OwnerSigner, MerchantContractAddress, MerchantName } = await loadFixture(deployMainContract)
                expect(maincontract.connect(OwnerSigner).disapproveMerchantContract(MerchantContractAddress)).to.emit(maincontract, "ApprovedMerchantContract").withArgs(MerchantContractAddress, MerchantName, false)
            })
        })

        describe("Disapprove Merchant Contract", function () {
            it("Should disapprove Merchant Contract", async function () {
                const { maincontract, OwnerSigner, MerchantContractAddress } = await loadFixture(deployMainContract)
                expect(maincontract.connect(OwnerSigner).disapproveMerchantContract(MerchantContractAddress)).not.to.be.reverted
            })
        })
    })
})
