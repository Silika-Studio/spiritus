import { Button, HStack, Input, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { getContract } from "../../apis/getContract";
import { useCollection } from "../../hooks/useCollection";
import theme from "../../theme/theme";
import { StepProps } from "../../types";

interface InputContractProps extends StepProps {
}

export const InputContract = ({ setCurrentStep }: InputContractProps) => {
    const { setCollection } = useCollection();
    const [isSearching, setIsSearching] = useState(false);
    const [value, setValue] = useState("");
    const handleChange = (event: any) => setValue(event.target.value);
    // call server for contract, if supported, go to 'edit-metadata'
    // else ask for layersURI

    const onSubmit = async () => {
        setIsSearching(true);
        const res = await getContract(value);
        setIsSearching(false);
        setCollection(res);
        setCurrentStep(!res.isWriteable ? 'input-layersURI' : 'edit-metadata');
    };
    return <VStack color={theme.colours.blueDark} fontSize="24px" alignItems="start">
        <Text>Please input a contract address</Text>

        <HStack fontFamily="Poppins, sans-serif" w="100%" spacing="16px" justifyContent="center" alignItems="center" h="100px">
            {isSearching ? <div className="loading">Searching</div>
                : <>
                    <Input
                        fontFamily="Poppins, sans-serif"
                        value={value}
                        onChange={handleChange}
                        placeholder="0xFEa49124b05B6137..."
                        size="lg"
                        w="444px"
                        fontSize="36px"
                        h="72px"
                        color={theme.colours.darkBlue}
                        border={`4px solid ${theme.colours.darkBlue}`}
                        borderColor={theme.colours.darkBlue}
                        _hover={{
                            borderColor: theme.colours.blue
                        }}
                        _active={{
                            borderColor: theme.colours.blue
                        }}
                        paddingX="12px"
                    />
                    <Button
                        className="raise"
                        h="80px"
                        fontFamily="Poppins, sans-serif"
                        onClick={onSubmit}
                        fontSize="32px"
                        cursor="pointer"
                        // background={theme.colours.darkBlue}
                        color={theme.colours.darkBlue}
                        border={`4px solid ${theme.colours.darkBlue}`}
                        backgroundColor="transparent !important"
                        // border="none"
                        paddingX="24px"
                        transition="0.25s"
                    >
                        Search
                    </Button>
                </>

            }
        </HStack>
    </VStack>;
};