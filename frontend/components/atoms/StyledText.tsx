import { HStack, Text } from "@chakra-ui/react";

interface StyledTextProps {
    before: string;
    styled: string;
    after: string;
}

export const StyledText = ({ before, styled, after }: StyledTextProps) => {

    return (
        <HStack fontSize="32px">
            <Text >{before}</Text>
            <Text ><mark className="styled-text">{styled}</mark></Text>
            <Text >{after}</Text>
        </HStack>
    );

};