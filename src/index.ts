import { bot, mainnetRPC } from "./config"
import * as commands from './commands'
import { INPUT_ACTION } from "./type";
import { addWallet, readWallet, removeWallet } from "./utils/wallets";
import { PublicKey } from "@solana/web3.js";
import { getMint } from "@solana/spl-token";
import { addToken, delToken, readToken } from "./utils";
import { connection } from "./message";
import { sendRequest } from "./utils/monitor";
import { addWalletAlias } from "./utils/wallets_alias";

let botName;
let input_state: any = {}
let temp_token_list: any = {}

const start = async () => {
  console.log("Wallet Tracker is running since now");

  bot.getMe().then((user: any) => {
    botName = user.username!.toString()
  })

  bot.setMyCommands(commands.commandList)

  bot.on(`message`, async (msg: any) => {
    const chatId = msg.chat.id!
    const text = msg.text!
    const msgId = msg.message_id!
    const username: string = msg.from!.username!
    const callbackQueryId = msg.id!

    switch (text) {
      case `/start`:

        bot.sendMessage(chatId, commands.startMsg(), { parse_mode: "HTML" })
        break;
      case `/add_wallet`:
        input_state[chatId] = INPUT_ACTION.AddWallet
        const addWalletList = readWallet(chatId)
        const addWalletMsg = commands.msgWalletList(addWalletList , chatId)

        bot.sendMessage(chatId, addWalletMsg, { parse_mode: "HTML" })
        break;
      case `/del_wallet`:
        input_state[chatId] = INPUT_ACTION.DelWallet
        const delWalletList = readWallet(chatId)
        const delWalletMsg = commands.msgDelWalletList(delWalletList, chatId)

        bot.sendMessage(chatId, delWalletMsg, { parse_mode: "HTML" })
        break;
      case `/add_token`:
        input_state[chatId] = INPUT_ACTION.AddToken
        const addTokenWalletList = readWallet(chatId)
        const addTokenWalletListMsg = commands.selectWalletList(addTokenWalletList, chatId)

        bot.sendMessage(chatId, addTokenWalletListMsg, { parse_mode: "HTML" })
        break;
      case `/get_wallet_list`:
        input_state[chatId] = INPUT_ACTION.NoInput
        const walletList = readWallet(chatId)
        const getWalletMsg = commands.msgGetWalletList(walletList, username , chatId)
        bot.sendMessage(chatId, getWalletMsg, { parse_mode: "HTML" })
        break;
      case `/get_token_list`:
        input_state[chatId] = INPUT_ACTION.GetToken
        const getTokenWalletList = readWallet(chatId)
        const getTokenWalletListMsg = commands.inspectWalletList(getTokenWalletList, chatId)

        bot.sendMessage(chatId, getTokenWalletListMsg, { parse_mode: "HTML" })

        break;

      case `/del_token`:
        input_state[chatId] = INPUT_ACTION.DelToken
        const delTokenList = readWallet(chatId)
        const delTokenListMsg = commands.selectWalletList(delTokenList, chatId)

        bot.sendMessage(chatId, delTokenListMsg, { parse_mode: "HTML" })
        break;

      default:
        if (text != "" && text != undefined) {
          switch (input_state[chatId]) {
            case INPUT_ACTION.AddWallet:
              try {
                new PublicKey(text)
                const addIdentity = addWallet(chatId, text)
                if (addIdentity) {
                  bot.sendMessage(chatId, "Please input Wallet Name")
                  sendRequest(text)
                  input_state[chatId] = INPUT_ACTION.AddWalletAlias
                  temp_token_list[chatId] = text
                  return;
                } else {
                  bot.sendMessage(chatId, "Wallet is existed in wallet")
                }
              } catch (error) {
                bot.sendMessage(chatId, "Invalid Address")
              }

              input_state[chatId] = INPUT_ACTION.NoInput
              break;
            case INPUT_ACTION.AddWalletAlias:
              console.log(text);

              if (text != "" || text != undefined) {
                addWalletAlias(chatId, temp_token_list[chatId], text)
                bot.sendMessage(chatId, `[${text}] Added`)
              } else {
                addWalletAlias(chatId, temp_token_list[chatId], "unknown")
              }

              input_state[chatId] = INPUT_ACTION.NoInput
              break;
            case INPUT_ACTION.DelWallet:
              try {
                new PublicKey(text)
                const walletList = readWallet(chatId)

                if (walletList.includes(text)) {
                  removeWallet(chatId, text)
                  bot.sendMessage(chatId, "Success in Delete Wallet")
                } else {
                  bot.sendMessage(chatId, "This Address is not existing on Wallet List", { parse_mode: "HTML" })
                }
              } catch (error) {
                bot.sendMessage(chatId, "Invalid Address")
              }

              break;
            case INPUT_ACTION.AddToken:
              try {
                new PublicKey(text)
                const walletList = readWallet(chatId)

                if (walletList.includes(text)) {
                  const getTokenList = readToken(chatId, text)
                  const getTokenListMsg = commands.addTokenList(getTokenList)
                  bot.sendMessage(chatId, getTokenListMsg, { parse_mode: "HTML" })
                  temp_token_list[chatId] = text
                  input_state[chatId] = INPUT_ACTION.AddTokenAddress

                  return;
                } else {
                  bot.sendMessage(chatId, "This Address is not existing on Wallet List", { parse_mode: "HTML" })
                }
              } catch (error) {
                bot.sendMessage(chatId, "Invalid Address")
              }

              break;


            case INPUT_ACTION.AddTokenAddress:
              try {
                new PublicKey(text)

                try {

                  const temp = await getMint(connection, new PublicKey(text))

                  console.log(temp);

                  if (addToken(chatId, temp_token_list[chatId], text)) {
                    bot.sendMessage(chatId, "Succeed in Adding TOKEN")
                  } else {
                    bot.sendMessage(chatId, "Existing TOKEN Address in List")
                  }
                } catch (error) {
                  console.log(error);

                  bot.sendMessage(chatId, "Invalid Mint Address")
                }
              } catch (error) {
                bot.sendMessage(chatId, "Invalid Address")
              }

              break;
            case INPUT_ACTION.DelTokenAddress:
              try {
                new PublicKey(text)

                try {

                  const temp = await getMint(connection, new PublicKey(text))

                  console.log(temp);


                  if (delToken(chatId, temp_token_list[chatId], text)) {
                    bot.sendMessage(chatId, "Succeed in Delete TOKEN")
                  } else {
                    bot.sendMessage(chatId, "TokenAddress is not existing on List")
                  }
                } catch (error) {
                  console.log(error);

                  bot.sendMessage(chatId, "Invalid Mint Address")
                }
              } catch (error) {
                bot.sendMessage(chatId, "Invalid Address")
              }

              break;

            case INPUT_ACTION.DelToken:
              try {
                new PublicKey(text)
                const walletList = readWallet(chatId)

                if (walletList.includes(text)) {
                  const getTokenList = readToken(chatId, text)
                  const getTokenListMsg = commands.delTokenList(getTokenList)
                  bot.sendMessage(chatId, getTokenListMsg, { parse_mode: "HTML" })
                  temp_token_list[chatId] = text
                  input_state[chatId] = INPUT_ACTION.DelTokenAddress

                  return;
                } else {
                  bot.sendMessage(chatId, "This Address is not existing on Wallet List", { parse_mode: "HTML" })
                }
              } catch (error) {
                bot.sendMessage(chatId, "Invalid Address")
              }

              break;


            case INPUT_ACTION.GetToken:
              try {
                new PublicKey(text)

                const getTokenList = readToken(chatId, text)

                const getTokenListMsg = commands.inspectTokenList(getTokenList, text, username)

                bot.sendMessage(chatId, getTokenListMsg, { parse_mode: "HTML" })

              } catch (error) {
                bot.sendMessage(chatId, "Invalid Address")
              }
              break;
          }
          input_state[chatId] = INPUT_ACTION.NoInput
        }
    }
  })
}

start()