enum INPUT_ACTION {
  NoInput,
  AddWallet,
  AddWalletAlias,
  DelWallet,
  AddToken,
  GetToken,
  DelToken,
  AddTokenAddress,
  DelTokenAddress,
}

interface InputUserType {
  chatId: number,
}

type TitleData = {
  text?: string;
  instruction?: string;
  account?: string;
  index?: {
    ins_index: number;
    outer_ins_index: number;
  };
};

type MetadataList = {
  tokens: any;
  accounts: any;
  tags: any;
  programs: any;
  nftCollections: any;
  nftMarketplaces: any;
};

export {
  INPUT_ACTION,
  InputUserType,
  TitleData,
  MetadataList
}