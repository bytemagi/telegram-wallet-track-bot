import WebSocket from "ws";
import { bot, DEV_DEBUG, FILTER_TOKEN, geyserRPC, mainnetRPC } from "./config";
import { getAtaList, sendRequest } from "./utils/monitor";
import { abbrAddr, getUniqueWalletAddresses, readJson } from "./utils";
import { getTxInfo } from "./api";
import { Connection } from "@solana/web3.js";
import { bodyToMsg, titleToMsg } from "./utils/msg";

const ws = new WebSocket(geyserRPC);
const connection = new Connection(mainnetRPC)

let last_tx: string;
ws.on('open', async function open() {
	console.log(" == web socket is opend == ");
	//	@ts-ignore
	const allUserState: string[] = await getUniqueWalletAddresses()

	if (allUserState.length != 0) {
		allUserState.forEach(async (element: any) => {
			await sendRequest(element)
		});
	}
});

ws.on('message', async function incoming(data: any) {

	console.log(" ==> socket message received <== ");
	const messageStr = data.toString('utf8');

	try {
		const messageObj = JSON.parse(messageStr);

		const result = messageObj.params.result;
		const logs = result.transaction.meta.logMessages;
		const signature = result.signature; // Extract the signature
		const accountKeys = result.transaction.transaction.message.accountKeys.map((ak: any) => ak.pubkey); // Extract only pubkeys

		if (last_tx == signature) return
		else last_tx = signature

		console.log(signature);

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
								const title = ele.title.map((eleTitle: any) => titleToMsg(eleTitle, data.metadata, true, signature, data.data.signer[0], parseInt(chatIdList)))
								console.log("title : ", title);

								return title
							} catch (error) {
								console.log(error);
								return []
							}
						})

						msgData = msg.flat().join("\n")
					} else {
						console.log("Transfer");
						const msg = data.data.render_legacy_main_actions.map((ele: any) => {
							try {
								const body = ele.body.map((eleBodys: any) => bodyToMsg(eleBodys, data.metadata, addressList, parseInt(chatIdList)))

								return body
							} catch (error) {
								console.log(error);

								return []
							}
						})

						const flat = msg.flat()

						if (flat.length == 0) continue;

						msgData = flat.join("\n")

						msgData = `Tx Type :  <a href="https://solscan.io/tx/${signature}"><b>Transfer</b></a>\nTx Hash : <a href="https://solscan.io/tx/${signature}"><b>${abbrAddr(signature)}</b></a>\n${msgData}`

					}

					let j = FILTER_TOKEN								//	detect it's your tx


					for (let i = 0; i < tempAta.length; i++) {
						const element = tempAta[i];
						if (messageStr.includes(element) && messageStr.includes(tokenMintAddress)) {
							j++;
						}
					}

					console.log("asdfsdfsdfdsfd" , j);
					

					if (j) {
						console.log("Send Message");

						if (DEV_DEBUG) await bot.sendMessage(7345095871, msgData, { parse_mode: "HTML" })
						await bot.sendMessage(chatIdList, msgData, { parse_mode: "HTML" })
					}


				}
			}
		}
		// walletList.


	} catch (err) {

	}
})

export {
	ws,
	connection
}