import axios from 'axios';
import {generateNonce} from "siwe";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
});

export const getNonce = async (address: string) => {
  // TODO: for real api call
  // const response = await api.get(`/auth/nonce?address=${address}`);
  // return response.data.nonce;

  console.log(`[Api Getting nonce for ${address}`);
  return generateNonce();
};

export const verifySignature = async (address: string, signature: string) => {
  // TODO: for real api call
  // const response = await api.post('/auth/verify', { address, signature });
  // return response.data;

  console.log(`Api Verifying signature for ${address}`);
  return new Promise((resolve) => setTimeout(() => resolve(true), 1000));
};