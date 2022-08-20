import { Button, HStack, Image, Stack, Text } from "@chakra-ui/react";
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import { useWallet } from "../hooks/useWallet";
import theme from "../theme/theme";
import { ButtonShadow } from "./atoms/ButtonShadow";





export const Navbar: React.FC = () => {
    const router = useRouter();
    const [hasBackground, setHasBackground] = useState(false);
    const { client, address, initClient, disconnectClient } = useWallet();
    useEffect(() => {
        if (router.pathname === '/') {
            const onScroll: EventListener = (_event: Event) => {

                setHasBackground(window.scrollY >= window.innerHeight);
            };

            window.addEventListener("scroll", onScroll);

            return () => { window.removeEventListener("scroll", onScroll); };
        }
    }, []);

    useEffect(() => {
        setHasBackground(router.pathname !== '/');
    }, [router.pathname]);

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
                        <Button onClick={client.connected ? disconnectClient : initClient} fontFamily="Poppins" margin="0px" fontSize="28px" fontWeight="bold"
                            cursor="pointer" border="none"
                            backgroundColor="transparent !important"
                            color={hasBackground ? theme.colours.darkBlue : theme.colours.textLight}
                        >
                            {client.connected ?
                                `${address.slice(0, 5)}...${address.slice(address.length - 4)}` : 'Connect'
                            }
                        </Button>
                    </ButtonShadow>
                </HStack>

            </HStack>
        </Stack>
    );
};