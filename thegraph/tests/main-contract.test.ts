import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { ApproveMerchantContract } from "../generated/schema"
import { ApproveMerchantContract as ApproveMerchantContractEvent } from "../generated/MainContract/MainContract"
import { handleApproveMerchantContract } from "../src/main-contract"
import { createApproveMerchantContractEvent } from "./main-contract-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let contractInstance = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newApproveMerchantContractEvent = createApproveMerchantContractEvent(
      contractInstance
    )
    handleApproveMerchantContract(newApproveMerchantContractEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("ApproveMerchantContract created and stored", () => {
    assert.entityCount("ApproveMerchantContract", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "ApproveMerchantContract",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "contractInstance",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
