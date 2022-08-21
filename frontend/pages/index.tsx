import { Button, Flex, HStack, Image, Stack, Text, VStack } from "@chakra-ui/react";
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


    return (
        <div >
            <Head>
                <title>Spiritus</title>
                <meta name="description" content="The dynamic NFT base layer" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <div>
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
                            color={theme.colours.textDarkLight} >


                            <Text >learn more </Text>
                            <Text >▼ </Text>
                            <Text >learn more </Text>
                            <Text >▼ </Text>
                            <Text >learn more </Text>
                            <Text >▼ </Text>
                            <Text >learn more </Text>
                            <Text >▼ </Text>
                            <Text >learn more </Text>
                            <Text >▼ </Text>
                            <Text >learn more </Text>
                            <Text >▼ </Text>
                            <Text >learn more </Text>


                        </HStack>
                    </VStack>
                    <VStack minH="100vh" w="100vw"
                        paddingY="5%"
                        backgroundColor="white" justifyContent="space-evenly" alignItems="center" spacing="24px" fontSize="32px" paddingX="15%">
                        <p>
                            <Text textAlign="center">
                                The vast majority of NFT collections are <mark>static</mark>. The token metadata feels like an <mark>afterthought</mark>.
                            </Text>
                        </p>

                        <p>
                            <Text textAlign="center">
                                We currently see the token mainly as an image, with attriubutes that <mark>describe</mark> that image. We believe that this is <mark>backwards</mark>.
                            </Text>
                        </p>

                        <p>
                            <Text textAlign="center">
                                For collections to become more interesting, more <mark>dynamic</mark>, it only makes sense that the traits be treated as the source of truth for a token. The image should be a <mark>derivative</mark> of the traits.
                            </Text>
                        </p>

                        <p>
                            <Text textAlign="center">
                                To go one step further, trait updates should be <mark>transparent</mark>, with <mark>on-chain</mark> history.
                            </Text>
                        </p>

                        <p>
                            <Text textAlign="center">
                                That&apos;s where we come in. <mark style={{ fontWeight: "bold" }}>Spiritus</mark> is a platform that makes handling dNFT metadata updates <mark>simple</mark>, without having to move data further off-chain.
                            </Text>
                        </p>

                    </VStack>
                    <VStack w="100vw" paddingY="10vh" spacing="48px">
                        <Text fontSize="48px">Built with:</Text>
                        <HStack w="100%" justifyContent="space-evenly" h="200px">
                            <Flex outline={`6px solid ${theme.colours.darkBlue} !important`} h="100%" padding="8px 24px">
                                <Image src="./partners/polygon.svg" minW="300px" w="25vw" h="auto"

                                ></Image>
                            </Flex>
                            <Flex outline={`6px solid ${theme.colours.darkBlue} !important`} h="100%" padding="8px 24px">
                                <Image src="./partners/ipfs.svg" minW="300px" w="25vw" h="auto"></Image>
                            </Flex>
                        </HStack>
                        <HStack w="100%" justifyContent="space-evenly" h="200px">
                            <Flex outline={`6px solid ${theme.colours.darkBlue} !important`} h="100%" padding="8px 24px">
                                <Image src="./partners/tableland.svg" minW="300px" w="25vw" h="auto"></Image>
                            </Flex>
                            <Flex outline={`6px solid ${theme.colours.darkBlue} !important`} h="100%" padding="8px 24px" justifyContent="center" alignItems="center">
                                <Image src="./partners/walletconnect.svg" minW="300px" w="25vw" h="4vw"></Image>
                            </Flex>
                        </HStack>
                        <HStack w="100%" justifyContent="space-evenly">
                            <Flex outline={`6px solid ${theme.colours.darkBlue} !important`} h="100%" padding="8px 24px">
                                <Image src="./partners/nft-storage.svg" minW="300px" w="25vw" h="auto"></Image>
                            </Flex>
                        </HStack>

                    </VStack>
                </div>

            </main>

            <footer >
                <VStack textAlign="center" w="100vw" justifyContent="center" paddingY="12px" spacing="3px">
                    <Flex
                        h="4px" w="100%" backgroundColor={theme.colours.darkBlue}
                    ></Flex>
                    <Flex
                        h="2px" w="100%" backgroundColor={theme.colours.darkBlue}
                    ></Flex>
                    <Flex
                        h="1px" w="100%" backgroundColor={theme.colours.darkBlue}
                    ></Flex>
                    <Text paddingTop="4px">
                        Built by  &nbsp; <a href="https://twitter.com/0xtygra" rel="noreferrer" target="_blank">@0xtygra</a> &nbsp; and   &nbsp;<a href="https://twitter.com/0xetash" rel="noreferrer" target="_blank">@0xetash</a> &nbsp; for ETHMexico
                    </Text>
                </VStack>
            </footer>
        </div >
    );
}
