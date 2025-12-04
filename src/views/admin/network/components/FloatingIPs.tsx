import React, { useState } from 'react';
import {
  Button,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  useColorModeValue,
  Icon,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { MdAdd, MdMoreVert, MdLink, MdLinkOff, MdCloud } from 'react-icons/md';
import Card from 'components/card/Card';
import { FloatingIP, mockFloatingIPs } from '../variables/networkData';

export default function FloatingIPs() {
  const [fips] = useState<FloatingIP[]>(mockFloatingIPs);
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  return (
    <Card flexDirection='column' w='100%' px='0px' overflowX={{ sm: 'scroll', lg: 'hidden' }}>
      <Flex px='25px' justify='space-between' mb='20px' align='center'>
        <Text color={textColor} fontSize='22px' fontWeight='700' lineHeight='100%'>
          Floating IPs
        </Text>
        <Button leftIcon={<Icon as={MdAdd as any} />} variant='brand'>
          Allocate IP
        </Button>
      </Flex>
      
      <Table variant='simple' color='gray.500' mb='24px'>
        <Thead>
          <Tr>
            <Th pe='10px' borderColor={borderColor}>Floating IP Address</Th>
            <Th pe='10px' borderColor={borderColor}>Fixed IP Address</Th>
            <Th pe='10px' borderColor={borderColor}>Status</Th>
            <Th pe='10px' borderColor={borderColor}>Mapped Fixed IP</Th>
            <Th pe='10px' borderColor={borderColor}>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {fips.map((fip) => (
            <Tr key={fip.id}>
              <Td borderColor={borderColor}>
                <Flex align='center'>
                  <Icon as={MdCloud as any} color='brand.500' me='10px' />
                  <Text color={textColor} fontSize='sm' fontWeight='700'>
                    {fip.floatingIpAddress}
                  </Text>
                </Flex>
              </Td>
              <Td borderColor={borderColor}>
                <Text color={textColor} fontSize='sm' fontWeight='700'>
                  {fip.fixedIpAddress || '-'}
                </Text>
              </Td>
              <Td borderColor={borderColor}>
                <Badge colorScheme={fip.status === 'Active' ? 'green' : 'red'}>
                  {fip.status}
                </Badge>
              </Td>
              <Td borderColor={borderColor}>
                <Text color={textColor} fontSize='sm' fontWeight='700'>
                  {fip.portId ? `Port: ${fip.portId}` : 'Unmapped'}
                </Text>
              </Td>
              <Td borderColor={borderColor}>
                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<Icon as={MdMoreVert as any} />}
                    variant='ghost'
                    size='sm'
                    aria-label='Options'
                  />
                  <MenuList>
                    {fip.portId ? (
                      <MenuItem icon={<Icon as={MdLinkOff as any} />}>Disassociate</MenuItem>
                    ) : (
                      <MenuItem icon={<Icon as={MdLink as any} />}>Associate</MenuItem>
                    )}
                    <MenuItem icon={<Icon as={MdLinkOff as any} />} color='red.500'>Release Floating IP</MenuItem>
                  </MenuList>
                </Menu>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Card>
  );
}
