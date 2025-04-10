import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import { Connection } from '@solana/web3.js';

dotenv.config();

const mainnetRPC = process.env.MAINNET_RPC!
const geyserRPC = process.env.GEYSER_RPC!
const FILTER_TOKEN = process.env.FILTER_TOKEN == "true" ? 0 : 1
const DEV_DEBUG = process.env.DEV_DEBUG == "true" ? true : false
const botToken = process.env.TOKEN!



const bot = new TelegramBot(botToken, { polling: true });

export {
  mainnetRPC,
  geyserRPC,
  bot,
  FILTER_TOKEN,
  DEV_DEBUG
}