// Chakra imports
import { Flex, useColorModeValue } from '@chakra-ui/react';

// Custom components
import { CodanCloudLogo } from 'components/icons/Icons';
import { HSeparator } from 'components/separator/Separator';

export function SidebarBrand(props: { collapsed?: boolean }) {
    const { collapsed } = props;
	//   Chakra color mode
	let logoColor = useColorModeValue('navy.700', 'white');

    return (
        <Flex alignItems='center' flexDirection='column'>
            <CodanCloudLogo h={collapsed ? '26px' : '26px'} w={collapsed ? '38px' : '175px'} my='20px' color={logoColor} />
            <HSeparator mb='20px' />
        </Flex>
    );
}

export default SidebarBrand;
