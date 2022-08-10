import { newMockEvent } from "matchstick-as"
import { ethereum, Address } from "@graphprotocol/graph-ts"
import {
  ApprovedMerchantContract,
  CreateMerchantContract,
  PausedMerchantContract
} from "../generated/MainContract/MainContract"

export function createApprovedMerchantContractEvent(
  MerchantContractAddress: Address,
  Approved: boolean
): ApprovedMerchantContract {
  let approvedMerchantContractEvent = changetype<ApprovedMerchantContract>(
    newMockEvent()
  )

  approvedMerchantContractEvent.parameters = new Array()

  approvedMerchantContractEvent.parameters.push(
    new ethereum.EventParam(
      "MerchantContractAddress",
      ethereum.Value.fromAddress(MerchantContractAddress)
    )
  )
  approvedMerchantContractEvent.parameters.push(
    new ethereum.EventParam("Approved", ethereum.Value.fromBoolean(Approved))
  )

  return approvedMerchantContractEvent
}

export function createCreateMerchantContractEvent(
  MerchantContractAddress: Address,
  MerchantAddress: Address,
  MerchantName: string
): CreateMerchantContract {
  let createMerchantContractEvent = changetype<CreateMerchantContract>(
    newMockEvent()
  )

  createMerchantContractEvent.parameters = new Array()

  createMerchantContractEvent.parameters.push(
    new ethereum.EventParam(
      "MerchantContractAddress",
      ethereum.Value.fromAddress(MerchantContractAddress)
    )
  )
  createMerchantContractEvent.parameters.push(
    new ethereum.EventParam(
      "MerchantAddress",
      ethereum.Value.fromAddress(MerchantAddress)
    )
  )
  createMerchantContractEvent.parameters.push(
    new ethereum.EventParam(
      "MerchantName",
      ethereum.Value.fromString(MerchantName)
    )
  )

  return createMerchantContractEvent
}

export function createPausedMerchantContractEvent(
  MerchantContractAddress: Address,
  Paused: boolean
): PausedMerchantContract {
  let pausedMerchantContractEvent = changetype<PausedMerchantContract>(
    newMockEvent()
  )

  pausedMerchantContractEvent.parameters = new Array()

  pausedMerchantContractEvent.parameters.push(
    new ethereum.EventParam(
      "MerchantContractAddress",
      ethereum.Value.fromAddress(MerchantContractAddress)
    )
  )
  pausedMerchantContractEvent.parameters.push(
    new ethereum.EventParam("Paused", ethereum.Value.fromBoolean(Paused))
  )

  return pausedMerchantContractEvent
}
