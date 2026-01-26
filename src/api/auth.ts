import axios from 'axios';
import {generateNonce} from "siwe";

const API_URL = import.meta.env.API_BASE_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
});

export const getNonce = async (address: string) => {

  console.log(`[Api Getting nonce for ${address}`);
  return generateNonce();
};


export const verifySignature = async (address: string, signature: string): Promise<boolean> => {
  console.log(`[API] Verifying signature for address: ${address}. Signature length: ${signature.length}`);

  return new Promise((resolve) => setTimeout(() => resolve(true), 1000));
};