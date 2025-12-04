import React, { useState } from 'react';
import {
  Box,
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
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Collapse,
} from '@chakra-ui/react';
import { MdAdd, MdMoreVert, MdEdit, MdDelete, MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import { Icon } from '@chakra-ui/react';
import Card from 'components/card/Card';
import { Network, mockNetworks } from '../variables/networkData';

export default function NetworkList() {
  const [networks] = useState<Network[]>(mockNetworks);
  const [expandedNet, setExpandedNet] = useState<string | null>(null);

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const bgHover = useColorModeValue('gray.50', 'navy.800');

  const toggleExpand = (id: string) => {
    setExpandedNet(expandedNet === id ? null : id);
  };

  return (
    <Card flexDirection='column' w='100%' px='0px' overflowX={{ sm: 'scroll', lg: 'hidden' }}>
      <Flex px='25px' justify='space-between' mb='20px' align='center'>
        <Text color={textColor} fontSize='22px' fontWeight='700' lineHeight='100%'>
          Networks
        </Text>
        <Button leftIcon={<Icon as={MdAdd as any} />} variant='brand'>
          Create Network
        </Button>
      </Flex>
      
      <Table variant='simple' color='gray.500' mb='24px'>
        <Thead>
          <Tr>
            <Th w='50px'></Th>
            <Th pe='10px' borderColor={borderColor}>Name</Th>
            <Th pe='10px' borderColor={borderColor}>Subnets Associated</Th>
            <Th pe='10px' borderColor={borderColor}>Status</Th>
            <Th pe='10px' borderColor={borderColor}>Admin State</Th>
            <Th pe='10px' borderColor={borderColor}>Shared</Th>
            <Th pe='10px' borderColor={borderColor}>External</Th>
            <Th pe='10px' borderColor={borderColor}>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {networks.map((net) => (
            <React.Fragment key={net.id}>
              <Tr>
                <Td borderColor={borderColor}>
                  <IconButton
                    aria-label='Expand'
                    icon={expandedNet === net.id ? <Icon as={MdKeyboardArrowUp as any} /> : <Icon as={MdKeyboardArrowDown as any} />}
                    size='sm'
                    variant='ghost'
                    onClick={() => toggleExpand(net.id)}
                  />
                </Td>
                <Td borderColor={borderColor}>
                  <Text color={textColor} fontSize='sm' fontWeight='700'>
                    {net.name}
                  </Text>
                </Td>
                <Td borderColor={borderColor}>
                  <Text color={textColor} fontSize='sm' fontWeight='700'>
                    {net.subnets.map(s => s.cidr).join(', ')}
                  </Text>
                </Td>
                <Td borderColor={borderColor}>
                  <Badge colorScheme={net.status === 'Active' ? 'green' : 'red'}>
                    {net.status}
                  </Badge>
                </Td>
                <Td borderColor={borderColor}>
                  <Text color={textColor} fontSize='sm' fontWeight='700'>
                    {net.adminState ? 'UP' : 'DOWN'}
                  </Text>
                </Td>
                <Td borderColor={borderColor}>
                  <Text color={textColor} fontSize='sm' fontWeight='700'>
                    {net.shared ? 'Yes' : 'No'}
                  </Text>
                </Td>
                <Td borderColor={borderColor}>
                  <Text color={textColor} fontSize='sm' fontWeight='700'>
                    {net.external ? 'Yes' : 'No'}
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
                    <MenuItem icon={<Icon as={MdEdit as any} />}>Edit Network</MenuItem>
                    <MenuItem icon={<Icon as={MdDelete as any} />} color='red.500'>Delete Network</MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
              <Tr>
                <Td colSpan={8} p={0} borderBottom={expandedNet === net.id ? '1px solid' : 'none'} borderColor={borderColor}>
                  <Collapse in={expandedNet === net.id} animateOpacity>
                    <Box p='20px' bg={bgHover}>
                      <Text fontWeight='bold' mb={2}>Subnets</Text>
                      {net.subnets.length > 0 ? (
                        <Table size='sm' variant='simple'>
                          <Thead>
                            <Tr>
                              <Th>Name</Th>
                              <Th>CIDR</Th>
                              <Th>IP Version</Th>
                              <Th>Gateway IP</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {net.subnets.map(sub => (
                              <Tr key={sub.id}>
                                <Td>{sub.name}</Td>
                                <Td>{sub.cidr}</Td>
                                <Td>IPv{sub.ipVersion}</Td>
                                <Td>{sub.gatewayIp}</Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      ) : (
                        <Text fontSize='sm' color='gray.500'>No subnets found.</Text>
                      )}
                    </Box>
                  </Collapse>
                </Td>
              </Tr>
            </React.Fragment>
          ))}
        </Tbody>
      </Table>
    </Card>
  );
}
