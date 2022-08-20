import { Flex } from "@chakra-ui/react";
import React, { ReactElement, useState } from "react";
import { ConnectWallet } from "../components/templates/ConnectWallet";
import { EditMetadata } from "../components/templates/EditMetadata";
import { InputContract } from "../components/templates/InputContract";
import { useWallet } from "../hooks/useWallet";
import { Step, StepProps } from "../types";

const stepMap: Record<Step, ({ setCurrentStep }: StepProps) => ReactElement> = {
    'connect': ConnectWallet,
    'input-contract': InputContract,
    'input-layersURI': ConnectWallet,
    'edit-metadata': EditMetadata,
};

export const Demo: React.FC = () => {
    const { client } = useWallet();
    const [currentStep, setCurrentStep] =
        // useState<Step>(client.connected ? 'input-contract' : 'connect');
        useState<Step>('edit-metadata');

    const setCurrStepWrapper = (step: Step) => {

        console.log(currentStep);
        console.log(step);
        setCurrentStep(step);
    };
    return (<Flex marginTop="200px" justifyContent="center" alignItems="center" minH="calc(100vh - 200px)">
        {stepMap[currentStep] &&
            React.createElement(stepMap[currentStep], { setCurrentStep: setCurrStepWrapper })
        }
    </Flex>);
};

export default Demo;