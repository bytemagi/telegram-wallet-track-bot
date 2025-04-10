import { Connection, GetProgramAccountsFilter } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
    connection,
    ws
} from "../message";
import { mainnetRPC } from "../config";
let geyserList: string[] = [];

/**
 * 
 * @param pubkey 
 * @returns 
 */
const getAtaList = async (pubkey: string) => {
    const filters: GetProgramAccountsFilter[] = [
        {
            dataSize: 165,    //size of account (bytes)
        },
        {
            memcmp: {
                offset: 32,     //location of our query in the account (bytes)
                bytes: pubkey,  //our search criteria, a base58 encoded string
            },
        }];
    const accounts = await connection.getParsedProgramAccounts(
        TOKEN_PROGRAM_ID, //new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
        { filters: filters }
    );
    const ataList = accounts.map((account: any, i: any) => account.pubkey.toBase58());

    return [pubkey, ...ataList]
}

// Function to send a request to the WebSocket server
const sendRequest = async (inputpubkey: string) => {

    let temp: any = []
    const pubkey: any = await getAtaList(inputpubkey);

    for (let i = 0; i < pubkey.length; i++) if (!geyserList.includes(pubkey[i])) {
        geyserList.push(pubkey[i])
        temp.push(pubkey[i])
    }

    console.log("Add to geyer list =====> ", temp);

    if (temp.length == 0) return false;

    const request = {
        jsonrpc: "2.0",
        id: 420,
        method: "transactionSubscribe",
        params: [
            {
                failed: false,
                accountInclude: temp
            },
            {
                commitment: "finalized",
                encoding: "jsonParsed",
                transactionDetails: "full",
                maxSupportedTransactionVersion: 0
            }
        ]
    };

    if (temp.length > 0) {
        ws.send(JSON.stringify(request));
    }

    return true
}

export {
    getAtaList,
    sendRequest
}
