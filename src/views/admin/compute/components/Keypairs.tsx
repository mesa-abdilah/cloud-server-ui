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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  useDisclosure,
  useToast,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { MdAdd, MdVpnKey, MdFileUpload, MdDelete, MdMoreVert, MdDownload, MdLink } from 'react-icons/md';
import Card from 'components/card/Card';

interface Keypair {
  id: string;
  name: string;
  fingerprint: string;
  type: string;
  created: string;
}

const initialKeypairs: Keypair[] = [
  {
    id: 'kp-1',
    name: 'dev-team-key',
    fingerprint: 'SHA256:eX0.../G8',
    type: 'RSA 4096',
    created: '2023-10-15',
  },
  {
    id: 'kp-2',
    name: 'prod-server-key',
    fingerprint: 'SHA256:aB9.../K2',
    type: 'ED25519',
    created: '2023-09-20',
  },
];

export default function Keypairs() {
  const [keypairs, setKeypairs] = useState<Keypair[]>(initialKeypairs);
  const { isOpen: isGenerateOpen, onOpen: onGenerateOpen, onClose: onGenerateClose } = useDisclosure();
  const { isOpen: isImportOpen, onOpen: onImportOpen, onClose: onImportClose } = useDisclosure();
  const { isOpen: isAssignOpen, onOpen: onAssignOpen, onClose: onAssignClose } = useDisclosure();
  
  const toast = useToast();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  // Form States
  const [keyName, setKeyName] = useState('');
  const [keyType, setKeyType] = useState('RSA');
  const [keyBits, setKeyBits] = useState('4096');
  const [publicKey, setPublicKey] = useState('');
  const [selectedInstance, setSelectedInstance] = useState('');

  const handleGenerate = () => {
    if (!keyName) return;
    
    const newKey: Keypair = {
      id: `kp-${Date.now()}`,
      name: keyName,
      fingerprint: `SHA256:${Math.random().toString(36).substr(2, 10)}...`,
      type: `${keyType} ${keyType === 'RSA' ? keyBits : ''}`,
      created: new Date().toISOString().split('T')[0],
    };

    setKeypairs([...keypairs, newKey]);
    onGenerateClose();
    setKeyName('');
    
    toast({
      title: 'Keypair Generated',
      description: `Private key for ${newKey.name} has been downloaded.`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  const handleImport = () => {
    if (!keyName || !publicKey) return;

    const newKey: Keypair = {
      id: `kp-${Date.now()}`,
      name: keyName,
      fingerprint: `SHA256:${Math.random().toString(36).substr(2, 10)}...`,
      type: 'Imported',
      created: new Date().toISOString().split('T')[0],
    };

    setKeypairs([...keypairs, newKey]);
    onImportClose();
    setKeyName('');
    setPublicKey('');

    toast({
      title: 'Keypair Imported',
      description: `${newKey.name} has been successfully imported.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleAssign = () => {
    if (!selectedInstance) return;
    
    onAssignClose();
    toast({
      title: 'Keypair Assigned',
      description: `Keypair assigned to instance ${selectedInstance}.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleDelete = (id: string) => {
    setKeypairs(keypairs.filter(k => k.id !== id));
    toast({
      title: 'Keypair Deleted',
      status: 'info',
      duration: 2000,
    });
  };

  return (
    <Box>
      <Card flexDirection='column' w='100%' px='0px' overflowX={{ sm: 'scroll', lg: 'hidden' }}>
        <Flex px='25px' justify='space-between' mb='20px' align='center'>
          <Text color={textColor} fontSize='22px' fontWeight='700' lineHeight='100%'>
            SSH Keypairs
          </Text>
          <HStack>
            <Button leftIcon={<Icon as={MdFileUpload as any} />} variant='outline' onClick={onImportOpen}>
              Import Key
            </Button>
            <Button leftIcon={<Icon as={MdAdd as any} />} variant='brand' onClick={onGenerateOpen}>
              Generate Key
            </Button>
          </HStack>
        </Flex>
        
        <Table variant='simple' color='gray.500' mb='24px'>
          <Thead>
            <Tr>
              <Th pe='10px' borderColor={borderColor}>Name</Th>
              <Th pe='10px' borderColor={borderColor}>Fingerprint</Th>
              <Th pe='10px' borderColor={borderColor}>Type</Th>
              <Th pe='10px' borderColor={borderColor}>Created</Th>
              <Th pe='10px' borderColor={borderColor}>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {keypairs.map((key) => (
              <Tr key={key.id}>
                <Td borderColor={borderColor}>
                  <Flex align='center'>
                    <Icon as={MdVpnKey as any} color='brand.500' me='10px' />
                    <Text color={textColor} fontSize='sm' fontWeight='700'>
                      {key.name}
                    </Text>
                  </Flex>
                </Td>
                <Td borderColor={borderColor}>
                  <Text color={textColor} fontSize='sm' fontWeight='700'>
                    {key.fingerprint}
                  </Text>
                </Td>
                <Td borderColor={borderColor}>
                  <Text color={textColor} fontSize='sm' fontWeight='700'>
                    {key.type}
                  </Text>
                </Td>
                <Td borderColor={borderColor}>
                  <Text color={textColor} fontSize='sm' fontWeight='700'>
                    {key.created}
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
                      <MenuItem icon={<Icon as={MdLink as any} />} onClick={onAssignOpen}>Assign to Instance</MenuItem>
                      <MenuItem icon={<Icon as={MdDownload as any} />}>Download Public Key</MenuItem>
                      <MenuItem icon={<Icon as={MdDelete as any} />} color='red.500' onClick={() => handleDelete(key.id)}>Delete</MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>

      {/* Generate Key Modal */}
      <Modal isOpen={isGenerateOpen} onClose={onGenerateClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Generate SSH Keypair</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4} isRequired>
              <FormLabel>Key Name</FormLabel>
              <Input placeholder='my-key-pair' value={keyName} onChange={(e) => setKeyName(e.target.value)} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Key Type</FormLabel>
              <Select value={keyType} onChange={(e) => setKeyType(e.target.value)}>
                <option value='RSA'>RSA</option>
                <option value='ED25519'>ED25519</option>
              </Select>
            </FormControl>
            {keyType === 'RSA' && (
              <FormControl mb={4}>
                <FormLabel>Key Length (Bits)</FormLabel>
                <Select value={keyBits} onChange={(e) => setKeyBits(e.target.value)}>
                  <option value='2048'>2048</option>
                  <option value='4096'>4096</option>
                </Select>
              </FormControl>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={onGenerateClose}>Cancel</Button>
            <Button colorScheme='brand' onClick={handleGenerate}>Generate & Download</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Import Key Modal */}
      <Modal isOpen={isImportOpen} onClose={onImportClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Import Public Key</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4} isRequired>
              <FormLabel>Key Name</FormLabel>
              <Input placeholder='imported-key' value={keyName} onChange={(e) => setKeyName(e.target.value)} />
            </FormControl>
            <FormControl mb={4} isRequired>
              <FormLabel>Public Key Content</FormLabel>
              <Textarea 
                placeholder='ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC...' 
                value={publicKey} 
                onChange={(e) => setPublicKey(e.target.value)}
                minH='150px'
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={onImportClose}>Cancel</Button>
            <Button colorScheme='brand' onClick={handleImport}>Import Key</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Assign Key Modal */}
      <Modal isOpen={isAssignOpen} onClose={onAssignClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Assign Key to Instance</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4} fontSize='sm' color='gray.500'>
              Select an instance to associate with this keypair. Note: This usually requires a reboot or agent support.
            </Text>
            <FormControl>
              <FormLabel>Select Instance</FormLabel>
              <Select placeholder='Choose instance...' onChange={(e) => setSelectedInstance(e.target.value)}>
                <option value='i-0a1b2c3d4e5f'>Web-Server-01</option>
                <option value='i-1b2c3d4e5f6g'>DB-Primary</option>
                <option value='i-2c3d4e5f6g7h'>Worker-Node-Alpha</option>
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={onAssignClose}>Cancel</Button>
            <Button colorScheme='brand' onClick={handleAssign} isDisabled={!selectedInstance}>Assign</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
