import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  ApprovedMerchantContract,
  CreateMerchantContract,
  NewMerchantContractApproved,
  PausedMerchantContract,
  SaveHistoric,
  VoteNewMerchantContractApproval
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
  ID: BigInt,
  MerchantContractAddress: Address,
  MerchantAddress: Address,
  MerchantName: string
): CreateMerchantContract {
  let createMerchantContractEvent = changetype<CreateMerchantContract>(
    newMockEvent()
  )

  createMerchantContractEvent.parameters = new Array()

  createMerchantContractEvent.parameters.push(
    new ethereum.EventParam("ID", ethereum.Value.fromUnsignedBigInt(ID))
  )
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

export function createNewMerchantContractApprovedEvent(
  MerchantContractAddress: Address
): NewMerchantContractApproved {
  let newMerchantContractApprovedEvent = changetype<
    NewMerchantContractApproved
  >(newMockEvent())

  newMerchantContractApprovedEvent.parameters = new Array()

  newMerchantContractApprovedEvent.parameters.push(
    new ethereum.EventParam(
      "MerchantContractAddress",
      ethereum.Value.fromAddress(MerchantContractAddress)
    )
  )

  return newMerchantContractApprovedEvent
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

export function createSaveHistoricEvent(
  MerchantContractAddress: Address,
  Sells: BigInt,
  Refunds: BigInt,
  Purchases: BigInt,
  Cancellations: BigInt
): SaveHistoric {
  let saveHistoricEvent = changetype<SaveHistoric>(newMockEvent())

  saveHistoricEvent.parameters = new Array()

  saveHistoricEvent.parameters.push(
    new ethereum.EventParam(
      "MerchantContractAddress",
      ethereum.Value.fromAddress(MerchantContractAddress)
    )
  )
  saveHistoricEvent.parameters.push(
    new ethereum.EventParam("Sells", ethereum.Value.fromUnsignedBigInt(Sells))
  )
  saveHistoricEvent.parameters.push(
    new ethereum.EventParam(
      "Refunds",
      ethereum.Value.fromUnsignedBigInt(Refunds)
    )
  )
  saveHistoricEvent.parameters.push(
    new ethereum.EventParam(
      "Purchases",
      ethereum.Value.fromUnsignedBigInt(Purchases)
    )
  )
  saveHistoricEvent.parameters.push(
    new ethereum.EventParam(
      "Cancellations",
      ethereum.Value.fromUnsignedBigInt(Cancellations)
    )
  )

  return saveHistoricEvent
}

export function createVoteNewMerchantContractApprovalEvent(
  Voter: Address,
  MerchantContractAddress: Address
): VoteNewMerchantContractApproval {
  let voteNewMerchantContractApprovalEvent = changetype<
    VoteNewMerchantContractApproval
  >(newMockEvent())

  voteNewMerchantContractApprovalEvent.parameters = new Array()

  voteNewMerchantContractApprovalEvent.parameters.push(
    new ethereum.EventParam("Voter", ethereum.Value.fromAddress(Voter))
  )
  voteNewMerchantContractApprovalEvent.parameters.push(
    new ethereum.EventParam(
      "MerchantContractAddress",
      ethereum.Value.fromAddress(MerchantContractAddress)
    )
  )

  return voteNewMerchantContractApprovalEvent
}
