// Get MerchantContractAddress searching by MerchantAddress on ProjectRinkeby subgraph //

const axios = require("axios")
require("dotenv").config()
const API_KEY = process.env.API_KEY
const MerchantAddress = process.env.MERCHANTADDRESS
const MerchantContractAddress = process.env.MERCHANTCONTRACTADDRESS

const getMerchantContractAddress = async (MerchantAddress) => {
    try {
        const result = await axios.post(
            // `https://gateway.testnet.thegraph.com/api/${API_KEY}/subgraphs/id/BehW4dQTkVR3eJMy6EF2Gd2bydGabNtzydrYwjrHFhRw`,
            // `https://gateway.goerli.thegraph.com/api/${API_KEY}/subgraphs/id/BehW4dQTkVR3eJMy6EF2Gd2bydGabNtzydrYwjrHFhRw`,
            `https://api.studio.thegraph.com/query/25250/projectrinkeby/0.1`,
            {
                query: `
                {
                    createMerchantContracts(first: 1, where: {MerchantAddress: "${MerchantAddress}"}) {
                        id
                        MerchantContractAddress
                        MerchantAddress
                        MerchantName
                    }
                }
                `
            }
        );

        console.log(result.data.data.createMerchantContracts);
        console.log("\nMerchantContractAddress: ", result.data.data.createMerchantContracts[0].MerchantContractAddress);
        console.log("MerchantContractAddress: ", result.data.data.createMerchantContracts[0].MerchantName);
    } catch (error) {
        console.log(error);
    }
}

const getMerchantContractBuysHistory = async (MerchantContractAddress) => {
    // console.log("Buys in MerchantContractAddress: ", MerchantContractAddress)

    try {
        const result = await axios.post(
            `https://api.studio.thegraph.com/query/25250/projectrinkeby/0.1`,
            {
                query: `
                {
                    buys(where: {MerchantContractAddress: "${MerchantContractAddress}"}) {
                        id
                        PurchaseID
                        DateF
                        BuyerAddress
                        MerchantContractAddress
                        Amount
                    }
                }
                `
            }
        );

        console.log(result.data.data.buys);
    } catch (error) {
        console.log(error);
    }
}

getMerchantContractAddress(MerchantAddress)
getMerchantContractBuysHistory(MerchantContractAddress)
