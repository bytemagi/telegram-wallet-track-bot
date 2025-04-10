import { readJson, writeJson } from './file';

const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const addWallet = (chatID: number, wallet_address: string) => {
  let list: any = readJson()

  if (list[chatID] == undefined || list[chatID][wallet_address] == undefined) {
    writeJson({
      ...list, [chatID]: {
        ...list[chatID],
        [wallet_address]: []
      }
    })

    return true
  } else {

    return false
  }
}


const readWallet = (chatID: number) => {
  let list: any = readJson()

  const walletList = []
  for (const key in list[chatID]) {
    if (Object.prototype.hasOwnProperty.call(list[chatID], key)) {
      walletList.push(key)
    }
  }

  return walletList
}

const removeWallet = (chatID: number, wallet_address: string) => {
  let list: any = readJson()

  delete list[chatID][wallet_address];

  writeJson(list)
}

const getUniqueWalletAddresses = async () => {
  try {
    const wallets = readJson()

    const temp = Object.values(wallets).map((ele: any) => Object.keys(ele)).flat()

    return temp

    // return uniqueAddresses; // Return the list of unique wallet addresses
  } catch (error) {
    console.error('Error fetching unique wallet addresses:', error);
    throw error; // Rethrow the error for further handling
  }
};

const abbrAddr = (addr: string) => `${addr.slice(0, 4)} ... ${addr.slice(addr.length - 5, addr.length - 1)}`

export {
  sleep,
  addWallet,
  readWallet,
  getUniqueWalletAddresses,
  removeWallet,
  abbrAddr,
}
