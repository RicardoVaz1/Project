import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  ApproveMerchantContract,
  Buy,
  Cancel,
  Complete,
  CreateMerchantContract,
  CreatePurchase,
  PauseMerchantContract,
  Refund,
  VoteNewMerchantContract,
  WithdrawRest,
  Withdrawal
} from "../generated/MainContract/MainContract"

export function createApproveMerchantContractEvent(
  contractInstance: Address
): ApproveMerchantContract {
  let approveMerchantContractEvent = changetype<ApproveMerchantContract>(
    newMockEvent()
  )

  approveMerchantContractEvent.parameters = new Array()

  approveMerchantContractEvent.parameters.push(
    new ethereum.EventParam(
      "contractInstance",
      ethereum.Value.fromAddress(contractInstance)
    )
  )

  return approveMerchantContractEvent
}

export function createBuyEvent(
  contractInstance: Address,
  idPurchase: BigInt,
  cancelTime: BigInt,
  completeTime: BigInt,
  buyerAddress: Address,
  purchaseAmount: BigInt
): Buy {
  let buyEvent = changetype<Buy>(newMockEvent())

  buyEvent.parameters = new Array()

  buyEvent.parameters.push(
    new ethereum.EventParam(
      "contractInstance",
      ethereum.Value.fromAddress(contractInstance)
    )
  )
  buyEvent.parameters.push(
    new ethereum.EventParam(
      "idPurchase",
      ethereum.Value.fromUnsignedBigInt(idPurchase)
    )
  )
  buyEvent.parameters.push(
    new ethereum.EventParam(
      "cancelTime",
      ethereum.Value.fromUnsignedBigInt(cancelTime)
    )
  )
  buyEvent.parameters.push(
    new ethereum.EventParam(
      "completeTime",
      ethereum.Value.fromUnsignedBigInt(completeTime)
    )
  )
  buyEvent.parameters.push(
    new ethereum.EventParam(
      "buyerAddress",
      ethereum.Value.fromAddress(buyerAddress)
    )
  )
  buyEvent.parameters.push(
    new ethereum.EventParam(
      "purchaseAmount",
      ethereum.Value.fromUnsignedBigInt(purchaseAmount)
    )
  )

  return buyEvent
}

export function createCancelEvent(
  contractInstance: Address,
  buyerAddress: Address,
  idPurchase: BigInt
): Cancel {
  let cancelEvent = changetype<Cancel>(newMockEvent())

  cancelEvent.parameters = new Array()

  cancelEvent.parameters.push(
    new ethereum.EventParam(
      "contractInstance",
      ethereum.Value.fromAddress(contractInstance)
    )
  )
  cancelEvent.parameters.push(
    new ethereum.EventParam(
      "buyerAddress",
      ethereum.Value.fromAddress(buyerAddress)
    )
  )
  cancelEvent.parameters.push(
    new ethereum.EventParam(
      "idPurchase",
      ethereum.Value.fromUnsignedBigInt(idPurchase)
    )
  )

  return cancelEvent
}

export function createCompleteEvent(
  contractInstance: Address,
  idPurchase: BigInt
): Complete {
  let completeEvent = changetype<Complete>(newMockEvent())

  completeEvent.parameters = new Array()

  completeEvent.parameters.push(
    new ethereum.EventParam(
      "contractInstance",
      ethereum.Value.fromAddress(contractInstance)
    )
  )
  completeEvent.parameters.push(
    new ethereum.EventParam(
      "idPurchase",
      ethereum.Value.fromUnsignedBigInt(idPurchase)
    )
  )

  return completeEvent
}

export function createCreateMerchantContractEvent(
  contractInstance: Address,
  merchantAddress: Address,
  merchantName: string
): CreateMerchantContract {
  let createMerchantContractEvent = changetype<CreateMerchantContract>(
    newMockEvent()
  )

  createMerchantContractEvent.parameters = new Array()

  createMerchantContractEvent.parameters.push(
    new ethereum.EventParam(
      "contractInstance",
      ethereum.Value.fromAddress(contractInstance)
    )
  )
  createMerchantContractEvent.parameters.push(
    new ethereum.EventParam(
      "merchantAddress",
      ethereum.Value.fromAddress(merchantAddress)
    )
  )
  createMerchantContractEvent.parameters.push(
    new ethereum.EventParam(
      "merchantName",
      ethereum.Value.fromString(merchantName)
    )
  )

  return createMerchantContractEvent
}

export function createCreatePurchaseEvent(
  contractInstance: Address,
  idPurchase: BigInt,
  purchaseAmount: BigInt,
  cancelTime: BigInt,
  completeTime: BigInt
): CreatePurchase {
  let createPurchaseEvent = changetype<CreatePurchase>(newMockEvent())

  createPurchaseEvent.parameters = new Array()

  createPurchaseEvent.parameters.push(
    new ethereum.EventParam(
      "contractInstance",
      ethereum.Value.fromAddress(contractInstance)
    )
  )
  createPurchaseEvent.parameters.push(
    new ethereum.EventParam(
      "idPurchase",
      ethereum.Value.fromUnsignedBigInt(idPurchase)
    )
  )
  createPurchaseEvent.parameters.push(
    new ethereum.EventParam(
      "purchaseAmount",
      ethereum.Value.fromUnsignedBigInt(purchaseAmount)
    )
  )
  createPurchaseEvent.parameters.push(
    new ethereum.EventParam(
      "cancelTime",
      ethereum.Value.fromUnsignedBigInt(cancelTime)
    )
  )
  createPurchaseEvent.parameters.push(
    new ethereum.EventParam(
      "completeTime",
      ethereum.Value.fromUnsignedBigInt(completeTime)
    )
  )

  return createPurchaseEvent
}

export function createPauseMerchantContractEvent(
  contractInstance: Address,
  paused: boolean
): PauseMerchantContract {
  let pauseMerchantContractEvent = changetype<PauseMerchantContract>(
    newMockEvent()
  )

  pauseMerchantContractEvent.parameters = new Array()

  pauseMerchantContractEvent.parameters.push(
    new ethereum.EventParam(
      "contractInstance",
      ethereum.Value.fromAddress(contractInstance)
    )
  )
  pauseMerchantContractEvent.parameters.push(
    new ethereum.EventParam("paused", ethereum.Value.fromBoolean(paused))
  )

  return pauseMerchantContractEvent
}

export function createRefundEvent(
  contractInstance: Address,
  idPurchase: BigInt,
  buyerAddress: Address,
  refundAmount: BigInt
): Refund {
  let refundEvent = changetype<Refund>(newMockEvent())

  refundEvent.parameters = new Array()

  refundEvent.parameters.push(
    new ethereum.EventParam(
      "contractInstance",
      ethereum.Value.fromAddress(contractInstance)
    )
  )
  refundEvent.parameters.push(
    new ethereum.EventParam(
      "idPurchase",
      ethereum.Value.fromUnsignedBigInt(idPurchase)
    )
  )
  refundEvent.parameters.push(
    new ethereum.EventParam(
      "buyerAddress",
      ethereum.Value.fromAddress(buyerAddress)
    )
  )
  refundEvent.parameters.push(
    new ethereum.EventParam(
      "refundAmount",
      ethereum.Value.fromUnsignedBigInt(refundAmount)
    )
  )

  return refundEvent
}

export function createVoteNewMerchantContractEvent(
  contractInstance: Address,
  voter: Address
): VoteNewMerchantContract {
  let voteNewMerchantContractEvent = changetype<VoteNewMerchantContract>(
    newMockEvent()
  )

  voteNewMerchantContractEvent.parameters = new Array()

  voteNewMerchantContractEvent.parameters.push(
    new ethereum.EventParam(
      "contractInstance",
      ethereum.Value.fromAddress(contractInstance)
    )
  )
  voteNewMerchantContractEvent.parameters.push(
    new ethereum.EventParam("voter", ethereum.Value.fromAddress(voter))
  )

  return voteNewMerchantContractEvent
}

export function createWithdrawRestEvent(
  contractInstance: Address,
  restBalance: BigInt
): WithdrawRest {
  let withdrawRestEvent = changetype<WithdrawRest>(newMockEvent())

  withdrawRestEvent.parameters = new Array()

  withdrawRestEvent.parameters.push(
    new ethereum.EventParam(
      "contractInstance",
      ethereum.Value.fromAddress(contractInstance)
    )
  )
  withdrawRestEvent.parameters.push(
    new ethereum.EventParam(
      "restBalance",
      ethereum.Value.fromUnsignedBigInt(restBalance)
    )
  )

  return withdrawRestEvent
}

export function createWithdrawalEvent(
  contractInstance: Address,
  merchantBalance: BigInt
): Withdrawal {
  let withdrawalEvent = changetype<Withdrawal>(newMockEvent())

  withdrawalEvent.parameters = new Array()

  withdrawalEvent.parameters.push(
    new ethereum.EventParam(
      "contractInstance",
      ethereum.Value.fromAddress(contractInstance)
    )
  )
  withdrawalEvent.parameters.push(
    new ethereum.EventParam(
      "merchantBalance",
      ethereum.Value.fromUnsignedBigInt(merchantBalance)
    )
  )

  return withdrawalEvent
}
