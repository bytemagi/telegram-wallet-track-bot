import { readJson, writeJson } from './file';
import { abbrAddr } from './wallets';

const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const addWalletAlias = (chatID: number, wallet_address: string , alias : string) => {
  let list: any = readJson("alias.json")

  if (list[chatID] == undefined || list[chatID][wallet_address] == undefined) {
    writeJson({
      ...list, [chatID]: {
        ...list[chatID],
        [wallet_address]: alias
      }
    } , "alias.json")

    return true
  } else {

    return false
  }
}


const readWalletAlias = (chatID: number, wallet_address: string) => {
  let list: any = readJson("alias.json")

  return list[chatID][wallet_address] || abbrAddr(wallet_address)
}

export {
  sleep,
  addWalletAlias,
  readWalletAlias,

}
