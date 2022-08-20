import { ChakraProvider } from '@chakra-ui/react';
import WalletConnect from '@walletconnect/client';
import QRCodeModal from "@walletconnect/qrcode-modal";
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { CollectionContext } from '../hooks/useCollection';
import { WalletContext } from "../hooks/useWallet";
import '../styles/globals.css';
import { Collection } from '../types';


function MyApp({ Component, pageProps }: AppProps) {
    const [collection, setCollection] = useState<Collection>();
    const [signClient, setSignClient] = useState<WalletConnect>();
    const [address, setAddress] = useState('');

    const initClient = async () => {


        if (signClient && !signClient.connected) {
            // create new session
            await signClient.createSession();
            setAddress(signClient?.accounts[0] ?? '');
            console.log('init');
            console.log(signClient.accounts);

            signClient.on("connect", (error, payload) => {
                if (error) {
                    throw error;
                }
                const { accounts, chainId } = payload.params[0];
                console.log('connected', accounts);
                setAddress(accounts[0]);

            });

            signClient.on("session_update", (error, payload) => {
                if (error) {
                    throw error;
                }

                // Get updated accounts and chainId
                const { accounts, chainId } = payload.params[0];
                setAddress(accounts[0]);
            });

            signClient.on("disconnect", (error, payload) => {
                if (error) {
                    throw error;
                }
                setAddress('');

                // Delete connector
            });
        }
        // setSignsignClient(signClient);

    };

    const disconnectClient = async () => {
        if (signClient) {
            await signClient.killSession();
            // setSignClient(undefined);
            // setAddress('');
        }
    };

    useEffect(() => {
        setSignClient(new WalletConnect({
            bridge: "https://bridge.walletconnect.org", // Required
            qrcodeModal: QRCodeModal,
        }));
    }, []);

    useEffect(() => {
        setAddress(signClient?.accounts[0] ?? '');

    }, [signClient, signClient?.accounts]);

    return (
        <ChakraProvider>
            <WalletContext.Provider value={{
                client: signClient ?? {} as any,
                address,
                initClient,
                disconnectClient
            }}>
                <CollectionContext.Provider value={{
                    collection: collection ?? {
                        contractAddress: "0x69",
                        layersURI: "https://ipfs.moralis.io:2053/ipfs/QmZ6mcScDMKiYt49fddbMzFwmfmc6os2a7QsbeJ7ocZP2M/layers.json",
                        isSupported: true
                    } as any, setCollection
                }}>
                    <Navbar></Navbar>

                    <Component {...pageProps} />
                </CollectionContext.Provider>
            </WalletContext.Provider>
        </ChakraProvider>

    );

}

export default MyApp;
