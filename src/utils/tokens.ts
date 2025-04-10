import { readJson, writeJson } from './file';

const readToken = (chatID: number, wallet_address: string) => {
  let list: any = readJson()

  return list[chatID][wallet_address]
}

const addToken = (chatID: number, wallet_address: string, token_address: string) => {
  let list: any = readJson()

  if (list[chatID][wallet_address].includes(token_address)) {
    return false
  } else {
    list[chatID][wallet_address].push(token_address)

    writeJson(list)
    return true
  }
}

const delToken = (chatID: number, wallet_address: string, token_address: string) => {
  let list: any = readJson()

  if (list[chatID][wallet_address].includes(token_address)) {
    list[chatID][wallet_address] = list[chatID][wallet_address].filter((item : any) => item !== token_address);
    writeJson(list)
    return true
  } else {

    return false
  }
}



export {
  readToken,
  addToken,
  delToken
}
