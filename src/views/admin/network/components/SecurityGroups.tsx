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
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Collapse,
  Badge,
} from '@chakra-ui/react';
import { MdAdd, MdMoreVert, MdEdit, MdDelete, MdSecurity, MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import Card from 'components/card/Card';
import { SecurityGroup, mockSecurityGroups } from '../variables/networkData';

export default function SecurityGroups() {
  const [groups] = useState<SecurityGroup[]>(mockSecurityGroups);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const bgHover = useColorModeValue('gray.50', 'navy.800');

  const toggleExpand = (id: string) => {
    setExpandedGroup(expandedGroup === id ? null : id);
  };

  return (
    <Card flexDirection='column' w='100%' px='0px' overflowX={{ sm: 'scroll', lg: 'hidden' }}>
      <Flex px='25px' justify='space-between' mb='20px' align='center'>
        <Text color={textColor} fontSize='22px' fontWeight='700' lineHeight='100%'>
          Security Groups
        </Text>
        <Button leftIcon={<Icon as={MdAdd as any} />} variant='brand'>
          Create Security Group
        </Button>
      </Flex>
      
      <Table variant='simple' color='gray.500' mb='24px'>
        <Thead>
          <Tr>
            <Th w='50px'></Th>
            <Th pe='10px' borderColor={borderColor}>Name</Th>
            <Th pe='10px' borderColor={borderColor}>Description</Th>
            <Th pe='10px' borderColor={borderColor}>Rules Count</Th>
            <Th pe='10px' borderColor={borderColor}>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {groups.map((sg) => (
            <React.Fragment key={sg.id}>
              <Tr>
                <Td borderColor={borderColor}>
                  <IconButton
                    aria-label='Expand'
                    icon={expandedGroup === sg.id ? <Icon as={MdKeyboardArrowUp as any} /> : <Icon as={MdKeyboardArrowDown as any} />}
                    size='sm'
                    variant='ghost'
                    onClick={() => toggleExpand(sg.id)}
                  />
                </Td>
                <Td borderColor={borderColor}>
                  <Flex align='center'>
                    <Icon as={MdSecurity as any} color='brand.500' me='10px' />
                    <Text color={textColor} fontSize='sm' fontWeight='700'>
                      {sg.name}
                    </Text>
                  </Flex>
                </Td>
                <Td borderColor={borderColor}>
                  <Text color={textColor} fontSize='sm' fontWeight='700'>
                    {sg.description}
                  </Text>
                </Td>
                <Td borderColor={borderColor}>
                  <Badge colorScheme='blue'>{sg.rules.length} Rules</Badge>
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
                      <MenuItem icon={<Icon as={MdEdit as any} />}>Manage Rules</MenuItem>
                      <MenuItem icon={<Icon as={MdDelete as any} />} color='red.500'>Delete Group</MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
              <Tr>
                <Td colSpan={5} p={0} borderBottom={expandedGroup === sg.id ? '1px solid' : 'none'} borderColor={borderColor}>
                  <Collapse in={expandedGroup === sg.id} animateOpacity>
                    <Box p='20px' bg={bgHover}>
                      <Flex justify='space-between' mb={2}>
                        <Text fontWeight='bold'>Security Rules</Text>
                        <Button size='xs' leftIcon={<Icon as={MdAdd as any} />}>Add Rule</Button>
                      </Flex>
                      <Table size='sm' variant='simple'>
                        <Thead>
                          <Tr>
                            <Th>Direction</Th>
                            <Th>Ethertype</Th>
                            <Th>Protocol</Th>
                            <Th>Port Range</Th>
                            <Th>Remote IP Prefix</Th>
                            <Th>Actions</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {sg.rules.map(rule => (
                            <Tr key={rule.id}>
                              <Td>
                                <Badge colorScheme={rule.direction === 'ingress' ? 'green' : 'orange'}>
                                  {rule.direction}
                                </Badge>
                              </Td>
                              <Td>{rule.ethertype}</Td>
                              <Td>{rule.protocol.toUpperCase()}</Td>
                              <Td>{rule.portRangeMin ? `${rule.portRangeMin} - ${rule.portRangeMax}` : 'Any'}</Td>
                              <Td>{rule.remoteIpPrefix}</Td>
                              <Td>
                                <IconButton aria-label='Delete Rule' icon={<Icon as={MdDelete as any} />} size='xs' colorScheme='red' variant='ghost' />
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
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
