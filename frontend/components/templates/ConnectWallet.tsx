import { Button } from "@chakra-ui/react";
import { useEffect } from "react";
import { useWallet } from "../../hooks/useWallet";
import { StepProps } from "../../types";

interface ConnectWalletProps extends StepProps {
}

export const ConnectWallet = ({ setCurrentStep }: ConnectWalletProps) => {
    const { client, initClient } = useWallet();

    useEffect(() => {
        // if (client && client.connected)
        setCurrentStep('input-contract');
    }, [client]);

    const connect = () => {
        initClient();
    };
    return <Button onClick={connect}>
        Connect
    </Button>;
};