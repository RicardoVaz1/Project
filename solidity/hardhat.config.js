require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-ethers")
require('hardhat-contract-sizer')
require("dotenv").config()

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

module.exports = {
  solidity: "0.8.9",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
    only: [],
  },
  // defaultNetwork: "goerli",
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    },
    goerli: {
      url: process.env.GOERLI_RPC_URL,
      accounts: [process.env.OWNER_PRIVATE_KEY]
    },
    rinkeby: {
      url: process.env.RINKEBY_RPC_URL,
      accounts: [process.env.OWNER_PRIVATE_KEY]
    }
  }
}
