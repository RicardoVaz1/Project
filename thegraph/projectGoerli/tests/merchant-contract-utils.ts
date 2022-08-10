import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  ApprovedMerchant,
  Buy,
  Complete,
  CreatePurchase,
  Historic,
  OwnershipTransferred,
  PausedWithdrawals,
  Refund,
  TopUpMyContract,
  Withdrawal
} from "../generated/MerchantContract/MerchantContract"

export function createApprovedMerchantEvent(
  MerchantContractAddress: Address,
  ApprovedMerchant: boolean
): ApprovedMerchant {
  let approvedMerchantEvent = changetype<ApprovedMerchant>(newMockEvent())

  approvedMerchantEvent.parameters = new Array()

  approvedMerchantEvent.parameters.push(
    new ethereum.EventParam(
      "MerchantContractAddress",
      ethereum.Value.fromAddress(MerchantContractAddress)
    )
  )
  approvedMerchantEvent.parameters.push(
    new ethereum.EventParam(
      "ApprovedMerchant",
      ethereum.Value.fromBoolean(ApprovedMerchant)
    )
  )

  return approvedMerchantEvent
}

export function createBuyEvent(
  PurchaseID: BigInt,
  DateF: BigInt,
  BuyerAddress: Address,
  MerchantContractAddress: Address,
  Amount: BigInt
): Buy {
  let buyEvent = changetype<Buy>(newMockEvent())

  buyEvent.parameters = new Array()

  buyEvent.parameters.push(
    new ethereum.EventParam(
      "PurchaseID",
      ethereum.Value.fromUnsignedBigInt(PurchaseID)
    )
  )
  buyEvent.parameters.push(
    new ethereum.EventParam("DateF", ethereum.Value.fromUnsignedBigInt(DateF))
  )
  buyEvent.parameters.push(
    new ethereum.EventParam(
      "BuyerAddress",
      ethereum.Value.fromAddress(BuyerAddress)
    )
  )
  buyEvent.parameters.push(
    new ethereum.EventParam(
      "MerchantContractAddress",
      ethereum.Value.fromAddress(MerchantContractAddress)
    )
  )
  buyEvent.parameters.push(
    new ethereum.EventParam("Amount", ethereum.Value.fromUnsignedBigInt(Amount))
  )

  return buyEvent
}

export function createCompleteEvent(PurchaseID: BigInt): Complete {
  let completeEvent = changetype<Complete>(newMockEvent())

  completeEvent.parameters = new Array()

  completeEvent.parameters.push(
    new ethereum.EventParam(
      "PurchaseID",
      ethereum.Value.fromUnsignedBigInt(PurchaseID)
    )
  )

  return completeEvent
}

export function createCreatePurchaseEvent(
  Date: BigInt,
  Amount: BigInt,
  EscrowTime: BigInt
): CreatePurchase {
  let createPurchaseEvent = changetype<CreatePurchase>(newMockEvent())

  createPurchaseEvent.parameters = new Array()

  createPurchaseEvent.parameters.push(
    new ethereum.EventParam("Date", ethereum.Value.fromUnsignedBigInt(Date))
  )
  createPurchaseEvent.parameters.push(
    new ethereum.EventParam("Amount", ethereum.Value.fromUnsignedBigInt(Amount))
  )
  createPurchaseEvent.parameters.push(
    new ethereum.EventParam(
      "EscrowTime",
      ethereum.Value.fromUnsignedBigInt(EscrowTime)
    )
  )

  return createPurchaseEvent
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

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createPausedWithdrawalsEvent(
  MerchantContractAddress: Address,
  PausedWithdrawals: boolean
): PausedWithdrawals {
  let pausedWithdrawalsEvent = changetype<PausedWithdrawals>(newMockEvent())

  pausedWithdrawalsEvent.parameters = new Array()

  pausedWithdrawalsEvent.parameters.push(
    new ethereum.EventParam(
      "MerchantContractAddress",
      ethereum.Value.fromAddress(MerchantContractAddress)
    )
  )
  pausedWithdrawalsEvent.parameters.push(
    new ethereum.EventParam(
      "PausedWithdrawals",
      ethereum.Value.fromBoolean(PausedWithdrawals)
    )
  )

  return pausedWithdrawalsEvent
}

export function createRefundEvent(
  MerchantContractAddress: Address,
  BuyerAddress: Address,
  Amount: BigInt
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
      "BuyerAddress",
      ethereum.Value.fromAddress(BuyerAddress)
    )
  )
  refundEvent.parameters.push(
    new ethereum.EventParam("Amount", ethereum.Value.fromUnsignedBigInt(Amount))
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

export function createWithdrawalEvent(
  MerchantContractAddress: Address,
  Amount: BigInt
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
    new ethereum.EventParam("Amount", ethereum.Value.fromUnsignedBigInt(Amount))
  )

  return withdrawalEvent
}
