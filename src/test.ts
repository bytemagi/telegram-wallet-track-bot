import TelegramBot from "node-telegram-bot-api";
import { getTxInfo } from "./api";
import { abbrAddr, readJson } from "./utils";
import { getAtaList } from "./utils/monitor";
import { bodyToMsg, titleToMsg } from "./utils/msg";
import { CpiGuardLayout } from "@solana/spl-token";
import { bot } from "./config";
const botToken = process.env.TOKEN!

const test = async () => {

    const signature = "4P3yGbAXQqDh4ohDDBsGqZbZ9CRmMFeMZ2RHLJhJ4xBi5hGX4kwA6DbZ5CzDcaxHeKhbeU59obivvPfpYEghcTk"

    const data = await getTxInfo(signature)

    console.log("========================================");

    const walletList: any = readJson()
    for (const chatIdList in walletList) {
        for (const addressList in walletList[chatIdList]) {
            for (const tokenList in walletList[chatIdList][addressList]) {
                const tokenMintAddress = walletList[chatIdList][addressList][tokenList]

                const tempAta = await getAtaList(addressList)

                let msgData;
                if (data.data.render_summary_main_actions.length > 0) {
                    console.log("Swap");
                    console.log(data.data.render_summary_main_actions);

                    const msg = data.data.render_summary_main_actions.map((ele: any) => {
                        try {
                            const title = ele.title.map((eleTitle: any) => titleToMsg(eleTitle, data.metadata, true, signature, data.data.signer[0]))
                            console.log("title : ", title);

                            return title
                        } catch (error) {
                            return []
                        }
                    })

                    msgData = msg.flat().join("\n")
                } else {
                    const msg = data.data.render_legacy_main_actions.map((ele: any) => {
                        try {
                            const body = ele.body.map((eleBodys: any) => bodyToMsg(eleBodys, data.metadata, addressList))

                            return body
                        } catch (error) {
                            return []
                        }
                    })

                    msgData = msg.flat().join("\n")

                    msgData = `Tx Type :  <a href="https://solscan.io/tx/${signature}"><b>Transfer</b></a>
Tx Hash : <a href="https://solscan.io/tx/${signature}"><b>${abbrAddr(signature)}</b></a>
${msgData}`

                }
                let j = 1								//	detect it's your tx

                // for (let i = 0; i < tempAta.length; i++) {
                // 	const element = tempAta[i];
                // 	if (messageStr.includes(element) && messageStr.includes(tokenMintAddress)) {
                // 		j++;
                // 	}
                // }

                if (j) {
                    console.log(msgData);

                    bot.sendMessage(7345095871, msgData, { parse_mode: "HTML" })
                }


            }
        }
    }
    // walletList.
}

test()