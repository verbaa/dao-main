export const TX_STORAGE_KEY = "pending_transactions";

type StoredTx = {
  hash: string;
  chainId: number;
  contract?: string;
  tag?: string;
  timestamp: number;
};

export function savePendingTx(tx: StoredTx) {
  const list = getTxs();
  const exists = list.find(t => t.hash === tx.hash);
  if (!exists) {
    list.push(tx);
    localStorage.setItem(TX_STORAGE_KEY, JSON.stringify(list));
  }
}

export function getTxs(): StoredTx[] {
  try {
    return JSON.parse(localStorage.getItem(TX_STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function removePendingTx(hash: string) {
  const list = getTxs().filter(t => t.hash !== hash);
  localStorage.setItem(TX_STORAGE_KEY, JSON.stringify(list));
}


export function clearOldTxs(maxAgeMinutes = 60) {
  const cutoff = Date.now() - maxAgeMinutes * 60_000;
  const fresh = getTxs().filter(t => t.timestamp > cutoff);
  localStorage.setItem(TX_STORAGE_KEY, JSON.stringify(fresh));
}