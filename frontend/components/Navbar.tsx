import { Button, HStack, Image, Stack, Text } from "@chakra-ui/react";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import theme from "../theme/theme";
import { ButtonShadow } from "./atoms/ButtonShadow";





export const Navbar: React.FC = () => {
    const router = useRouter();
    const [hasBackground, setHasBackground] = useState(false);
    const { address } = useAccount();
    const { openConnectModal } = useConnectModal();
    const { openAccountModal } = useAccountModal();
    // const {
    //     client,
    //     pairings,
    //     session,
    //     connect,
    //     disconnect,
    //     chains,
    //     accounts,
    //     balances,
    //     isFetchingBalances,
    //     isInitializing,
    //     setChains,
    // } = useWalletConnectClient();


    useEffect(() => {
        const onScroll: EventListener = (_event: any) => {
            // if (router.pathname === '/')
            setHasBackground(_event.target.scrollingElement.scrollTop >= _event.target.scrollingElement.clientHeight - 200 || router.pathname !== '/');

        };

        window.addEventListener("scroll", onScroll);

        return () => window.removeEventListener("scroll", onScroll);;
    }, [router.pathname]);

    // useEffect(() => {
    //     console.log("SETTING BG");
    //     setHasBackground(router.pathname !== '/');
    // }, [router.pathname]);

    // const account = accounts.length ? accounts[0].split(':')[2] : undefined;
    // console.log(account);
    return (
        <Stack zIndex="1000" position="fixed" top="0px" left="0px" h="200px" w="100vw" >
            <HStack h="144px" justifyContent="space-between" blur="8px" paddingX="48px"
                backgroundColor={hasBackground ? theme.colours.white : undefined}
                borderBottom={hasBackground ? `3px solid ${theme.colours.darkBlue}` : undefined}
                transition="0.4s"
                color={hasBackground ? theme.colours.darkBlue : theme.colours.textLight}
            >
                <Link href="/"
                >
                    <HStack
                        transition="0.4s"
                        _hover={
                            { transform: 'scale(1.03)' }
                        }
                        cursor="pointer"
                    >
                        <Image src={hasBackground ? "./logo-dark.png" : "./logo-white.png"} h="56px" w="auto" alt="Spiritus logo" />
                        <Text fontFamily="Poppins" fontSize="36px" fontWeight="bold">Spiritus</Text>
                    </HStack>
                </Link>
                <HStack spacing="36px">
                    <ButtonShadow isLight={!hasBackground}>
                        <Link href="/demo"
                        >
                            <Text fontFamily="Poppins" margin="0px" fontSize="28px" fontWeight="bold">Demo</Text>
                        </Link>
                    </ButtonShadow>

                    <ButtonShadow isLight={!hasBackground}>
                        <Button onClick={address ? openAccountModal : openConnectModal} fontFamily="Poppins" margin="0px" fontSize="28px" fontWeight="bold"
                            cursor="pointer" border="none"
                            backgroundColor="transparent !important"
                            color={hasBackground ? theme.colours.darkBlue : theme.colours.textLight}
                        >
                            {address ?
                                `${address.slice(0, 5)}...${address.slice(address.length - 4)}` :
                                'Connect'
                            }
                        </Button>
                        {/* <ConnectButton /> */}
                    </ButtonShadow>
                </HStack>

            </HStack>
        </Stack>
    );
};