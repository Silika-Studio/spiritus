import { HStack, Stack, Text } from "@chakra-ui/react";

export const Navbar: React.FC = () => {

    return (
        <Stack zIndex="1000" position="fixed" top="0px" left="0px" h="200px" w="100vw" justifyContent="start">
            <HStack h="144px" w="100%" blur="8px" paddingX="32px">
                <Text fontFamily="Poppins" color="white" fontSize="36px" fontWeight="bold">Spiritus</Text>

            </HStack>
        </Stack>
    );
};