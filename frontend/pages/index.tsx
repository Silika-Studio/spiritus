import { Button, HStack, Image, Stack, Text, VStack } from "@chakra-ui/react";
// import client from "@walletconnect/sign-client";
import Head from 'next/head';
import Link from "next/link";
import { useEffect } from "react";
import { useWalletConnectClient } from "../contexts/ClientContext";
import theme from "../theme/theme";

export default function Home() {
    const {
        client,
        pairings,
        session,
        connect,
        disconnect,
        chains,
        accounts,
        balances,
        isFetchingBalances,
        isInitializing,
        setChains,
    } = useWalletConnectClient();

    // useEffect(() => { disconnect(); }, []);
    useEffect(() => {
        setChains(["eip155:80001", "eip155:1"]);
    }, [accounts]);

    // const { client } = useWallet();
    // useEffect(() => {
    //     console.log(client);
    //     // else { client.killSession && client.killSession(); }
    // }, [client]);

    // useEffect(() => {
    //     console.log('signing');
    //     console.log(client);
    //     // Check if connection is already established
    //     if (client.connected) {

    //         const message = "My email is john@doe.com - 1537836206101";
    //         const address = client.accounts[0];
    //         console.log(client.accounts);
    //         const msgParams = [
    //             address,
    //             // keccak256("\x19Ethereum Signed Message:\n" + message.length + message)
    //             `0x${keccak256("\x19Ethereum Signed Message:\n" + message.length + message)}`

    //         ];

    //         console.log(msgParams);

    //         // Sign message
    //         client
    //             .signPersonalMessage(msgParams)
    //             .then((result) => {
    //                 // Returns signature.
    //                 console.log(result);
    //             })
    //             .catch(error => {
    //                 // Error returned when rejected
    //                 console.error(error);
    //             });

    //         // Get provided accounts and chainId
    //         console.log(client);

    //     }

    // }, [client]);
    return (
        <div >
            <Head>
                <title>Spiritus</title>
                <meta name="description" content="The dynamic NFT base layer" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <VStack h="100vh" w="100vw"
                    className="bg" justifyContent="space-between" spacing="0px" alignItems="center">
                    <Stack h="64px" w="100vw"></Stack>
                    <Image src="./spiritusmin.svg" alt="" w="46%" h="auto"
                    />
                    <Link href="/demo">
                        <Button h="80px" w="300px"
                            // borderRadius="12px"
                            backgroundColor={theme.colours.teal}
                            _hover={{ backgroundColor: theme.colours.teal }}
                            className="button-see-more"
                            fontFamily="Poppins, Arial, sans-serif"
                            fontSize="32px"
                            fontWeight="bold"
                            borderRadius="0px"
                            border={"none"}
                        >
                            <span className="line-1"></span>
                            <span className="line-2"></span>
                            <span className="line-3"></span>
                            <span className="line-4"></span>
                            <span className="line-5"></span>
                            <span className="line-6"></span>
                            Demo</Button>
                    </Link>

                    <HStack h="36px" w="100vw" backgroundColor="#3FD1FF" alignItems="center" justifyContent="space-evenly"
                        color={theme.colours.textDarkLight}>
                        <Text >learn more </Text>
                        <Text >learn more </Text>
                        <Text >learn more </Text>
                        <Text >learn more </Text>
                        <Text >learn more </Text>
                        <Text >learn more </Text>
                        <Text >learn more </Text>
                        <Text >learn more </Text>
                        <Text >learn more </Text>
                        <Text >learn more </Text>
                        <Text >learn more </Text>

                    </HStack>
                </VStack>
                <VStack h="100vh" w="100vw"
                    backgroundColor="white" justifyContent="space-around" spacing="0px" alignItems="center">
                    words
                </VStack>

            </main>

            {/* <footer className={styles.footer}>
            </footer> */}
        </div >
    );
}
