import WalletConnect from '@walletconnect/client';
import React, { useContext } from 'react';

export const WalletContext = React.createContext<{
    client: WalletConnect;
    address: string;
    initClient: () => void;
    disconnectClient: () => void;
}>({
    client: {} as any,
    address: '',
    initClient: () => { },
    disconnectClient: () => { }

});

export const useWallet = () => {
    const context = useContext(WalletContext);

    return context;
};