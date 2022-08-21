import {
    Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Flex, HStack, Image, Input, Tab, Table, TableCaption,
    TableContainer, TabList, TabPanel, TabPanels, Tabs, Tbody, Td, Text, Th, Thead, Tr, useToast, VStack
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { getImage } from "../../apis/getImage";
import { getTokenMetadata } from "../../apis/getTokenMetadata";
import { useCollection } from "../../hooks/useCollection";
import theme from "../../theme/theme";
import { TokenData, UploadCollectionTraits } from "../../types";
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
    const [tokenMetadata, setTokenMetadata] = useState<TokenData>();
    const [initialTokenMetadata, setInitialTokenMetadata] = useState<TokenData>();
    const [image, setImage] = useState<string>();
    const toast = useToast();

    const handleChange = (event: any) => setTokenID(event.target.value);

    const onSubmitTokenID = async () => {
        if (!tokenID) return;
        try {
            const res = (await getTokenMetadata(collection.address, tokenID));
            if (res.success) {
                setTokenMetadata(res.data);
                setInitialTokenMetadata(res.data);
            } else {
                toast({
                    title: 'TokenID not found',
                    description: 'Try a new ID friendo',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
        catch (e) {
            toast({
                title: 'TokenID not found',
                description: 'Try a new ID friendo',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }

    };

    const onResetToken = () => {
        setTokenMetadata(initialTokenMetadata);
    };

    const onClickTrait = (traitType: string, value: string) => {
        if (!tokenMetadata) return;
        const removeTraitTypeTraits = tokenMetadata.attributes.filter(t => t.traitType !== traitType);

        const newTraits = [...removeTraitTypeTraits, { value, traitType }];

        setTokenMetadata({ ...tokenMetadata, attributes: newTraits });
        const getNewImage = async () => {

            const imageRes = await getImage(newTraits, collection.address);
            if (imageRes.success) {
                // console.log(imageRes.data.toString('base64'));
                // console.log(btoa(String.fromCharCode(imageRes.data.)));

                setImage(imageRes.data);
            }
        };
        getNewImage();

    };

    useEffect(() => {
        const get = async () => {
            setLayers((await axios.get<UploadCollectionTraits>(layersURI)).data);
        };
        get();

    }, []);



    return (
        <VStack spacing="40px">
            <HStack alignItems="start">
                <VStack w="30vw" spacing="24px">
                    <VStack>
                        <Input
                            fontFamily="Poppins, sans-serif"
                            value={tokenID}
                            onChange={handleChange}
                            placeholder="tokenID"
                            size="lg"
                            fontSize="20px"
                            w="100%"

                            h="48px"
                            color={theme.colours.darkBlue}
                            border={`4px solid ${theme.colours.darkBlue}`}
                            paddingX="12px"
                            borderColor={theme.colours.darkBlue}
                            _hover={{
                                borderColor: theme.colours.blue
                            }}
                            _active={{
                                borderColor: theme.colours.blue
                            }}
                        />
                        <HStack w="100%" justifyContent="center">
                            <Button
                                className="raise"
                                h="48px"
                                fontFamily="Poppins, sans-serif"
                                onClick={onResetToken}
                                fontSize="20px"
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
                            <Button
                                className="raise"
                                h="48px"
                                fontFamily="Poppins, sans-serif"
                                onClick={onSubmitTokenID}
                                fontSize="20px"
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
                    </VStack>

                    {tokenMetadata?.imageUrl ?
                        <Image src={image ?? tokenMetadata.imageUrl}
                            w="20vw" h="auto" border={`2px solid ${theme.colours.darkBlue}`}
                            alt={tokenMetadata.tokenID}
                        >

                        </Image> :
                        <Flex w="20vw" h="20vw" border={`2px solid ${theme.colours.darkBlue}`}>

                        </Flex>
                    }


                </VStack>
                <Tabs w="50vw" color={theme.colours.darkBlue} variant="unstyled"
                >
                    <TabList>
                        <Tab _selected={{
                            color: theme.colours.blue,
                            border: `4px solid ${theme.colours.blue}`
                        }} fontSize="24px">Layers</Tab>
                        <Tab _selected={{
                            color: theme.colours.blue,
                            border: `4px solid ${theme.colours.blue}`

                        }} fontSize="24px"> History</Tab>
                    </TabList>

                    <TabPanels w="100%">
                        <TabPanel >
                            {layers ?
                                <Accordion allowToggle w="100%" border={`2px solid ${theme.colours.darkBlue}`}>
                                    {Object.entries(layers.traits).map(([traitType, traits], j) => (
                                        <AccordionItem key={j} color={theme.colours.darkBlue}
                                        >
                                            <AccordionButton>
                                                <Box flex='1' textAlign='left'>
                                                    <Text fontSize="32px">{traitType}</Text>
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
                        </TabPanel>
                        <TabPanel>
                            <TableContainer>
                                <Table variant='striped' colorScheme='#000033'>
                                    <TableCaption>Last 5 metadata changes</TableCaption>
                                    <Thead>
                                        <Tr>
                                            <Th>Trait Type</Th>
                                            <Th>From</Th>
                                            <Th>To</Th>
                                            <Th>Time</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        <Tr>
                                            <Td>Hat</Td>
                                            <Td>Cap</Td>
                                            <Td>Beanie</Td>
                                            <Td >{(new Date()).toDateString()}</Td>
                                        </Tr>
                                        <Tr>
                                            <Td>Background</Td>
                                            <Td>Warm</Td>
                                            <Td>Sunset</Td>
                                            <Td >{(new Date()).toDateString()}</Td>
                                        </Tr>
                                        <Tr>
                                            <Td>Shoes</Td>
                                            <Td>Runners</Td>
                                            <Td>Thongs</Td>
                                            <Td >{(new Date()).toDateString()}</Td>
                                        </Tr>
                                        <Tr>
                                            <Td>Hat</Td>
                                            <Td>Top Hat</Td>
                                            <Td>Cap</Td>
                                            <Td >{(new Date()).toDateString()}</Td>
                                        </Tr>
                                        <Tr>
                                            <Td>Hat</Td>
                                            <Td>Beanie</Td>
                                            <Td>Top Hat</Td>
                                            <Td >{(new Date()).toDateString()}</Td>
                                        </Tr>
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </TabPanel>

                    </TabPanels>
                </Tabs>


            </HStack>
            <Button
                className="raise"
                h="80px"
                fontFamily="Poppins, sans-serif"
                onClick={() => { }}
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
                {collection.status === "writeable" ? 'Write' : 'Save'}
            </Button>
        </VStack>

    );
};