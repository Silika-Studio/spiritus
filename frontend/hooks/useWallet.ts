import WalletConnect from '@walletconnect/client';
import React, { useContext } from 'react';

export const WalletContext = React.createContext<{
    client: WalletConnect;
}>({
    client: {} as any,

});

export const useWallet = () => {
    const context = useContext(WalletContext);

    return context;
};