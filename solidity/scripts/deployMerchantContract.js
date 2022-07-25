const main = async () => {
  const MerchantContract = await hre.ethers.getContractFactory('MerchantContract')
  const merchantcontract = await MerchantContract.deploy(/*process.env.OWNER_ADDRESS,*/ process.env.MERCHANT_ADDRESS, process.env.MERCHANT_NAME)

  await merchantcontract.deployed()

  console.log('MerchantContract deployed to:', merchantcontract.address)
}
  
;(async () => {
  try {
    await main()
    process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
})()
