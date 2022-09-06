import { Button } from "@chakra-ui/react";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { StepProps } from "../../types";

interface ConnectWalletProps extends StepProps {
}

export const ConnectWallet = ({ setCurrentStep }: ConnectWalletProps) => {
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
        if (address)
            setCurrentStep('sign');
    }, [address]);

    // const init = () => {
    //     connect();
    // };
    return <Button onClick={address ? openAccountModal : openConnectModal}>
        Connect
    </Button>;
};