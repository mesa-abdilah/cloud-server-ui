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
import { MdAdd, MdMoreVert, MdEdit, MdDelete, MdRouter } from 'react-icons/md';
import Card from 'components/card/Card';
import { Router, mockRouters } from '../variables/networkData';

export default function RouterList() {
  const [routers] = useState<Router[]>(mockRouters);
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  return (
    <Card flexDirection='column' w='100%' px='0px' overflowX={{ sm: 'scroll', lg: 'hidden' }}>
      <Flex px='25px' justify='space-between' mb='20px' align='center'>
        <Text color={textColor} fontSize='22px' fontWeight='700' lineHeight='100%'>
          Routers
        </Text>
        <Button leftIcon={<Icon as={MdAdd as any} />} variant='brand'>
          Create Router
        </Button>
      </Flex>
      
      <Table variant='simple' color='gray.500' mb='24px'>
        <Thead>
          <Tr>
            <Th pe='10px' borderColor={borderColor}>Name</Th>
            <Th pe='10px' borderColor={borderColor}>Status</Th>
            <Th pe='10px' borderColor={borderColor}>External Gateway</Th>
            <Th pe='10px' borderColor={borderColor}>SNAT</Th>
            <Th pe='10px' borderColor={borderColor}>Admin State</Th>
            <Th pe='10px' borderColor={borderColor}>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {routers.map((router) => (
            <Tr key={router.id}>
              <Td borderColor={borderColor}>
                <Flex align='center'>
                  <Icon as={MdRouter as any} color='brand.500' me='10px' />
                  <Text color={textColor} fontSize='sm' fontWeight='700'>
                    {router.name}
                  </Text>
                </Flex>
              </Td>
              <Td borderColor={borderColor}>
                <Badge colorScheme={router.status === 'Active' ? 'green' : 'red'}>
                  {router.status}
                </Badge>
              </Td>
              <Td borderColor={borderColor}>
                <Text color={textColor} fontSize='sm' fontWeight='700'>
                  {router.externalGatewayInfo ? (
                    <>
                      {router.externalGatewayInfo.networkId} <br/>
                      <Text as='span' fontSize='xs' color='gray.500'>
                        {router.externalGatewayInfo.externalFixedIps.map(ip => ip.ipAddress).join(', ')}
                      </Text>
                    </>
                  ) : '-'}
                </Text>
              </Td>
              <Td borderColor={borderColor}>
                <Text color={textColor} fontSize='sm' fontWeight='700'>
                  {router.externalGatewayInfo?.enableSnat ? 'Enabled' : 'Disabled'}
                </Text>
              </Td>
              <Td borderColor={borderColor}>
                <Text color={textColor} fontSize='sm' fontWeight='700'>
                  {router.adminStateUp ? 'UP' : 'DOWN'}
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
                    <MenuItem icon={<Icon as={MdEdit as any} />}>Edit Router</MenuItem>
                    <MenuItem icon={<Icon as={MdDelete as any} />} color='red.500'>Delete Router</MenuItem>
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
