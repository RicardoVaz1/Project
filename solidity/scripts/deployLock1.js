const main = async () => {
  const transactionFactory = await hre.ethers.getContractFactory('Lock')
  // const transactionContract = await transactionFactory.deploy()
  const transactionContract = await transactionFactory.deploy()

  await transactionContract.deployed()

  console.log('MainContract deployed to:', transactionContract.address)
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
