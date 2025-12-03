import React from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  HStack,
  Text,
  Box,
  Badge,
  SimpleGrid,
  useColorModeValue,
  Icon,
  Divider,
  useToast,
  Code,
  Textarea,
  Select,
} from '@chakra-ui/react';
import {
  MdComputer,
  MdSettings,
  MdTerminal,
  MdCameraAlt,
  MdCode,
  MdPlayArrow,
  MdStop,
  MdRefresh,
  MdPause,
  MdDelete,
  MdBuild,
  MdAspectRatio,
} from 'react-icons/md';
import { ComputeInstance } from '../variables/computeData';

interface InstanceDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  instance: ComputeInstance | null;
}

export default function InstanceDetailDrawer({ isOpen, onClose, instance }: InstanceDetailDrawerProps) {
  const toast = useToast();
  const labelColor = useColorModeValue('secondaryGray.600', 'gray.400');

  if (!instance) return null;

  const handleAction = (action: string) => {
    toast({
      title: `${action} Initiated`,
      description: `Request to ${action.toLowerCase()} instance ${instance.name} has been sent.`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Drawer isOpen={isOpen} placement='right' onClose={onClose} size='lg'>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth='1px'>
          <VStack align='start' spacing={1}>
            <Text fontSize='xl' fontWeight='bold'>{instance.name}</Text>
            <HStack>
              <Badge colorScheme={instance.status === 'Running' ? 'green' : 'red'}>
                {instance.status}
              </Badge>
              <Text fontSize='sm' color='gray.500'>{instance.id}</Text>
            </HStack>
          </VStack>
        </DrawerHeader>

        <DrawerBody p={0}>
          <Tabs isFitted variant='enclosed'>
            <TabList mb='1em'>
              <Tab><Icon as={MdComputer as any} mr={2} /> Overview</Tab>
              <Tab><Icon as={MdSettings as any} mr={2} /> Actions</Tab>
              <Tab><Icon as={MdTerminal as any} mr={2} /> Console</Tab>
              <Tab><Icon as={MdCameraAlt as any} mr={2} /> Snapshots</Tab>
              <Tab><Icon as={MdCode as any} mr={2} /> Metadata</Tab>
            </TabList>

            <TabPanels p={4}>
              {/* Overview Tab */}
              <TabPanel>
                <VStack spacing={6} align='stretch'>
                  <Box>
                    <Text fontSize='lg' fontWeight='bold' mb={4}>Instance Specifications</Text>
                    <SimpleGrid columns={2} spacing={4}>
                      <Box>
                        <Text color={labelColor} fontSize='sm'>Instance Type</Text>
                        <Text fontWeight='600'>{instance.type}</Text>
                      </Box>
                      <Box>
                        <Text color={labelColor} fontSize='sm'>Region</Text>
                        <Text fontWeight='600'>{instance.region}</Text>
                      </Box>
                      <Box>
                        <Text color={labelColor} fontSize='sm'>vCPU</Text>
                        <Text fontWeight='600'>{instance.cpu}</Text>
                      </Box>
                      <Box>
                        <Text color={labelColor} fontSize='sm'>Memory</Text>
                        <Text fontWeight='600'>{instance.ram}</Text>
                      </Box>
                    </SimpleGrid>
                  </Box>
                  <Divider />
                  <Box>
                    <Text fontSize='lg' fontWeight='bold' mb={4}>Network & System</Text>
                    <SimpleGrid columns={2} spacing={4}>
                      <Box>
                        <Text color={labelColor} fontSize='sm'>Public IP</Text>
                        <Text fontWeight='600'>{instance.ip}</Text>
                      </Box>
                      <Box>
                        <Text color={labelColor} fontSize='sm'>Private IP</Text>
                        <Text fontWeight='600'>10.0.0.15</Text>
                      </Box>
                      <Box>
                        <Text color={labelColor} fontSize='sm'>OS Image</Text>
                        <Text fontWeight='600'>Ubuntu 22.04 LTS</Text>
                      </Box>
                      <Box>
                        <Text color={labelColor} fontSize='sm'>Uptime</Text>
                        <Text fontWeight='600'>{instance.uptime}</Text>
                      </Box>
                    </SimpleGrid>
                  </Box>
                </VStack>
              </TabPanel>

              {/* Actions Tab */}
              <TabPanel>
                <VStack spacing={6} align='stretch'>
                  <Box>
                    <Text fontSize='md' fontWeight='bold' mb={3}>Power Control</Text>
                    <SimpleGrid columns={2} spacing={3}>
                      <Button leftIcon={<Icon as={MdPlayArrow as any} />} colorScheme='green' onClick={() => handleAction('Start')}>Start</Button>
                      <Button leftIcon={<Icon as={MdStop as any} />} colorScheme='red' onClick={() => handleAction('Stop')}>Stop</Button>
                      <Button leftIcon={<Icon as={MdRefresh as any} />} colorScheme='orange' onClick={() => handleAction('Reboot')}>Reboot</Button>
                      <Button leftIcon={<Icon as={MdPause as any} />} colorScheme='yellow' onClick={() => handleAction('Suspend')}>Suspend</Button>
                    </SimpleGrid>
                  </Box>
                  <Divider />
                  <Box>
                    <Text fontSize='md' fontWeight='bold' mb={3}>Management</Text>
                    <VStack spacing={3} align='stretch'>
                      <HStack justify='space-between'>
                        <VStack align='start' spacing={0}>
                          <Text fontWeight='600'>Resize Instance</Text>
                          <Text fontSize='xs' color='gray.500'>Change CPU and RAM resources</Text>
                        </VStack>
                        <Button size='sm' leftIcon={<Icon as={MdAspectRatio as any} />} onClick={() => handleAction('Resize')}>Resize</Button>
                      </HStack>
                      <HStack justify='space-between'>
                        <VStack align='start' spacing={0}>
                          <Text fontWeight='600'>Rebuild Instance</Text>
                          <Text fontSize='xs' color='gray.500'>Reinstall OS (Data will be lost)</Text>
                        </VStack>
                        <Button size='sm' colorScheme='red' variant='outline' leftIcon={<Icon as={MdBuild as any} />} onClick={() => handleAction('Rebuild')}>Rebuild</Button>
                      </HStack>
                      <HStack justify='space-between'>
                        <VStack align='start' spacing={0}>
                          <Text fontWeight='600'>Rescue Mode</Text>
                          <Text fontSize='xs' color='gray.500'>Boot into rescue OS for troubleshooting</Text>
                        </VStack>
                        <Button size='sm' variant='outline' onClick={() => handleAction('Rescue')}>Enter Rescue</Button>
                      </HStack>
                    </VStack>
                  </Box>
                </VStack>
              </TabPanel>

              {/* Console Tab */}
              <TabPanel>
                <VStack spacing={4} align='stretch' h='400px'>
                  <HStack justify='space-between'>
                    <Text fontWeight='bold'>VNC Console</Text>
                    <Button size='sm' leftIcon={<Icon as={MdTerminal as any} />}>Open in New Window</Button>
                  </HStack>
                  <Box bg='black' w='100%' h='100%' borderRadius='md' p={4} fontFamily='monospace' color='green.400' overflowY='auto'>
                    <Text>Connecting to {instance.id}...</Text>
                    <Text>Connected.</Text>
                    <Text>Ubuntu 22.04.1 LTS {instance.name} tty1</Text>
                    <Text mt={2}>{instance.name} login: _</Text>
                  </Box>
                </VStack>
              </TabPanel>

              {/* Snapshots Tab */}
              <TabPanel>
                <VStack spacing={4} align='stretch'>
                  <Button leftIcon={<Icon as={MdCameraAlt as any} />} colorScheme='brand' onClick={() => handleAction('Create Snapshot')}>
                    Take Snapshot
                  </Button>
                  <Divider />
                  <Text fontWeight='bold'>Recent Snapshots</Text>
                  <VStack align='stretch' spacing={2}>
                    {[1, 2].map((i) => (
                      <Box key={i} p={3} borderWidth='1px' borderRadius='md'>
                        <HStack justify='space-between'>
                          <VStack align='start' spacing={0}>
                            <Text fontWeight='600'>Snapshot-2023-10-{10+i}</Text>
                            <Text fontSize='xs' color='gray.500'>Size: 25GB • Created: 2 days ago</Text>
                          </VStack>
                          <HStack>
                            <Button size='sm' variant='ghost'>Restore</Button>
                            <Button size='sm' variant='ghost' colorScheme='red'><Icon as={MdDelete as any} /></Button>
                          </HStack>
                        </HStack>
                      </Box>
                    ))}
                  </VStack>
                </VStack>
              </TabPanel>

              {/* Metadata Tab */}
              <TabPanel>
                 <VStack spacing={4} align='stretch'>
                    <Box>
                        <Text fontWeight='bold' mb={2}>Instance Metadata</Text>
                        <Code p={4} borderRadius='md' w='100%' display='block' whiteSpace='pre'>
                            {JSON.stringify({
                                instanceId: instance.id,
                                region: instance.region,
                                type: instance.type,
                                imageId: 'ami-0c55b159cbfafe1f0',
                                privateIp: '10.0.0.15',
                                publicIp: instance.ip,
                            }, null, 2)}
                        </Code>
                    </Box>
                    <Divider />
                    <Box>
                        <Text fontWeight='bold' mb={2}>User Data</Text>
                        <Textarea 
                            placeholder='#!/bin/bash\napt-get update -y' 
                            minH='150px' 
                            fontFamily='monospace'
                            defaultValue='#!/bin/bash\necho "Hello World" > /var/www/html/index.html'
                        />
                        <HStack mt={2} justify='flex-end'>
                            <Select w='150px' size='sm' defaultValue='bash'>
                                <option value='bash'>Bash Shell</option>
                                <option value='powershell'>PowerShell</option>
                            </Select>
                            <Button size='sm' leftIcon={<Icon as={MdCode as any} />}>Update User Data</Button>
                        </HStack>
                    </Box>
                 </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </DrawerBody>

        <DrawerFooter borderTopWidth='1px'>
          <Button variant='outline' mr={3} onClick={onClose}>
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
