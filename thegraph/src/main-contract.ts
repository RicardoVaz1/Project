import {
  ApproveMerchantContract as ApproveMerchantContractEvent,
  Buy as BuyEvent,
  Cancel as CancelEvent,
  Complete as CompleteEvent,
  CreateMerchantContract as CreateMerchantContractEvent,
  CreatePurchase as CreatePurchaseEvent,
  PauseMerchantContract as PauseMerchantContractEvent,
  Refund as RefundEvent,
  VoteNewMerchantContract as VoteNewMerchantContractEvent,
  WithdrawRest as WithdrawRestEvent,
  Withdrawal as WithdrawalEvent
} from "../generated/MainContract/MainContract"
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
} from "../generated/schema"

export function handleApproveMerchantContract(
  event: ApproveMerchantContractEvent
): void {
  let entity = new ApproveMerchantContract(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.contractInstance = event.params.contractInstance

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleBuy(event: BuyEvent): void {
  let entity = new Buy(event.transaction.hash.concatI32(event.logIndex.toI32()))
  entity.contractInstance = event.params.contractInstance
  entity.idPurchase = event.params.idPurchase
  entity.cancelTime = event.params.cancelTime
  entity.completeTime = event.params.completeTime
  entity.buyerAddress = event.params.buyerAddress
  entity.purchaseAmount = event.params.purchaseAmount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCancel(event: CancelEvent): void {
  let entity = new Cancel(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.contractInstance = event.params.contractInstance
  entity.buyerAddress = event.params.buyerAddress
  entity.idPurchase = event.params.idPurchase

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleComplete(event: CompleteEvent): void {
  let entity = new Complete(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.contractInstance = event.params.contractInstance
  entity.idPurchase = event.params.idPurchase

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCreateMerchantContract(
  event: CreateMerchantContractEvent
): void {
  let entity = new CreateMerchantContract(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.contractInstance = event.params.contractInstance
  entity.merchantAddress = event.params.merchantAddress
  entity.merchantName = event.params.merchantName

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCreatePurchase(event: CreatePurchaseEvent): void {
  let entity = new CreatePurchase(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.contractInstance = event.params.contractInstance
  entity.idPurchase = event.params.idPurchase
  entity.purchaseAmount = event.params.purchaseAmount
  entity.cancelTime = event.params.cancelTime
  entity.completeTime = event.params.completeTime

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePauseMerchantContract(
  event: PauseMerchantContractEvent
): void {
  let entity = new PauseMerchantContract(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.contractInstance = event.params.contractInstance
  entity.paused = event.params.paused

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRefund(event: RefundEvent): void {
  let entity = new Refund(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.contractInstance = event.params.contractInstance
  entity.idPurchase = event.params.idPurchase
  entity.buyerAddress = event.params.buyerAddress
  entity.refundAmount = event.params.refundAmount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleVoteNewMerchantContract(
  event: VoteNewMerchantContractEvent
): void {
  let entity = new VoteNewMerchantContract(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.contractInstance = event.params.contractInstance
  entity.voter = event.params.voter

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleWithdrawRest(event: WithdrawRestEvent): void {
  let entity = new WithdrawRest(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.contractInstance = event.params.contractInstance
  entity.restBalance = event.params.restBalance

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleWithdrawal(event: WithdrawalEvent): void {
  let entity = new Withdrawal(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.contractInstance = event.params.contractInstance
  entity.merchantBalance = event.params.merchantBalance

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
