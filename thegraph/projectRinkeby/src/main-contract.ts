import {
  ApprovedMerchantContract as ApprovedMerchantContractEvent,
  CreateMerchantContract as CreateMerchantContractEvent,
  NewMerchantContractApproved as NewMerchantContractApprovedEvent,
  PausedMerchantContract as PausedMerchantContractEvent,
  SaveHistoric as SaveHistoricEvent,
  VoteNewMerchantContractApproval as VoteNewMerchantContractApprovalEvent
} from "../generated/MainContract/MainContract"
import {
  ApprovedMerchantContract,
  CreateMerchantContract,
  NewMerchantContractApproved,
  PausedMerchantContract,
  SaveHistoric,
  VoteNewMerchantContractApproval
} from "../generated/schema"

export function handleApprovedMerchantContract(
  event: ApprovedMerchantContractEvent
): void {
  let entity = new ApprovedMerchantContract(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.MerchantContractAddress = event.params.MerchantContractAddress
  entity.Approved = event.params.Approved
  entity.save()
}

export function handleCreateMerchantContract(
  event: CreateMerchantContractEvent
): void {
  let entity = new CreateMerchantContract(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.ID = event.params.ID
  entity.MerchantContractAddress = event.params.MerchantContractAddress
  entity.MerchantAddress = event.params.MerchantAddress
  entity.MerchantName = event.params.MerchantName
  entity.save()
}

export function handleNewMerchantContractApproved(
  event: NewMerchantContractApprovedEvent
): void {
  let entity = new NewMerchantContractApproved(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.MerchantContractAddress = event.params.MerchantContractAddress
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

export function handleSaveHistoric(event: SaveHistoricEvent): void {
  let entity = new SaveHistoric(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.MerchantContractAddress = event.params.MerchantContractAddress
  entity.Sells = event.params.Sells
  entity.Refunds = event.params.Refunds
  entity.Purchases = event.params.Purchases
  entity.Cancellations = event.params.Cancellations
  entity.save()
}

export function handleVoteNewMerchantContractApproval(
  event: VoteNewMerchantContractApprovalEvent
): void {
  let entity = new VoteNewMerchantContractApproval(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.Voter = event.params.Voter
  entity.MerchantContractAddress = event.params.MerchantContractAddress
  entity.save()
}
