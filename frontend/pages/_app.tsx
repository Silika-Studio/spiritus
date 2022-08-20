import WalletConnect from '@walletconnect/client';
import QRCodeModal from "@walletconnect/qrcode-modal";
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { WalletContext } from "../hooks/useWallet";
import '../styles/globals.css';


function MyApp({ Component, pageProps }: AppProps) {
    const [signClient, setSignClient] = useState<WalletConnect>();

    useEffect(() => {
        const initClient = async () => {

            setSignClient(new WalletConnect({
                bridge: "https://bridge.walletconnect.org", // Required
                qrcodeModal: QRCodeModal,
            }));
            console.log(signClient);
            if (signClient && !signClient.connected) {
                // create new session
                await signClient.createSession();
            }

        };
        initClient();
    }
        , []);

    useEffect(() => {
        if (signClient && signClient.connected) {

            // Subscribe to connection events
            signClient.on("connect", (error, payload) => {
                if (error) {
                    throw error;
                }
                const { accounts, chainId } = payload.params[0];


            });

            signClient.on("session_update", (error, payload) => {
                if (error) {
                    throw error;
                }

                // Get updated accounts and chainId
                const { accounts, chainId } = payload.params[0];
            });

            signClient.on("disconnect", (error, payload) => {
                if (error) {
                    throw error;
                }

                // Delete connector
            });
        }


    }, [signClient?.connected]);
    return (
        <WalletContext.Provider value={{
            client: signClient ?? {} as any
        }}>
            <Component {...pageProps} />
        </WalletContext.Provider>
    );

}

export default MyApp;
