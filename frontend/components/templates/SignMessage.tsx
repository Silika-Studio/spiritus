import { Button } from "@chakra-ui/react";
import { StepProps } from "../../types";

interface SignMessageProps extends StepProps {
}

export const SignMessage = ({ setCurrentStep }: SignMessageProps) => {
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

    // const {
    //     ping,
    //     ethereumRpc,
    //     rpcResult,
    //     isTestnet,
    //     isRpcRequestPending,
    //     setIsTestnet,
    // } = useJsonRpc();

    const onSignPersonalMessage = async () => {
        // const [namespace, reference, address] = accounts[0].split(":");
        // const chainId = `${namespace}:${reference}`;
        // console.log(chainId);

        // await ethereumRpc.testSignPersonalMessage(chainId, address);
    };

    // useEffect(() => {
    //     onSignPersonalMessage();
    // }, [accounts]);

    // useEffect(() => {
    //     // console.log(isRpcRequestPending, rpcResult);
    //     if (rpcResult && !isRpcRequestPending) {
    //         setTimeout(() => setCurrentStep('input-contract'), 2000);
    //     }
    // }, [isRpcRequestPending, rpcResult]);



    const init = () => {
        onSignPersonalMessage();
    };
    return (
        <Button onClick={init}>
            Sign
        </Button>
    );

};