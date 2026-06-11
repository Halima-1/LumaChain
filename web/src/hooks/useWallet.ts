import { useState, useCallback } from 'react';
import {
  isConnected,
  requestAccess,
  getPublicKey,
  getNetwork,
} from '@stellar/freighter-api';

interface WalletState {
  connected: boolean;
  publicKey: string | null;
  network: string | null;
  loading: boolean;
  error: string | null;
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    connected: false,
    publicKey: null,
    network: null,
    loading: false,
    error: null,
  });

  const checkConnection = useCallback(async () => {
    try {
      const connected = await isConnected();
      if (connected.isConnected) {
        const pubKey = await getPublicKey();
        const network = await getNetwork();
        setState({
          connected: true,
          publicKey: pubKey,
          network: network.network,
          loading: false,
          error: null,
        });
      }
    } catch {
      // Freighter not installed — silently ignore
    }
  }, []);

  const connect = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const connected = await isConnected();
      if (!connected.isConnected) {
        setState({
          connected: false,
          publicKey: null,
          network: null,
          loading: false,
          error: 'Freighter wallet extension not detected. Please install it from freighter.app.',
        });
        return;
      }

      const accessResult = await requestAccess();
      if (accessResult.error) {
        setState({
          connected: false,
          publicKey: null,
          network: null,
          loading: false,
          error: accessResult.error,
        });
        return;
      }

      const network = await getNetwork();
      setState({
        connected: true,
        publicKey: accessResult.publicKey,
        network: network.network,
        loading: false,
        error: null,
      });
    } catch (err) {
      setState({
        connected: false,
        publicKey: null,
        network: null,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to connect wallet',
      });
    }
  }, []);

  const disconnect = useCallback(() => {
    setState({
      connected: false,
      publicKey: null,
      network: null,
      loading: false,
      error: null,
    });
  }, []);

  return { ...state, connect, disconnect, checkConnection };
}