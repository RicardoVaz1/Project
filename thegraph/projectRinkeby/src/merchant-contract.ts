import {
  ApprovedMerchant as ApprovedMerchantEvent,
  Buy as BuyEvent,
  Complete as CompleteEvent,
  CreatePurchase as CreatePurchaseEvent,
  Historic as HistoricEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  PausedWithdrawals as PausedWithdrawalsEvent,
  Refund as RefundEvent,
  TopUpMyContract as TopUpMyContractEvent,
  Withdrawal as WithdrawalEvent
} from "../generated/MerchantContract/MerchantContract"
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
} from "../generated/schema"

export function handleApprovedMerchant(event: ApprovedMerchantEvent): void {
  let entity = new ApprovedMerchant(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.MerchantContractAddress = event.params.MerchantContractAddress
  entity.ApprovedMerchant = event.params.ApprovedMerchant
  entity.save()
}

export function handleBuy(event: BuyEvent): void {
  let entity = new Buy(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.PurchaseID = event.params.PurchaseID
  entity.DateF = event.params.DateF
  entity.BuyerAddress = event.params.BuyerAddress
  entity.MerchantContractAddress = event.params.MerchantContractAddress
  entity.Amount = event.params.Amount
  entity.save()
}

export function handleComplete(event: CompleteEvent): void {
  let entity = new Complete(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.PurchaseID = event.params.PurchaseID
  entity.save()
}

export function handleCreatePurchase(event: CreatePurchaseEvent): void {
  let entity = new CreatePurchase(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.Date = event.params.Date
  entity.Amount = event.params.Amount
  entity.EscrowTime = event.params.EscrowTime
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

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner
  entity.save()
}

export function handlePausedWithdrawals(event: PausedWithdrawalsEvent): void {
  let entity = new PausedWithdrawals(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.MerchantContractAddress = event.params.MerchantContractAddress
  entity.PausedWithdrawals = event.params.PausedWithdrawals
  entity.save()
}

export function handleRefund(event: RefundEvent): void {
  let entity = new Refund(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.MerchantContractAddress = event.params.MerchantContractAddress
  entity.BuyerAddress = event.params.BuyerAddress
  entity.Amount = event.params.Amount
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

export function handleWithdrawal(event: WithdrawalEvent): void {
  let entity = new Withdrawal(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.MerchantContractAddress = event.params.MerchantContractAddress
  entity.Amount = event.params.Amount
  entity.save()
}
