import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Input,
  Select,
  Stack,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Tag,
  TagLabel,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Divider,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Progress,
  Checkbox,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  VStack,
  Code,
  Image,
} from '@chakra-ui/react';
import { Icon as Iconify } from '@iconify/react';
import Card from 'components/card/Card';

// Types
interface Container {
  id: string;
  name: string;
  objectCount: number;
  sizeBytes: number;
  metadata: Record<string, string>;
  isPublic: boolean;
  createdAt: string;
}

interface StorageObject {
  id: string;
  name: string;
  sizeBytes: number;
  contentType: string;
  lastModified: string;
  etag: string;
  metadata: Record<string, string>;
}

interface PreSignedUrl {
  id: string;
  url: string;
  containerId: string;
  objectName: string;
  permission: 'read' | 'write' | 'read-write';
  expiresAt: string;
  createdAt: string;
  isRevoked: boolean;
}

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
}

function randomId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export default function ObjectStorage() {
  const toast = useToast();
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  // const textColor = useColorModeValue('secondaryGray.900', 'white');
  const bgDrop = useColorModeValue('gray.50', 'navy.800');
  const cardBg = useColorModeValue('white', 'navy.700');

  // Container Management State
  const [containers, setContainers] = useState<Container[]>([
    {
      id: randomId('cont'),
      name: 'images',
      objectCount: 245,
      sizeBytes: 15728640000, // ~15 GB
      metadata: { 'x-container-meta-department': 'marketing' },
      isPublic: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: randomId('cont'),
      name: 'documents',
      objectCount: 89,
      sizeBytes: 2147483648, // ~2 GB
      metadata: { 'x-container-meta-department': 'legal' },
      isPublic: false,
      createdAt: new Date().toISOString(),
    },
  ]);

  const [selectedContainer, setSelectedContainer] = useState<Container | null>(null);
  const [objects, setObjects] = useState<StorageObject[]>([]);
  const [preSignedUrls, setPreSignedUrls] = useState<PreSignedUrl[]>([]);
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);

  // Modal states
  const createContainerDisc = useDisclosure();
  const deleteContainerDisc = useDisclosure();
  const containerDetailsDisc = useDisclosure();
  const createUrlDisc = useDisclosure();
  const previewFileDisc = useDisclosure();

  // Form states
  const [newContainerName, setNewContainerName] = useState('');
  const [newContainerPublic, setNewContainerPublic] = useState(false);
  const [containerToDelete, setContainerToDelete] = useState<Container | null>(null);
  const [detailContainer, setDetailContainer] = useState<Container | null>(null);
  
  // Pre-signed URL form
  const [urlObjectName, setUrlObjectName] = useState('');
  const [urlPermission, setUrlPermission] = useState<'read' | 'write' | 'read-write'>('read');
  const [urlExpiryHours, setUrlExpiryHours] = useState(24);

  // File preview
  const [previewFile, setPreviewFile] = useState<StorageObject | null>(null);

  // Container Management Functions
  const handleCreateContainer = () => {
    if (!newContainerName.trim()) {
      toast({ status: 'error', title: 'Container name is required' });
      return;
    }

    const newContainer: Container = {
      id: randomId('cont'),
      name: newContainerName.trim(),
      objectCount: 0,
      sizeBytes: 0,
      metadata: {},
      isPublic: newContainerPublic,
      createdAt: new Date().toISOString(),
    };

    setContainers([...containers, newContainer]);
    toast({ status: 'success', title: 'Container created', description: newContainer.name });
    setNewContainerName('');
    setNewContainerPublic(false);
    createContainerDisc.onClose();
  };

  const handleDeleteContainer = () => {
    if (!containerToDelete) return;

    setContainers(containers.filter((c) => c.id !== containerToDelete.id));
    toast({ status: 'success', title: 'Container deleted', description: containerToDelete.name });
    setContainerToDelete(null);
    deleteContainerDisc.onClose();
  };

  const selectContainer = (container: Container) => {
    setSelectedContainer(container);
    // Simulate loading objects
    const mockObjects: StorageObject[] = [
      {
        id: randomId('obj'),
        name: 'sample-image.jpg',
        sizeBytes: 1048576,
        contentType: 'image/jpeg',
        lastModified: new Date().toISOString(),
        etag: 'abc123def456',
        metadata: {},
      },
      {
        id: randomId('obj'),
        name: 'document.pdf',
        sizeBytes: 524288,
        contentType: 'application/pdf',
        lastModified: new Date().toISOString(),
        etag: 'xyz789uvw012',
        metadata: {},
      },
    ];
    setObjects(mockObjects);
  };

  // File Upload Functions
  const handleFilesDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleFilesAdded(files);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilesAdded = (files: File[]) => {
    const newUploadFiles: UploadFile[] = files.map((file) => ({
      id: randomId('upload'),
      file,
      progress: 0,
      status: 'pending',
    }));

    setUploadFiles([...uploadFiles, ...newUploadFiles]);

    // Simulate upload
    newUploadFiles.forEach((uploadFile) => {
      simulateUpload(uploadFile.id);
    });
  };

  const simulateUpload = (uploadId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadFiles((prev) =>
        prev.map((uf) =>
          uf.id === uploadId
            ? { ...uf, progress, status: progress < 100 ? 'uploading' : 'completed' }
            : uf
        )
      );

      if (progress >= 100) {
        clearInterval(interval);
        toast({ status: 'success', title: 'Upload completed' });
      }
    }, 300);
  };

  // Pre-signed URL Functions
  const handleCreateUrl = () => {
    if (!urlObjectName.trim()) {
      toast({ status: 'error', title: 'Object name is required' });
      return;
    }

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + urlExpiryHours);

    const newUrl: PreSignedUrl = {
      id: randomId('url'),
      url: `https://storage.example.com/${selectedContainer?.name}/${urlObjectName}?token=${randomId('tok')}`,
      containerId: selectedContainer?.id || '',
      objectName: urlObjectName,
      permission: urlPermission,
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString(),
      isRevoked: false,
    };

    setPreSignedUrls([...preSignedUrls, newUrl]);
    toast({ status: 'success', title: 'Pre-signed URL created' });
    setUrlObjectName('');
    createUrlDisc.onClose();
  };

  const handleRevokeUrl = (urlId: string) => {
    setPreSignedUrls(
      preSignedUrls.map((url) => (url.id === urlId ? { ...url, isRevoked: true } : url))
    );
    toast({ status: 'success', title: 'URL revoked' });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ status: 'success', title: 'Copied to clipboard' });
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Tabs variant='soft-rounded' colorScheme='brand'>
        <Flex justify='space-between' align='center' mb='20px' flexWrap='wrap' gap='12px'>
          <TabList bg={useColorModeValue('white', 'navy.800')} p='10px' borderRadius='30px' w='fit-content'>
            <Tab>
              <Icon as={Iconify} icon='mdi:folder-multiple' width={18} height={18} mr='10px' />
              Containers
            </Tab>
            <Tab isDisabled={!selectedContainer}>
              <Icon as={Iconify} icon='mdi:file-upload' width={18} height={18} mr='10px' />
              Files
            </Tab>
            <Tab>
              <Icon as={Iconify} icon='mdi:link-variant' width={18} height={18} mr='10px' />
              Pre-signed URLs
            </Tab>
          </TabList>
          <HStack>
            <Button
              leftIcon={<Iconify icon='mdi:folder-plus' width={20} height={20} />}
              onClick={createContainerDisc.onOpen}
              variant='brand'
            >
              Create Container
            </Button>
            {selectedContainer && (
              <Button
                leftIcon={<Iconify icon='mdi:link-plus' width={20} height={20} />}
                onClick={createUrlDisc.onOpen}
                variant='outline'
              >
                Generate URL
              </Button>
            )}
          </HStack>
        </Flex>

        <TabPanels>
          {/* Containers Tab */}
          <TabPanel p='0px'>
            <Card flexDirection='column' w='100%' px='0px' overflowX={{ sm: 'scroll', lg: 'hidden' }}>
              <Table variant='simple' color='gray.500' mb='24px'>
                <Thead>
                  <Tr>
                    <Th pe='10px' borderColor={borderColor}>Name</Th>
                    <Th pe='10px' borderColor={borderColor}>Objects</Th>
                    <Th pe='10px' borderColor={borderColor}>Size</Th>
                    <Th pe='10px' borderColor={borderColor}>Visibility</Th>
                    <Th pe='10px' borderColor={borderColor}>Created</Th>
                    <Th pe='10px' borderColor={borderColor}>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {containers.map((container) => (
                    <Tr key={container.id} cursor='pointer' onClick={() => selectContainer(container)}>
                      <Td borderColor={borderColor}>
                        <HStack>
                          <Icon as={Iconify} icon='mdi:folder' width={18} height={18} color='brand.500' />
                          <Text fontSize='sm' fontWeight='700'>{container.name}</Text>
                        </HStack>
                      </Td>
                      <Td borderColor={borderColor}>
                        <Text fontSize='sm' fontWeight='700'>{container.objectCount}</Text>
                      </Td>
                      <Td borderColor={borderColor}>
                        <Text fontSize='sm' fontWeight='700'>{formatBytes(container.sizeBytes)}</Text>
                      </Td>
                      <Td borderColor={borderColor}>
                        <Badge colorScheme={container.isPublic ? 'green' : 'orange'}>
                          {container.isPublic ? 'Public' : 'Private'}
                        </Badge>
                      </Td>
                      <Td borderColor={borderColor}>
                        <Text fontSize='sm' fontWeight='700'>{new Date(container.createdAt).toLocaleDateString()}</Text>
                      </Td>
                      <Td borderColor={borderColor}>
                        <HStack spacing='6px'>
                          <Button
                            size='xs'
                            variant='ghost'
                            leftIcon={<Iconify icon='mdi:information-outline' width={16} height={16} />}
                            onClick={(e) => {
                              e.stopPropagation();
                              setDetailContainer(container);
                              containerDetailsDisc.onOpen();
                            }}
                          >
                            Details
                          </Button>
                          <Button
                            size='xs'
                            colorScheme='red'
                            variant='ghost'
                            leftIcon={<Iconify icon='mdi:delete' width={16} height={16} />}
                            onClick={(e) => {
                              e.stopPropagation();
                              setContainerToDelete(container);
                              deleteContainerDisc.onClose();
                            }}
                          >
                            Delete
                          </Button>
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Card>
          </TabPanel>

          {/* Files Tab */}
          <TabPanel p='0px'>
            <VStack spacing='20px' align='stretch'>
              {/* Drag and Drop Upload Area */}
              <Card p='40px'>
                <Box
                  border='2px dashed'
                  borderColor={borderColor}
                  borderRadius='12px'
                  p='40px'
                  textAlign='center'
                  bg={bgDrop}
                  onDrop={handleFilesDrop}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <Icon as={Iconify} icon='mdi:cloud-upload' width={64} height={64} color='brand.500' mb='16px' />
                  <Text fontSize='lg' fontWeight='700' mb='8px'>
                    Drag and drop files here
                  </Text>
                  <Text color='secondaryGray.600' mb='16px'>
                    or
                  </Text>
                  <Button
                    variant='brand'
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.multiple = true;
                      input.onchange = (e: any) => handleFilesAdded(Array.from(e.target.files));
                      input.click();
                    }}
                  >
                    Browse Files
                  </Button>
                </Box>

                {/* Upload Progress */}
                {uploadFiles.length > 0 && (
                  <VStack mt='20px' spacing='12px' align='stretch'>
                    {uploadFiles.map((uf) => (
                      <Box key={uf.id} p='12px' bg={cardBg} borderRadius='8px' borderWidth='1px' borderColor={borderColor}>
                        <Flex justify='space-between' mb='8px'>
                          <Text fontSize='sm' fontWeight='700'>{uf.file.name}</Text>
                          <Text fontSize='sm' color='secondaryGray.600'>{formatBytes(uf.file.size)}</Text>
                        </Flex>
                        <Progress value={uf.progress} size='sm' colorScheme='brand' />
                        <Text fontSize='xs' mt='4px' color='secondaryGray.600'>
                          {uf.status === 'completed' ? 'Upload completed' : `${uf.progress}%`}
                        </Text>
                      </Box>
                    ))}
                  </VStack>
                )}
              </Card>

              {/* Files List */}
              <Card flexDirection='column' w='100%' px='0px' overflowX={{ sm: 'scroll', lg: 'hidden' }}>
                <Flex px='25px' justify='space-between' mb='20px' align='center'>
                  <Text fontSize='22px' fontWeight='700'>
                    Files in {selectedContainer?.name}
                  </Text>
                </Flex>

                <Table variant='simple' color='gray.500' mb='24px'>
                  <Thead>
                    <Tr>
                      <Th pe='10px' borderColor={borderColor}>Name</Th>
                      <Th pe='10px' borderColor={borderColor}>Size</Th>
                      <Th pe='10px' borderColor={borderColor}>Type</Th>
                      <Th pe='10px' borderColor={borderColor}>Modified</Th>
                      <Th pe='10px' borderColor={borderColor}>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {objects.map((obj) => (
                      <Tr key={obj.id}>
                        <Td borderColor={borderColor}>
                          <HStack>
                            <Icon
                              as={Iconify}
                              icon={
                                obj.contentType.startsWith('image/')
                                  ? 'mdi:file-image'
                                  : obj.contentType.includes('pdf')
                                  ? 'mdi:file-pdf-box'
                                  : 'mdi:file-document'
                              }
                              width={18}
                              height={18}
                              color='brand.500'
                            />
                            <Text fontSize='sm' fontWeight='700'>{obj.name}</Text>
                          </HStack>
                        </Td>
                        <Td borderColor={borderColor}>
                          <Text fontSize='sm' fontWeight='700'>{formatBytes(obj.sizeBytes)}</Text>
                        </Td>
                        <Td borderColor={borderColor}>
                          <Tag size='sm'><TagLabel>{obj.contentType}</TagLabel></Tag>
                        </Td>
                        <Td borderColor={borderColor}>
                          <Text fontSize='sm' fontWeight='700'>{new Date(obj.lastModified).toLocaleString()}</Text>
                        </Td>
                        <Td borderColor={borderColor}>
                          <HStack spacing='6px'>
                            {obj.contentType.startsWith('image/') && (
                              <Button
                                size='xs'
                                variant='ghost'
                                leftIcon={<Iconify icon='mdi:eye' width={16} height={16} />}
                                onClick={() => {
                                  setPreviewFile(obj);
                                  previewFileDisc.onOpen();
                                }}
                              >
                                Preview
                              </Button>
                            )}
                            <Button
                              size='xs'
                              variant='ghost'
                              leftIcon={<Iconify icon='mdi:download' width={16} height={16} />}
                              onClick={() => toast({ status: 'info', title: 'Download started' })}
                            >
                              Download
                            </Button>
                            <Button
                              size='xs'
                              colorScheme='red'
                              variant='ghost'
                              leftIcon={<Iconify icon='mdi:delete' width={16} height={16} />}
                              onClick={() => {
                                setObjects(objects.filter((o) => o.id !== obj.id));
                                toast({ status: 'success', title: 'File deleted' });
                              }}
                            >
                              Delete
                            </Button>
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Card>
            </VStack>
          </TabPanel>

          {/* Pre-signed URLs Tab */}
          <TabPanel p='0px'>
            <Card flexDirection='column' w='100%' px='0px' overflowX={{ sm: 'scroll', lg: 'hidden' }}>
              <Table variant='simple' color='gray.500' mb='24px'>
                <Thead>
                  <Tr>
                    <Th pe='10px' borderColor={borderColor}>Object</Th>
                    <Th pe='10px' borderColor={borderColor}>Permission</Th>
                    <Th pe='10px' borderColor={borderColor}>Expires At</Th>
                    <Th pe='10px' borderColor={borderColor}>Status</Th>
                    <Th pe='10px' borderColor={borderColor}>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {preSignedUrls.map((url) => (
                    <Tr key={url.id}>
                      <Td borderColor={borderColor}>
                        <Text fontSize='sm' fontWeight='700'>{url.objectName}</Text>
                      </Td>
                      <Td borderColor={borderColor}>
                        <Tag
                          colorScheme={
                            url.permission === 'read' ? 'green' : url.permission === 'write' ? 'orange' : 'blue'
                          }
                        >
                          <TagLabel>{url.permission}</TagLabel>
                        </Tag>
                      </Td>
                      <Td borderColor={borderColor}>
                        <Text fontSize='sm' fontWeight='700'>{new Date(url.expiresAt).toLocaleString()}</Text>
                      </Td>
                      <Td borderColor={borderColor}>
                        <Badge colorScheme={url.isRevoked ? 'red' : 'green'}>
                          {url.isRevoked ? 'Revoked' : 'Active'}
                        </Badge>
                      </Td>
                      <Td borderColor={borderColor}>
                        <HStack spacing='6px'>
                          <Button
                            size='xs'
                            variant='ghost'
                            leftIcon={<Iconify icon='mdi:content-copy' width={16} height={16} />}
                            onClick={() => copyToClipboard(url.url)}
                          >
                            Copy URL
                          </Button>
                          {!url.isRevoked && (
                            <Button
                              size='xs'
                              colorScheme='red'
                              variant='ghost'
                              leftIcon={<Iconify icon='mdi:cancel' width={16} height={16} />}
                              onClick={() => handleRevokeUrl(url.id)}
                            >
                              Revoke
                            </Button>
                          )}
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Create Container Modal */}
      <Modal isOpen={createContainerDisc.isOpen} onClose={createContainerDisc.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Container</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired mb='16px'>
              <FormLabel>Container Name</FormLabel>
              <Input
                value={newContainerName}
                onChange={(e) => setNewContainerName(e.target.value)}
                placeholder='my-container'
              />
            </FormControl>
            <FormControl display='flex' alignItems='center'>
              <FormLabel mb='0'>Public Access</FormLabel>
              <Checkbox
                isChecked={newContainerPublic}
                onChange={(e) => setNewContainerPublic(e.target.checked)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={createContainerDisc.onClose}>
              Cancel
            </Button>
            <Button colorScheme='brand' onClick={handleCreateContainer}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Container Dialog */}
      <AlertDialog isOpen={deleteContainerDisc.isOpen} leastDestructiveRef={undefined} onClose={deleteContainerDisc.onClose}>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>Delete Container</AlertDialogHeader>
          <AlertDialogBody>
            Are you sure you want to delete container "{containerToDelete?.name}"? This action cannot be undone.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button onClick={deleteContainerDisc.onClose} mr={3}>
              Cancel
            </Button>
            <Button colorScheme='red' onClick={handleDeleteContainer}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Container Details Modal */}
      <Modal isOpen={containerDetailsDisc.isOpen} onClose={containerDetailsDisc.onClose} size='lg'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Container Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {detailContainer && (
              <Stack spacing='12px'>
                <Box>
                  <Text fontWeight='700' fontSize='sm' mb='4px'>Name</Text>
                  <Code>{detailContainer.name}</Code>
                </Box>
                <Box>
                  <Text fontWeight='700' fontSize='sm' mb='4px'>Object Count</Text>
                  <Text>{detailContainer.objectCount}</Text>
                </Box>
                <Box>
                  <Text fontWeight='700' fontSize='sm' mb='4px'>Total Size</Text>
                  <Text>{formatBytes(detailContainer.sizeBytes)}</Text>
                </Box>
                <Box>
                  <Text fontWeight='700' fontSize='sm' mb='4px'>Visibility</Text>
                  <Badge colorScheme={detailContainer.isPublic ? 'green' : 'orange'}>
                    {detailContainer.isPublic ? 'Public' : 'Private'}
                  </Badge>
                </Box>
                <Box>
                  <Text fontWeight='700' fontSize='sm' mb='4px'>Created At</Text>
                  <Text>{new Date(detailContainer.createdAt).toLocaleString()}</Text>
                </Box>
                <Divider />
                <Box>
                  <Text fontWeight='700' fontSize='sm' mb='8px'>Metadata</Text>
                  {Object.keys(detailContainer.metadata).length > 0 ? (
                    <Stack spacing='6px'>
                      {Object.entries(detailContainer.metadata).map(([key, value]) => (
                        <Flex key={key} justify='space-between'>
                          <Code fontSize='xs'>{key}</Code>
                          <Text fontSize='sm'>{value}</Text>
                        </Flex>
                      ))}
                    </Stack>
                  ) : (
                    <Text color='secondaryGray.600' fontSize='sm'>No metadata</Text>
                  )}
                </Box>
              </Stack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={containerDetailsDisc.onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Create Pre-signed URL Modal */}
      <Modal isOpen={createUrlDisc.isOpen} onClose={createUrlDisc.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Generate Pre-signed URL</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired mb='16px'>
              <FormLabel>Object Name</FormLabel>
              <Input
                value={urlObjectName}
                onChange={(e) => setUrlObjectName(e.target.value)}
                placeholder='file.jpg'
              />
            </FormControl>
            <FormControl mb='16px'>
              <FormLabel>Permission</FormLabel>
              <Select value={urlPermission} onChange={(e) => setUrlPermission(e.target.value as any)}>
                <option value='read'>Read Only</option>
                <option value='write'>Write Only</option>
                <option value='read-write'>Read & Write</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Expiry (hours)</FormLabel>
              <NumberInput value={urlExpiryHours} onChange={(_, n) => setUrlExpiryHours(n)} min={1} max={168}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={createUrlDisc.onClose}>
              Cancel
            </Button>
            <Button colorScheme='brand' onClick={handleCreateUrl}>
              Generate
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* File Preview Modal */}
      <Modal isOpen={previewFileDisc.isOpen} onClose={previewFileDisc.onClose} size='xl'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{previewFile?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {previewFile?.contentType.startsWith('image/') && (
              <Image
                src={`https://via.placeholder.com/800x600?text=${previewFile.name}`}
                alt={previewFile.name}
                borderRadius='8px'
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={previewFileDisc.onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
