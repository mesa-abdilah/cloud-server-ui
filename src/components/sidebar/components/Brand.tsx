// Chakra imports
import { Flex } from '@chakra-ui/react';

// Custom components
import { HSeparator } from 'components/separator/Separator';
import { Image } from '@chakra-ui/react';
import logo from 'assets/img/logo/logo.png';

export function SidebarBrand(props: { collapsed?: boolean }) {
    const { collapsed } = props;

    return (
        <Flex alignItems='center' flexDirection='column'>
          <Image
            src={logo}
            alt='CodanCloud'
            width={collapsed ? 20 : 40}
            height={collapsed ? 20 : 40}
            style={{
                objectFit: 'contain'
            }}
          />
          <HSeparator mb='20px' />
        </Flex>
    );
}

export default SidebarBrand;
