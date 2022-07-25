const main = async () => {
  const MainContract = await hre.ethers.getContractFactory('MainContract')
  const maincontract = await MainContract.deploy(process.env.OWNER_ADDRESS)

  await maincontract.deployed()

  console.log('MainContract deployed to:', maincontract.address)
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
