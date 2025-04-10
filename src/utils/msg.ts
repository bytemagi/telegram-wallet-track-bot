import { CpiGuardLayout } from "@solana/spl-token";
import { MetadataList, TitleData } from "../type";
import { abbrAddr } from "./wallets";
import { readWalletAlias } from "./wallets_alias";

const titleToMsg = (title: any, metadataList: MetadataList, is_swap: boolean, tx_hash: string, signer: string, chatId: number) => {
    let i;

    for (i = 0; i < title.length; i++) if (metadataList.accounts[title[i].account] != undefined) break;

    const temp = metadataList.accounts[title[i].account].account_label
    const address = title[i].account

    const tokenAmounts = title.filter((item: any) => item.token_amount);
    const amount1 = tokenAmounts[0].token_amount.number / (10 ** tokenAmounts[0].token_amount.decimals)
    const amount2 = tokenAmounts[1].token_amount.number / (10 ** tokenAmounts[1].token_amount.decimals)
    const usdAmount1 = parseFloat(Number(amount1 * metadataList.tokens[tokenAmounts[0].token_amount.token_address].price_usdt).toFixed(5).toString())
    const usdAmount2 = parseFloat(Number(amount2 * metadataList.tokens[tokenAmounts[1].token_amount.token_address].price_usdt).toFixed(5).toString())
    const msg =
        `Tx type : <a href="https://solscan.io/tx/${tx_hash}"><b>${is_swap ? "Swap" : "Transfer"}</b></a>
Tx Hash : <a href="https://solscan.io/tx/${tx_hash}"><b>${abbrAddr(tx_hash)}</b></a>
Dex : <a href="https://solscan.io/account/${address}">${temp}</a>

<a href="https://solscan.io/token/${tokenAmounts[0].token_amount.token_address}">${metadataList.tokens[tokenAmounts[0].token_amount.token_address].token_name}</a>: SELL ${amount1} <a href="https://solscan.io/token/${tokenAmounts[0].token_amount.token_address}">${metadataList.tokens[tokenAmounts[0].token_amount.token_address].token_symbol}</a>   ( - $ ${usdAmount1} )
<a href="https://solscan.io/token/${tokenAmounts[1].token_amount.token_address}">${metadataList.tokens[tokenAmounts[1].token_amount.token_address].token_name}</a>: BUY ${amount2} <a href="https://solscan.io/token/${tokenAmounts[1].token_amount.token_address}">${metadataList.tokens[tokenAmounts[1].token_amount.token_address].token_symbol}</a>   ( + $ ${usdAmount2} )
PnL : $ ${usdAmount1} → $ ${usdAmount2} : $ ${usdAmount2 - usdAmount1}
Wallet Address : <a href="https://solscan.io/account/${signer}">${readWalletAlias(chatId, signer)}</a>
`

    return msg
}

const bodyToMsg = (body: any, metadataList: MetadataList, my_address: string, chatId: number) => {
    switch (body[0].icon) {
        case "transfer":
            try {
                const msg =
                    `\nSender : <a href="https://solscan.io/account/${body[2].token_account.owner}">${readWalletAlias(chatId, body[2].token_account.owner)}</a> ${body[2].token_account.owner == my_address ? "[Monitor Wallet]" : ""}
Receiver : <a href="https://solscan.io/account/${body[4].token_account.owner}">${readWalletAlias(chatId, body[4].token_account.owner)}</a> ${body[4].token_account.owner == my_address ? "[Monitor Wallet]" : ""}
Transfer Info : ${body[6].token_amount.number / (10 ** body[6].token_amount.decimals)} <a href="https://solscan.io/token/${body[6].token_amount.token_address}">${metadataList.tokens[body[6].token_amount.token_address].token_symbol}</a>`
                return msg

            } catch (error) {
                const msg =
                    `\nSender : <a href="https://solscan.io/account/${body[2].account}">${abbrAddr(body[2].account)}</a> ${body[2].account == my_address ? "[Monitor Wallet]" : ""}
Receiver : <a href="https://solscan.io/account/${body[4].account}">${abbrAddr(body[4].account)}</a> ${body[4].account == my_address ? "[Monitor Wallet]" : ""}
Transfer : ${body[6].token_amount.number / (10 ** body[6].token_amount.decimals)} <a href="https://solscan.io/token/${body[6].token_amount.token_address}">${metadataList.tokens[body[6].token_amount.token_address].token_symbol}</a>`
                return msg
            }

        case "swap":
            const amount1 = body[2].token_amount.number / (10 ** body[2].token_amount.decimals)
            const amount2 = body[4].token_amount.number / (10 ** body[4].token_amount.decimals)

            let temp;

            if (metadataList.accounts[body[6].account]) temp = metadataList.accounts[body[6].account].account_label
            else temp = body[6].account

            return `${body[1].text} ${amount1} <a href="https://solscan.io/token/${body[2].token_amount.token_address}">${metadataList.tokens[body[2].token_amount.token_address].token_symbol}</a> ${body[3].text} ${amount2} <a href="https://solscan.io/token/${body[4].token_amount.token_address}">${metadataList.tokens[body[4].token_amount.token_address].token_symbol}</a> ${body[5].text} <a href="https://solscan.io/account/${body[6].account}">${temp}</a>`
    }
}

export {
    titleToMsg,
    bodyToMsg
}