// Get flashLoans from AAVE subgraph //

const axios = require("axios")
require("dotenv").config()
const API_KEY = process.env.API_KEY

const main = async () => {
    try {
        const result = await axios.post(
            `https://gateway.thegraph.com/api/${API_KEY}/subgraphs/id/CvvUWXNtn8A5zVAtM8ob3JGq8kQS8BLrzL6WJV7FrHRy`,
            {
                query: `
                {
                    flashLoans(first: 10, orderBy: timestamp, orderDirection: desc) {
                        id
                        reserve {
                            name
                            symbol
                        }
                        amount
                        target
                        timestamp
                    }
                }
                `
            }
        );
        console.log(result.data.data.flashLoans);
    } catch (error) {
        console.log(error);
    }
}

main();
