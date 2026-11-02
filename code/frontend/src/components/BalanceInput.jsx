import React from 'react';
import { useFinanceStore } from '../store/useFinanceStore';

// Session-only input: imported transactions do not establish the current balance.
export default function BalanceInput() {
  const balance = useFinanceStore((state) => state.cashBalance);
  const setBalance = useFinanceStore((state) => state.setCashBalance);
  return (
    <label className="block max-w-md rounded-2xl border border-purple-500/30 bg-black/30 p-4 text-sm text-white/80">
      <span className="block font-bold mb-2">Available savings (enter your current balance)</span>
      <input type="number" min="0" step="0.01" inputMode="decimal" value={balance ?? ''}
        onChange={(event) => {
          const value = event.target.value;
          setBalance(value === '' ? null : Math.max(0, Number(value) || 0));
        }}
        className="w-full rounded-lg bg-black/40 border border-white/20 px-3 py-2 text-white"
        placeholder="Enter amount" />
      <span className="block mt-2 text-xs text-white/50">Used for this session only. CSV activity does not establish your current balance.</span>
    </label>
  );
}
