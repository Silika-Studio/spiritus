import { Button } from "@chakra-ui/react";
import { useEffect } from "react";
import { useWalletConnectClient } from "../../contexts/ClientContext";
import { StepProps } from "../../types";

interface ConnectWalletProps extends StepProps {
}

export const ConnectWallet = ({ setCurrentStep }: ConnectWalletProps) => {
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

    useEffect(() => {
        if (accounts.length)
            setCurrentStep('input-contract');
    }, [accounts]);

    const init = () => {
        connect();
    };
    return <Button onClick={init}>
        Connect
    </Button>;
};