import { Flex } from "@chakra-ui/react";
import theme from "../../theme/theme";

interface ButtonShadowProps {

    children: React.ReactNode;
}
export const ButtonShadow = ({ children }: ButtonShadowProps) =>

    <Flex border={`4px solid ${theme.colours.darkBlue}`} paddingX="32px" h="72px" justifyContent="center" alignItems="center"
        className="nav-button"
        transition="0.4s"
        _hover={
            { transform: 'scale(1.03)' }
        }
        cursor="pointer">
        {children}
    </Flex>;
