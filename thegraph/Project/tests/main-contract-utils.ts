import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  ApprovedMerchantContract,
  Buy,
  Complete,
  CreatePurchase,
  CreatedMerchantContract,
  Historic,
  PausedMerchantContract,
  Refund,
  TopUpMyContract,
  VoteNewMerchantContract,
  Withdrawal
} from "../generated/MainContract/MainContract"

export function createApprovedMerchantContractEvent(
  MerchantContractAddress: Address,
  MerchantName: string,
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
    new ethereum.EventParam(
      "MerchantName",
      ethereum.Value.fromString(MerchantName)
    )
  )
  approvedMerchantContractEvent.parameters.push(
    new ethereum.EventParam("Approved", ethereum.Value.fromBoolean(Approved))
  )

  return approvedMerchantContractEvent
}

export function createBuyEvent(
  MerchantContractAddress: Address,
  IDPurchase: BigInt,
  DateFinished: BigInt,
  BuyerAddress: Address,
  PurchaseAmount: BigInt,
  PurchaseStatus: BigInt
): Buy {
  let buyEvent = changetype<Buy>(newMockEvent())

  buyEvent.parameters = new Array()

  buyEvent.parameters.push(
    new ethereum.EventParam(
      "MerchantContractAddress",
      ethereum.Value.fromAddress(MerchantContractAddress)
    )
  )
  buyEvent.parameters.push(
    new ethereum.EventParam(
      "IDPurchase",
      ethereum.Value.fromUnsignedBigInt(IDPurchase)
    )
  )
  buyEvent.parameters.push(
    new ethereum.EventParam(
      "DateFinished",
      ethereum.Value.fromUnsignedBigInt(DateFinished)
    )
  )
  buyEvent.parameters.push(
    new ethereum.EventParam(
      "BuyerAddress",
      ethereum.Value.fromAddress(BuyerAddress)
    )
  )
  buyEvent.parameters.push(
    new ethereum.EventParam(
      "PurchaseAmount",
      ethereum.Value.fromUnsignedBigInt(PurchaseAmount)
    )
  )
  buyEvent.parameters.push(
    new ethereum.EventParam(
      "PurchaseStatus",
      ethereum.Value.fromUnsignedBigInt(PurchaseStatus)
    )
  )

  return buyEvent
}

export function createCompleteEvent(
  MerchantContractAddress: Address,
  IDPurchase: BigInt
): Complete {
  let completeEvent = changetype<Complete>(newMockEvent())

  completeEvent.parameters = new Array()

  completeEvent.parameters.push(
    new ethereum.EventParam(
      "MerchantContractAddress",
      ethereum.Value.fromAddress(MerchantContractAddress)
    )
  )
  completeEvent.parameters.push(
    new ethereum.EventParam(
      "IDPurchase",
      ethereum.Value.fromUnsignedBigInt(IDPurchase)
    )
  )

  return completeEvent
}

export function createCreatePurchaseEvent(
  MerchantContractAddress: Address,
  IDPurchase: BigInt,
  DateCreated: BigInt,
  PurchaseAmount: BigInt,
  EscrowTime: BigInt,
  PurchaseStatus: BigInt
): CreatePurchase {
  let createPurchaseEvent = changetype<CreatePurchase>(newMockEvent())

  createPurchaseEvent.parameters = new Array()

  createPurchaseEvent.parameters.push(
    new ethereum.EventParam(
      "MerchantContractAddress",
      ethereum.Value.fromAddress(MerchantContractAddress)
    )
  )
  createPurchaseEvent.parameters.push(
    new ethereum.EventParam(
      "IDPurchase",
      ethereum.Value.fromUnsignedBigInt(IDPurchase)
    )
  )
  createPurchaseEvent.parameters.push(
    new ethereum.EventParam(
      "DateCreated",
      ethereum.Value.fromUnsignedBigInt(DateCreated)
    )
  )
  createPurchaseEvent.parameters.push(
    new ethereum.EventParam(
      "PurchaseAmount",
      ethereum.Value.fromUnsignedBigInt(PurchaseAmount)
    )
  )
  createPurchaseEvent.parameters.push(
    new ethereum.EventParam(
      "EscrowTime",
      ethereum.Value.fromUnsignedBigInt(EscrowTime)
    )
  )
  createPurchaseEvent.parameters.push(
    new ethereum.EventParam(
      "PurchaseStatus",
      ethereum.Value.fromUnsignedBigInt(PurchaseStatus)
    )
  )

  return createPurchaseEvent
}

export function createCreatedMerchantContractEvent(
  MerchantContractAddress: Address,
  MerchantAddress: Address,
  MerchantName: string
): CreatedMerchantContract {
  let createdMerchantContractEvent = changetype<CreatedMerchantContract>(
    newMockEvent()
  )

  createdMerchantContractEvent.parameters = new Array()

  createdMerchantContractEvent.parameters.push(
    new ethereum.EventParam(
      "MerchantContractAddress",
      ethereum.Value.fromAddress(MerchantContractAddress)
    )
  )
  createdMerchantContractEvent.parameters.push(
    new ethereum.EventParam(
      "MerchantAddress",
      ethereum.Value.fromAddress(MerchantAddress)
    )
  )
  createdMerchantContractEvent.parameters.push(
    new ethereum.EventParam(
      "MerchantName",
      ethereum.Value.fromString(MerchantName)
    )
  )

  return createdMerchantContractEvent
}

export function createHistoricEvent(
  MerchantContractAddress: Address,
  Sells: BigInt,
  Refunds: BigInt
): Historic {
  let historicEvent = changetype<Historic>(newMockEvent())

  historicEvent.parameters = new Array()

  historicEvent.parameters.push(
    new ethereum.EventParam(
      "MerchantContractAddress",
      ethereum.Value.fromAddress(MerchantContractAddress)
    )
  )
  historicEvent.parameters.push(
    new ethereum.EventParam("Sells", ethereum.Value.fromUnsignedBigInt(Sells))
  )
  historicEvent.parameters.push(
    new ethereum.EventParam(
      "Refunds",
      ethereum.Value.fromUnsignedBigInt(Refunds)
    )
  )

  return historicEvent
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

export function createRefundEvent(
  MerchantContractAddress: Address,
  IDPurchase: BigInt,
  Date: BigInt,
  BuyerAddress: Address,
  RefundAmount: BigInt,
  PurchaseStatus: BigInt
): Refund {
  let refundEvent = changetype<Refund>(newMockEvent())

  refundEvent.parameters = new Array()

  refundEvent.parameters.push(
    new ethereum.EventParam(
      "MerchantContractAddress",
      ethereum.Value.fromAddress(MerchantContractAddress)
    )
  )
  refundEvent.parameters.push(
    new ethereum.EventParam(
      "IDPurchase",
      ethereum.Value.fromUnsignedBigInt(IDPurchase)
    )
  )
  refundEvent.parameters.push(
    new ethereum.EventParam("Date", ethereum.Value.fromUnsignedBigInt(Date))
  )
  refundEvent.parameters.push(
    new ethereum.EventParam(
      "BuyerAddress",
      ethereum.Value.fromAddress(BuyerAddress)
    )
  )
  refundEvent.parameters.push(
    new ethereum.EventParam(
      "RefundAmount",
      ethereum.Value.fromUnsignedBigInt(RefundAmount)
    )
  )
  refundEvent.parameters.push(
    new ethereum.EventParam(
      "PurchaseStatus",
      ethereum.Value.fromUnsignedBigInt(PurchaseStatus)
    )
  )

  return refundEvent
}

export function createTopUpMyContractEvent(
  MerchantContractAddress: Address,
  Amount: BigInt
): TopUpMyContract {
  let topUpMyContractEvent = changetype<TopUpMyContract>(newMockEvent())

  topUpMyContractEvent.parameters = new Array()

  topUpMyContractEvent.parameters.push(
    new ethereum.EventParam(
      "MerchantContractAddress",
      ethereum.Value.fromAddress(MerchantContractAddress)
    )
  )
  topUpMyContractEvent.parameters.push(
    new ethereum.EventParam("Amount", ethereum.Value.fromUnsignedBigInt(Amount))
  )

  return topUpMyContractEvent
}

export function createVoteNewMerchantContractEvent(
  Voter: Address,
  MerchantContractAddress: Address
): VoteNewMerchantContract {
  let voteNewMerchantContractEvent = changetype<VoteNewMerchantContract>(
    newMockEvent()
  )

  voteNewMerchantContractEvent.parameters = new Array()

  voteNewMerchantContractEvent.parameters.push(
    new ethereum.EventParam("Voter", ethereum.Value.fromAddress(Voter))
  )
  voteNewMerchantContractEvent.parameters.push(
    new ethereum.EventParam(
      "MerchantContractAddress",
      ethereum.Value.fromAddress(MerchantContractAddress)
    )
  )

  return voteNewMerchantContractEvent
}

export function createWithdrawalEvent(
  MerchantContractAddress: Address,
  Balance: BigInt
): Withdrawal {
  let withdrawalEvent = changetype<Withdrawal>(newMockEvent())

  withdrawalEvent.parameters = new Array()

  withdrawalEvent.parameters.push(
    new ethereum.EventParam(
      "MerchantContractAddress",
      ethereum.Value.fromAddress(MerchantContractAddress)
    )
  )
  withdrawalEvent.parameters.push(
    new ethereum.EventParam(
      "Balance",
      ethereum.Value.fromUnsignedBigInt(Balance)
    )
  )

  return withdrawalEvent
}
