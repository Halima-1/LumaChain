---
name: stellar-freighter-wallet
description: How to integrate Stellar Freighter wallet (v6+) in the LumaChain frontend — correct API names, return shapes, and connection flow
source: auto-skill
extracted_at: '2026-06-11T15:31:57.879Z'
---

# Stellar Freighter Wallet Integration (v6+)

## Key API Differences from Older Versions

The `@stellar/freighter-api` v6+ package has renamed several functions compared to earlier docs/tutorials:

| Old Name (v1-v4) | Correct Name (v6+) | Return Shape |
|---|---|---|
| `getPublicKey` | **`getAddress`** | `{ address: string, error?: FreighterApiError }` |
| `publicKey` field on `requestAccess` result | **`address`** field | `requestAccess()` returns `{ address: string, error?: FreighterApiError }` |
| disconnect (never existed) | **`setAllowed`** | Resets the `isAllowed` flag — closest thing to "disconnect" |

## Typical Connection Flow

```
1. isConnected()   → check extension is installed
2. isAllowed()     → check if app has permission
3. requestAccess() → prompt user to grant access (returns address)
4. getAddress()    → get the public key (as "address") without prompting
5. getNetwork()    → get current network info
```

## "Disconnect" Approach

Freighter has no explicit disconnect function. Use **`setAllowed()`** which resets the `isAllowed` permission flag, effectively revoking the app's access (soft disconnect). Then clear local state.

## Error Handling

All functions return `{ error?: FreighterApiError }` where:
```ts
interface FreighterApiError {
  code: number;
  message: string;
  ext?: string[];
}
```
Check `.error` on every result before using the data fields.

## Full Export List (v6.0.1)

`isConnected`, `isAllowed`, `requestAccess`, `getAddress`, `getNetwork`, `getNetworkDetails`, `setAllowed`, `signTransaction`, `signMessage`, `signAuthEntry`, `addToken`, `WatchWalletChanges`, `isBrowser`

## Implementation Pattern (useWallet hook)

Create a custom hook that:
- Wraps `isConnected` + `requestAccess` for connect
- Uses `getAddress` (not `getPublicKey`) to retrieve the wallet address
- Uses `setAllowed` for disconnect (clear local state + revoke permission)
- Stores `address` (not `publicKey`) in state
- Handles `error` field on every call
- Calls `checkConnection` (isConnected + getAddress) on mount via useEffect