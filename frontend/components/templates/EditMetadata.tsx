import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Flex, HStack, Image, Input, Text, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { getTokenMetadata } from "../../apis/getTokenMetadata";
import { useCollection } from "../../hooks/useCollection";
import theme from "../../theme/theme";
import { NFT, UploadCollectionTraits } from "../../types";

interface TraitProps {
    traitType: string;
    value: string;
    onClick: (traitType: string, value: string) => void;
    isActive: boolean;
    url: string;
}

const Trait = ({ traitType, value, onClick, isActive, url }: TraitProps) => {
    const onClickWithData = () => {
        onClick(traitType, value);
    };
    return (
        <Button
            margin="4px !important"
            onClick={onClickWithData}
            border={isActive ? `2px solid ${theme.colours.teal}` : '2px solid transparent'}
            cursor="pointer"
            _hover={{ border: `2px solid ${theme.colours.darkBlue}` }}
            transition="0.25s"
            height="100%"
            paddingY="12px"
            borderRadius="0px"
            background="transparent"
        >
            <VStack
            >
                <Image src={url} h="100px" w="auto" border="1px solid black"></Image>
                <Text maxW="100px" overflowWrap="break-word" whiteSpace="normal">{value}</Text>
            </VStack>
        </Button>
    );
};

export const EditMetadata = () => {
    const { collection } = useCollection();
    const { layersURI } = collection;
    const gateway = 'https://ipfs.moralis.io:2053/ipfs/';
    const [layers, setLayers] = useState<UploadCollectionTraits>();
    const [tokenID, setTokenID] = useState<string>('');
    const [tokenMetadata, setTokenMetadata] = useState<NFT>();
    const [initialTokenMetadata, setInitialTokenMetadata] = useState<NFT>();

    const handleChange = (event: any) => setTokenID(event.target.value);

    const onSubmitTokenID = async () => {
        if (!tokenID) return;
        const res = (await getTokenMetadata(collection.contractAddress, tokenID));

        setTokenMetadata(res);
        setInitialTokenMetadata(res);
    };

    const onResetToken = () => {
        setTokenMetadata(initialTokenMetadata);
    };

    const onClickTrait = (traitType: string, value: string) => {
        if (!tokenMetadata) return;
        const removeTraitTypeTraits = tokenMetadata.attributes.filter(t => t.traitType !== traitType);

        const newTraits = [...removeTraitTypeTraits, { value, traitType }];

        setTokenMetadata({ ...tokenMetadata, attributes: newTraits });
    };

    useEffect(() => {
        const get = async () => {
            setLayers((await axios.get<UploadCollectionTraits>(layersURI)).data);
        };
        get();
    }, []);



    return (<HStack alignItems="start">
        <VStack w="30vw" spacing="24px">
            {tokenMetadata?.image ?
                <Image src={tokenMetadata.image}
                    w="20vw" h="auto" border={`2px solid ${theme.colours.darkBlue}`}
                    alt={tokenMetadata.tokenID}
                >

                </Image> :
                <Flex w="20vw" h="20vw" border={`2px solid ${theme.colours.darkBlue}`}>

                </Flex>
            }
            <HStack w="100%" justifyContent="center">
                <Input
                    fontFamily="Poppins, sans-serif"
                    value={tokenID}
                    onChange={handleChange}
                    placeholder="tokenID"
                    size="lg"
                    fontSize="24px"
                    w="144px"

                    h="72px"
                    color={theme.colours.darkBlue}
                    border={`4px solid ${theme.colours.darkBlue}`}
                    paddingX="12px"
                />
                <Button
                    className="raise"
                    h="80px"
                    fontFamily="Poppins, sans-serif"
                    onClick={onSubmitTokenID}
                    fontSize="32px"
                    cursor="pointer"
                    // background={theme.colours.darkBlue}
                    background="transparent"
                    _hover={{ background: "transparent" }}
                    color={theme.colours.darkBlue}
                    border={`4px solid ${theme.colours.darkBlue}`}
                    // border="none"
                    paddingX="24px"
                    transition="0.25s"
                >
                    Search
                </Button>

            </HStack>
            <Button
                className="raise"
                h="80px"
                fontFamily="Poppins, sans-serif"
                onClick={onResetToken}
                fontSize="32px"
                cursor="pointer"
                // background={theme.colours.darkBlue}
                background="transparent"
                _hover={{ background: "transparent" }}
                color={theme.colours.darkBlue}
                border={`4px solid ${theme.colours.darkBlue}`}
                // border="none"
                paddingX="24px"
                transition="0.25s"
            >
                Reset
            </Button>
        </VStack>
        {layers ?
            <Accordion allowToggle w="50vw" border={`2px solid ${theme.colours.darkBlue}`}>
                {Object.entries(layers.traits).map(([traitType, traits], j) => (
                    <AccordionItem key={j} color={theme.colours.darkBlue}

                    >
                        <AccordionButton>
                            <Box flex='1' textAlign='left'>
                                <Text fontSize="32px" fontWeight="bold">{traitType}</Text>
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel pb={4}>
                            <HStack key={j} justifyContent="space-evenly" spacing="0px" flexWrap="wrap">
                                {traits.map((trait, i) =>
                                    <Trait
                                        key={i}
                                        url={`${gateway}${layers.rootHash}/${trait.url}`}
                                        traitType={traitType}
                                        value={trait.value}
                                        isActive={!!(tokenMetadata && tokenMetadata.attributes.find(tt => tt.traitType === traitType && tt.value === trait.value))}
                                        onClick={onClickTrait}
                                    />
                                )}
                            </HStack>
                        </AccordionPanel>

                    </AccordionItem>
                )
                )}
            </Accordion>

            : <>Loading</>}
    </HStack>

    );
};