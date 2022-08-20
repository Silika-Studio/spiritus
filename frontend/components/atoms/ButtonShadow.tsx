import { Flex } from "@chakra-ui/react";
import theme from "../../theme/theme";

interface ButtonShadowProps {
    isLight: boolean;
    children: React.ReactNode;
}
export const ButtonShadow = ({ isLight, children }: ButtonShadowProps) =>

    <Flex border={`4px solid ${isLight ? theme.colours.teal : theme.colours.darkBlue}`} paddingX="32px" h="72px" justifyContent="center" alignItems="center"
        className={isLight ? 'nav-button-light' : "nav-button"}
        transition="0.4s"
        _hover={
            { transform: 'scale(1.03)' }
        }
        cursor="pointer">
        {children}
    </Flex>;
