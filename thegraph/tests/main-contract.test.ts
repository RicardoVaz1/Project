import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { ApprovedMerchantContract } from "../generated/schema"
import { ApprovedMerchantContract as ApprovedMerchantContractEvent } from "../generated/MainContract/MainContract"
import { handleApprovedMerchantContract } from "../src/main-contract"
import { createApprovedMerchantContractEvent } from "./main-contract-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let MerchantContractAddress = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let MerchantName = "Example string value"
    let Approved = "boolean Not implemented"
    let newApprovedMerchantContractEvent = createApprovedMerchantContractEvent(
      MerchantContractAddress,
      MerchantName,
      Approved
    )
    handleApprovedMerchantContract(newApprovedMerchantContractEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("ApprovedMerchantContract created and stored", () => {
    assert.entityCount("ApprovedMerchantContract", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "ApprovedMerchantContract",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "MerchantContractAddress",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "ApprovedMerchantContract",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "MerchantName",
      "Example string value"
    )
    assert.fieldEquals(
      "ApprovedMerchantContract",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "Approved",
      "boolean Not implemented"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
