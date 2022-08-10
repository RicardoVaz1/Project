import {
  ApprovedMerchantContract as ApprovedMerchantContractEvent,
  CreateMerchantContract as CreateMerchantContractEvent,
  PausedMerchantContract as PausedMerchantContractEvent
} from "../generated/MainContract/MainContract"
import {
  ApprovedMerchantContract,
  CreateMerchantContract,
  PausedMerchantContract
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
  entity.MerchantContractAddress = event.params.MerchantContractAddress
  entity.MerchantAddress = event.params.MerchantAddress
  entity.MerchantName = event.params.MerchantName
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
