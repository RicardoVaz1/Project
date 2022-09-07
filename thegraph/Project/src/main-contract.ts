import {
  ApprovedMerchantContract as ApprovedMerchantContractEvent,
  Buy as BuyEvent,
  Complete as CompleteEvent,
  CreatePurchase as CreatePurchaseEvent,
  CreatedMerchantContract as CreatedMerchantContractEvent,
  Historic as HistoricEvent,
  PausedMerchantContract as PausedMerchantContractEvent,
  Refund as RefundEvent,
  TopUpMyContract as TopUpMyContractEvent,
  VoteNewMerchantContract as VoteNewMerchantContractEvent,
  Withdrawal as WithdrawalEvent
} from "../generated/MainContract/MainContract"
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
} from "../generated/schema"

export function handleApprovedMerchantContract(
  event: ApprovedMerchantContractEvent
): void {
  let entity = new ApprovedMerchantContract(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.MerchantContractAddress = event.params.MerchantContractAddress
  entity.MerchantName = event.params.MerchantName
  entity.Approved = event.params.Approved
  entity.save()
}

export function handleBuy(event: BuyEvent): void {
  let entity = new Buy(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.MerchantContractAddress = event.params.MerchantContractAddress
  entity.IDPurchase = event.params.IDPurchase
  entity.DateFinished = event.params.DateFinished
  entity.BuyerAddress = event.params.BuyerAddress
  entity.PurchaseAmount = event.params.PurchaseAmount
  entity.PurchaseStatus = event.params.PurchaseStatus
  entity.save()
}

export function handleComplete(event: CompleteEvent): void {
  let entity = new Complete(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.MerchantContractAddress = event.params.MerchantContractAddress
  entity.IDPurchase = event.params.IDPurchase
  entity.save()
}

export function handleCreatePurchase(event: CreatePurchaseEvent): void {
  let entity = new CreatePurchase(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.MerchantContractAddress = event.params.MerchantContractAddress
  entity.IDPurchase = event.params.IDPurchase
  entity.DateCreated = event.params.DateCreated
  entity.PurchaseAmount = event.params.PurchaseAmount
  entity.EscrowTime = event.params.EscrowTime
  entity.PurchaseStatus = event.params.PurchaseStatus
  entity.save()
}

export function handleCreatedMerchantContract(
  event: CreatedMerchantContractEvent
): void {
  let entity = new CreatedMerchantContract(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.MerchantContractAddress = event.params.MerchantContractAddress
  entity.MerchantAddress = event.params.MerchantAddress
  entity.MerchantName = event.params.MerchantName
  entity.save()
}

export function handleHistoric(event: HistoricEvent): void {
  let entity = new Historic(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.MerchantContractAddress = event.params.MerchantContractAddress
  entity.Sells = event.params.Sells
  entity.Refunds = event.params.Refunds
  entity.save()
}

export function handlePausedMerchantContract(
  event: PausedMerchantContractEvent
): void {
  let entity = new PausedMerchantContract(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.MerchantContractAddress = event.params.MerchantContractAddress
  entity.Paused = event.params.Paused
  entity.save()
}

export function handleRefund(event: RefundEvent): void {
  let entity = new Refund(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.MerchantContractAddress = event.params.MerchantContractAddress
  entity.IDPurchase = event.params.IDPurchase
  entity.Date = event.params.Date
  entity.BuyerAddress = event.params.BuyerAddress
  entity.RefundAmount = event.params.RefundAmount
  entity.PurchaseStatus = event.params.PurchaseStatus
  entity.save()
}

export function handleTopUpMyContract(event: TopUpMyContractEvent): void {
  let entity = new TopUpMyContract(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.MerchantContractAddress = event.params.MerchantContractAddress
  entity.Amount = event.params.Amount
  entity.save()
}

export function handleVoteNewMerchantContract(
  event: VoteNewMerchantContractEvent
): void {
  let entity = new VoteNewMerchantContract(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.Voter = event.params.Voter
  entity.MerchantContractAddress = event.params.MerchantContractAddress
  entity.save()
}

export function handleWithdrawal(event: WithdrawalEvent): void {
  let entity = new Withdrawal(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.MerchantContractAddress = event.params.MerchantContractAddress
  entity.Balance = event.params.Balance
  entity.save()
}
