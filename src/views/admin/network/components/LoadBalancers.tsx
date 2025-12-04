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
import { MdAdd, MdMoreVert, MdEdit, MdDelete, MdDeviceHub } from 'react-icons/md';
import Card from 'components/card/Card';
import { LoadBalancer, mockLoadBalancers } from '../variables/networkData';

export default function LoadBalancers() {
  const [lbs] = useState<LoadBalancer[]>(mockLoadBalancers);
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  return (
    <Card flexDirection='column' w='100%' px='0px' overflowX={{ sm: 'scroll', lg: 'hidden' }}>
      <Flex px='25px' justify='space-between' mb='20px' align='center'>
        <Text color={textColor} fontSize='22px' fontWeight='700' lineHeight='100%'>
          Load Balancers
        </Text>
        <Button leftIcon={<Icon as={MdAdd as any} />} variant='brand'>
          Create Load Balancer
        </Button>
      </Flex>
      
      <Table variant='simple' color='gray.500' mb='24px'>
        <Thead>
          <Tr>
            <Th pe='10px' borderColor={borderColor}>Name</Th>
            <Th pe='10px' borderColor={borderColor}>VIP Address</Th>
            <Th pe='10px' borderColor={borderColor}>Operating Status</Th>
            <Th pe='10px' borderColor={borderColor}>Provisioning Status</Th>
            <Th pe='10px' borderColor={borderColor}>Provider</Th>
            <Th pe='10px' borderColor={borderColor}>Listeners</Th>
            <Th pe='10px' borderColor={borderColor}>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {lbs.map((lb) => (
            <Tr key={lb.id}>
              <Td borderColor={borderColor}>
                <Flex align='center'>
                  <Icon as={MdDeviceHub as any} color='brand.500' me='10px' />
                  <Text color={textColor} fontSize='sm' fontWeight='700'>
                    {lb.name}
                  </Text>
                </Flex>
              </Td>
              <Td borderColor={borderColor}>
                <Text color={textColor} fontSize='sm' fontWeight='700'>
                  {lb.vipAddress}
                </Text>
              </Td>
              <Td borderColor={borderColor}>
                <Badge colorScheme={lb.operatingStatus === 'ONLINE' ? 'green' : 'red'}>
                  {lb.operatingStatus}
                </Badge>
              </Td>
              <Td borderColor={borderColor}>
                <Text color={textColor} fontSize='sm' fontWeight='700'>
                  {lb.provisioningStatus}
                </Text>
              </Td>
              <Td borderColor={borderColor}>
                <Text color={textColor} fontSize='sm' fontWeight='700'>
                  {lb.provider}
                </Text>
              </Td>
              <Td borderColor={borderColor}>
                <Text color={textColor} fontSize='sm' fontWeight='700'>
                  {lb.listeners.length}
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
                    <MenuItem icon={<Icon as={MdEdit as any} />}>Edit</MenuItem>
                    <MenuItem icon={<Icon as={MdDelete as any} />} color='red.500'>Delete</MenuItem>
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
