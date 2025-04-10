import { abbrAddr } from "./utils";
import { readWalletAlias } from "./utils/wallets_alias";

const commandList = [
  { command: 'start', description: 'Available Command' },
  { command: 'add_wallet', description: 'Add Wallet Address' },
  { command: 'add_token', description: 'Add Token Address' },
  { command: 'get_wallet_list', description: 'Get Wallet Addresses' },
  { command: 'get_token_list', description: 'Get Token Addresses' },
  { command: 'del_wallet', description: 'Delete Wallet Address' },
  { command: 'del_token', description: 'Delete Token Address' },
];

const startMsg = () => {
  const msg =
    `Wallet Tracking Bot.

Available Command
  
/start : Show Available Command
/add_wallet : Add Wallet Address
/add_token : Add Token Address
/get_wallet_list : Get Wallet Addresses
/get_token_list : Get Token Addresses
/del_wallet : Delete Wallet Address
/del_token : Delete Token Address`

  return msg
}

const msgWalletList = (walletList: Array<string>, chatId: number) => {

  return `<b>[Add Wallet]</b>

${walletList.length == 0 ?
      "No Wallets"
      :
      `${walletList.map((ele, idx) => `#${idx + 1} <code>${ele}</code> [${readWalletAlias(chatId, ele)}]`).join("\n")}`

    }
  
Please Add new wallet for monitor`
}
const msgDelWalletList = (walletList: Array<string>, chatId: number) => {

  return `<b>[Delete Wallet]</b>

${walletList.length == 0 ?
      "No Wallets"
      :
      `${walletList.map((ele, idx) => `#${idx + 1} <code>${ele}</code> [${readWalletAlias(chatId, ele)}]`).join("\n")}`

    }
  
Please input one of above address`
}
const selectWalletList = (walletList: Array<string>, chatId: number) => {

  return `<b>[Select Wallet]</b>

${walletList.length == 0 ?
      "No Wallets"
      :
      `${walletList.map((ele, idx) => `#${idx + 1} <code>${ele}</code> [${readWalletAlias(chatId, ele)}]`).join("\n")}`

    }
  
Please Input one of above walletAddress for adding token`
}

const msgGetWalletList = (walletList: Array<string>, username: string, chatId: number) => {

  return `<b>[Get Wallets]</b>

${walletList.length == 0 ?
      "No Wallets"
      :
      `${walletList.map((ele, idx) => `#${idx + 1} <code>${ele}</code>  [${readWalletAlias(chatId, ele)}]`).join("\n")}`

    }
  
@${username}`
}

const inspectWalletList = (walletList: Array<string>, chatId: number) => {

  return `<b>[Select Wallets]</b>

${walletList.length == 0 ?
      "No Wallets"
      :
      `${walletList.map((ele, idx) => `#${idx + 1} <code>${ele}</code> [${readWalletAlias(chatId, ele)}]`).join("\n")}`

    }
  
Please Input one of above walletAddress for inspecting token`
}

const inspectTokenList = (tokenList: Array<string>, wallet_address: string, username: string) => {

  return `<b>[Select Wallets]</b> > <b>[${abbrAddr(wallet_address)}]</b>

${tokenList.length == 0 ?
      "No Tokens"
      :
      `${tokenList.map((ele, idx) => `#${idx + 1} <code>${ele}</code>`).join("\n")}`

    }
  
@${username} 's List`
}

const addTokenList = (tokenList: Array<string>) => {

  return `<b>[Select Wallet]</b> > <b>[Input New Token]</b>

${tokenList.length == 0 ?
      "No Tokens"
      :
      `${tokenList.map((ele, idx) => `#${idx + 1} <code>${ele}</code>`).join("\n")}`

    }
  
Please input token mint address to monitor`
}
const delTokenList = (tokenList: Array<string>) => {

  return `<b>[Select Wallet]</b> > <b>[Input Token Addr]</b>

${tokenList.length == 0 ?
      "No Tokens"
      :
      `${tokenList.map((ele, idx) => `#${idx + 1} <code>${ele}</code>`).join("\n")}`

    }
  
Please input token mint address to delete`
}

export {
  commandList,
  startMsg,
  msgWalletList,
  msgGetWalletList,
  selectWalletList,
  inspectWalletList,
  inspectTokenList,
  delTokenList,
  addTokenList,
  msgDelWalletList
}