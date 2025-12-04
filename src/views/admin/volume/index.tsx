import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Grid,
  GridItem,
  HStack,
  Icon,
  IconButton,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Tag,
  TagLabel,
  Text,
  Textarea,
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
  Skeleton,
} from '@chakra-ui/react';
import { Icon as Iconify } from '@iconify/react';
import Card from 'components/card/Card';
import computeData, { ComputeInstance } from 'views/admin/compute/variables/computeData';

type VolumeStatus = 'available' | 'in-use' | 'creating' | 'extending' | 'error';
type VolumeType = 'standard' | 'performance' | 'cold';

interface VolumeItem {
  id: string;
  name: string;
  sizeGb: number;
  type: VolumeType;
  zone: string;
  description?: string;
  metadata: Record<string, string>;
  encrypted: boolean;
  encryptionAlgo?: string;
  status: VolumeStatus;
  attachedTo?: string; // instance id
  createdAt: string;
}

interface Snapshot {
  id: string;
  name: string;
  description?: string;
  volumeId: string;
  createdAt: string;
  metadata: Record<string, string>;
}

interface Backup {
  id: string;
  volumeId: string;
  createdAt: string;
  schedule: 'one-time' | 'recurring';
  recurrence?: 'daily' | 'weekly';
  retention?: number;
  status: 'success' | 'running' | 'failed' | 'scheduled';
}

function randomId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function Volume() {
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'navy.700');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  

  const [loading, setLoading] = useState(true);
  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const [volumes, setVolumes] = useState<VolumeItem[]>([{
    id: randomId('vol'),
    name: 'db-data',
    sizeGb: 100,
    type: 'performance',
    zone: 'us-east-1a',
    description: 'Primary database volume',
    metadata: { role: 'db', env: 'prod' },
    encrypted: true,
    encryptionAlgo: 'AES-256',
    status: 'in-use',
    attachedTo: computeData[1]?.id,
    createdAt: new Date().toISOString(),
  }, {
    id: randomId('vol'),
    name: 'logs-archive',
    sizeGb: 500,
    type: 'cold',
    zone: 'us-east-1b',
    metadata: {},
    encrypted: false,
    status: 'available',
    createdAt: new Date().toISOString(),
  }]);

  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [backups, setBackups] = useState<Backup[]>([]);

  // Create Volume Modal state
  const createDisc = useDisclosure();
  const [cvName, setCvName] = useState('');
  const [cvSize, setCvSize] = useState(20);
  const [cvType, setCvType] = useState<VolumeType>('standard');
  const [cvZone, setCvZone] = useState('us-east-1a');
  const [cvDesc, setCvDesc] = useState('');
  const [cvMeta, setCvMeta] = useState<{ key: string; value: string }>({ key: '', value: '' });
  const [cvMetaList, setCvMetaList] = useState<Record<string, string>>({});
  const [cvEnc, setCvEnc] = useState(false);
  const [cvAlgo, setCvAlgo] = useState('AES-256');
  
  const previewDialog = useDisclosure();

  const cvErrors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!cvName.trim()) e.name = 'Nama volume wajib diisi';
    if (cvSize < 1) e.size = 'Ukuran minimal 1GB';
    if (!cvType) e.type = 'Tipe volume wajib dipilih';
    if (!cvZone) e.zone = 'Zona ketersediaan wajib dipilih';
    if (cvEnc && !cvAlgo) e.algo = 'Algoritma enkripsi wajib saat enkripsi aktif';
    return e;
  }, [cvName, cvSize, cvType, cvZone, cvEnc, cvAlgo]);

  const addCvMeta = () => {
    if (!cvMeta.key.trim()) return;
    setCvMetaList((prev) => ({ ...prev, [cvMeta.key]: cvMeta.value }));
    setCvMeta({ key: '', value: '' });
  };

  const handleCreateVolume = () => {
    if (Object.keys(cvErrors).length) {
      toast({ status: 'error', title: 'Validasi gagal', description: 'Perbaiki input yang tidak valid' });
      return;
    }
    const newVol: VolumeItem = {
      id: randomId('vol'),
      name: cvName.trim(),
      sizeGb: cvSize,
      type: cvType,
      zone: cvZone,
      description: cvDesc || undefined,
      metadata: cvMetaList,
      encrypted: cvEnc,
      encryptionAlgo: cvEnc ? cvAlgo : undefined,
      status: 'creating',
      createdAt: new Date().toISOString(),
    };
    setVolumes((v) => [newVol, ...v]);
    previewDialog.onClose();
    createDisc.onClose();
    const id = newVol.id;
    setTimeout(() => {
      setVolumes((v) => v.map((x) => (x.id === id ? { ...x, status: 'available' } : x)));
      toast({ status: 'success', title: 'Volume dibuat', description: `${newVol.name} (${newVol.sizeGb}GB)` });
      // reset form
      setCvName(''); setCvSize(20); setCvType('standard'); setCvZone('us-east-1a'); setCvDesc(''); setCvMetaList({}); setCvEnc(false); setCvAlgo('AES-256');
    }, 1200);
  };

  // Attach/Detach
  const attachDisc = useDisclosure();
  const [selectedVol, setSelectedVol] = useState<VolumeItem | null>(null);
  const [targetInstanceId, setTargetInstanceId] = useState('');
  const [opLoading, setOpLoading] = useState(false);
  const compatibleInstances = useMemo(() => computeData.filter((i) => i.status === 'Running'), []);

  const openAttach = (vol: VolumeItem) => {
    setSelectedVol(vol);
    setTargetInstanceId('');
    attachDisc.onOpen();
  };

  const doAttach = () => {
    if (!selectedVol || !targetInstanceId) {
      toast({ status: 'warning', title: 'Pilih instance target terlebih dahulu' });
      return;
    }
    setOpLoading(true);
    setVolumes((v) => v.map((x) => (x.id === selectedVol.id ? { ...x, status: 'creating' } : x)));
    setTimeout(() => {
      setVolumes((v) => v.map((x) => (x.id === selectedVol.id ? { ...x, status: 'in-use', attachedTo: targetInstanceId } : x)));
      setOpLoading(false);
      attachDisc.onClose();
      toast({ status: 'success', title: 'Volume terpasang', description: `${selectedVol.name} → ${targetInstanceId}` });
    }, 1200);
  };

  const detachDisc = useDisclosure();
  const [detachVol, setDetachVol] = useState<VolumeItem | null>(null);
  const confirmDetach = () => {
    if (!detachVol) return;
    setOpLoading(true);
    setVolumes((v) => v.map((x) => (x.id === detachVol.id ? { ...x, status: 'creating' } : x)));
    setTimeout(() => {
      setVolumes((v) => v.map((x) => (x.id === detachVol.id ? { ...x, status: 'available', attachedTo: undefined } : x)));
      setOpLoading(false);
      detachDisc.onClose();
      toast({ status: 'success', title: 'Volume dilepas', description: `${detachVol.name} telah di-detach` });
    }, 1000);
  };

  // Extend size
  const extendDisc = useDisclosure();
  const [extendVol, setExtendVol] = useState<VolumeItem | null>(null);
  const [extendSize, setExtendSize] = useState(0);
  const capacityMax = 2048;
  const openExtend = (vol: VolumeItem) => {
    setExtendVol(vol);
    setExtendSize(vol.sizeGb);
    extendDisc.onOpen();
  };
  const validExtend = extendVol && extendSize > (extendVol?.sizeGb || 0) && extendSize <= capacityMax;
  const submitExtend = () => {
    if (!extendVol || !validExtend) {
      toast({ status: 'error', title: 'Ukuran tidak valid' });
      return;
    }
    setVolumes((v) => v.map((x) => (x.id === extendVol.id ? { ...x, status: 'extending' } : x)));
    setTimeout(() => {
      setVolumes((v) => v.map((x) => (x.id === extendVol.id ? { ...x, status: 'available', sizeGb: extendSize } : x)));
      extendDisc.onClose();
      toast({ status: 'success', title: 'Ukuran diperbesar', description: `${extendVol.name}: ${extendVol.sizeGb} → ${extendSize} GB` });
    }, 1500);
  };

  // Snapshot
  const snapDisc = useDisclosure();
  const [snapName, setSnapName] = useState('');
  const [snapDesc, setSnapDesc] = useState('');
  const [snapVolId, setSnapVolId] = useState('');
  const [snapFilterVolId, setSnapFilterVolId] = useState('');
  const [snapSort, setSnapSort] = useState<'newest' | 'oldest'>('newest');
  const makeSnapshot = () => {
    if (!snapVolId || !snapName.trim()) {
      toast({ status: 'warning', title: 'Volume dan nama snapshot wajib' });
      return;
    }
    const s: Snapshot = {
      id: randomId('snap'),
      name: snapName.trim(),
      description: snapDesc || undefined,
      volumeId: snapVolId,
      createdAt: new Date().toISOString(),
      metadata: { createdBy: 'user', sourceZone: volumes.find(v => v.id === snapVolId)?.zone || '-' },
    };
    setSnapshots((arr) => [s, ...arr]);
    snapDisc.onClose();
    setSnapName(''); setSnapDesc(''); setSnapVolId('');
    toast({ status: 'success', title: 'Snapshot dibuat', description: s.name });
  };
  const filteredSnapshots = useMemo(() => {
    let arr = snapshots;
    if (snapFilterVolId) arr = arr.filter((s) => s.volumeId === snapFilterVolId);
    arr = [...arr].sort((a, b) => snapSort === 'newest' ? (a.createdAt < b.createdAt ? 1 : -1) : (a.createdAt > b.createdAt ? 1 : -1));
    return arr;
  }, [snapshots, snapFilterVolId, snapSort]);

  const snapPreview = useDisclosure();
  const [previewSnap, setPreviewSnap] = useState<Snapshot | null>(null);

  // Backups
  const backupDisc = useDisclosure();
  const [bkVolId, setBkVolId] = useState('');
  const [bkSchedule, setBkSchedule] = useState<'one-time' | 'recurring'>('one-time');
  const [bkRecurrence, setBkRecurrence] = useState<'daily' | 'weekly'>('daily');
  const [bkRetention, setBkRetention] = useState(7);
  const createBackup = () => {
    if (!bkVolId) { toast({ status: 'warning', title: 'Pilih volume untuk backup' }); return; }
    const b: Backup = {
      id: randomId('bkp'), volumeId: bkVolId, createdAt: new Date().toISOString(),
      schedule: bkSchedule, recurrence: bkSchedule === 'recurring' ? bkRecurrence : undefined,
      retention: bkRetention, status: 'scheduled'
    };
    setBackups((arr) => [b, ...arr]);
    backupDisc.onClose();
    toast({ status: 'success', title: 'Backup dijadwalkan', description: `Volume ${bkVolId}` });
  };

  const restoreDisc = useDisclosure();
  const [restoreBackup, setRestoreBackup] = useState<Backup | null>(null);
  const doRestore = () => {
    if (!restoreBackup) return;
    toast({ status: 'info', title: 'Restore dimulai', description: `Recovery point: ${restoreBackup.id}` });
    setTimeout(() => {
      toast({ status: 'success', title: 'Restore selesai' });
      restoreDisc.onClose();
    }, 1500);
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Tabs variant='soft-rounded' colorScheme='brand'>
        <Flex justify='space-between' align='center' mb='20px' flexWrap='wrap' gap='12px'>
          <TabList bg={useColorModeValue('white', 'navy.800')} p='10px' borderRadius='30px' w='fit-content'>
            <Tab>
              <Icon as={Iconify} icon='hugeicons:hard-drive' width={18} height={18} mr='10px' />
              Volumes
            </Tab>
            <Tab>
              <Icon as={Iconify} icon='mdi:camera' width={18} height={18} mr='10px' />
              Snapshots
            </Tab>
            <Tab>
              <Icon as={Iconify} icon='mdi:backup-restore' width={18} height={18} mr='10px' />
              Backups
            </Tab>
          </TabList>
          <HStack>
            <Button leftIcon={<Iconify icon='hugeicons:hard-drive' width={20} height={20} />} onClick={createDisc.onOpen} variant='brand'>Create Volume</Button>
            <Button leftIcon={<Iconify icon='mdi:backup-restore' width={20} height={20} />} onClick={backupDisc.onOpen} variant='outline'>Create Backup</Button>
          </HStack>
        </Flex>

        <TabPanels>
          <TabPanel p='0px'>
            {loading ? (
              <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing='20px'>
                {Array.from({ length: 6 }).map((_, i) => (<Skeleton key={i} height='160px' />))}
              </SimpleGrid>
            ) : (
              <Card flexDirection='column' w='100%' px='0px' overflowX={{ sm: 'scroll', lg: 'hidden' }}>
                <Table variant='simple' color='gray.500' mb='24px'>
                  <Thead>
                    <Tr>
                      <Th pe='10px' borderColor={borderColor}>Nama</Th>
                      <Th pe='10px' borderColor={borderColor} isNumeric>Ukuran (GB)</Th>
                      <Th pe='10px' borderColor={borderColor}>Tipe</Th>
                      <Th pe='10px' borderColor={borderColor}>Zona</Th>
                      <Th pe='10px' borderColor={borderColor}>Status</Th>
                      <Th pe='10px' borderColor={borderColor}>Terpasang</Th>
                      <Th pe='10px' borderColor={borderColor}>Aksi</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {volumes.map((v) => (
                      <Tr key={v.id}>
                        <Td borderColor={borderColor}>
                          <HStack>
                            <Iconify icon='hugeicons:hard-drive' width={18} height={18} />
                            <Text fontSize='sm' fontWeight='700'>{v.name}</Text>
                          </HStack>
                        </Td>
                        <Td borderColor={borderColor} isNumeric><Text fontSize='sm' fontWeight='700'>{v.sizeGb}</Text></Td>
                        <Td borderColor={borderColor}><Tag colorScheme={v.type === 'performance' ? 'blue' : v.type === 'cold' ? 'purple' : 'gray'}><TagLabel>{v.type}</TagLabel></Tag></Td>
                        <Td borderColor={borderColor}><Text fontSize='sm' fontWeight='700'>{v.zone}</Text></Td>
                        <Td borderColor={borderColor}>
                          <Badge colorScheme={v.status === 'available' ? 'green' : v.status === 'in-use' ? 'blue' : v.status === 'extending' ? 'orange' : v.status === 'creating' ? 'yellow' : 'red'}>{v.status}</Badge>
                        </Td>
                        <Td borderColor={borderColor}>{v.attachedTo ? (<HStack><Iconify icon='mdi:server' width={16} height={16} /><Text fontSize='sm' fontWeight='700'>{v.attachedTo}</Text></HStack>) : <Text fontSize='sm' fontWeight='700'>-</Text>}</Td>
                        <Td borderColor={borderColor}>
                          <HStack spacing='6px'>
                            {v.status !== 'in-use' ? (
                              <Button size='xs' leftIcon={<Iconify icon='mdi:link-variant' width={16} height={16} />} onClick={() => openAttach(v)}>Attach</Button>
                            ) : (
                              <Button size='xs' colorScheme='red' variant='outline' leftIcon={<Iconify icon='mdi:link-variant-off' width={16} height={16} />} onClick={() => { setDetachVol(v); detachDisc.onOpen(); }}>Detach</Button>
                            )}
                            <Button size='xs' variant='ghost' leftIcon={<Iconify icon='mdi:arrow-expand' width={16} height={16} />} onClick={() => openExtend(v)}>Extend</Button>
                            <Button size='xs' variant='ghost' leftIcon={<Iconify icon='mdi:camera' width={16} height={16} />} onClick={() => { setSnapVolId(v.id); snapDisc.onOpen(); }}>Snapshot</Button>
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Card>
            )}
          </TabPanel>

          <TabPanel p='0px'>
            <Card flexDirection='column' w='100%' px='0px' overflowX={{ sm: 'scroll', lg: 'hidden' }}>
              <Flex px='25px' mb='12px' gap='10px' align='center'>
              <Select w='220px' value={snapFilterVolId} onChange={(e) => setSnapFilterVolId(e.target.value)} aria-label='Filter volume'>
                <option value=''>Semua volume</option>
                {volumes.map((v) => (<option key={v.id} value={v.id}>{v.name}</option>))}
              </Select>
              <Select w='180px' value={snapSort} onChange={(e) => setSnapSort(e.target.value as any)} aria-label='Urut snapshot'>
                <option value='newest'>Terbaru</option>
                <option value='oldest'>Terlama</option>
              </Select>
                <Button leftIcon={<Iconify icon='mdi:camera' width={18} height={18} />} onClick={snapDisc.onOpen}>Create Snapshot</Button>
              </Flex>
              <Table variant='simple' color='gray.500' mb='24px'>
              <Thead>
                <Tr>
                  <Th pe='10px' borderColor={borderColor}>Nama</Th>
                  <Th pe='10px' borderColor={borderColor}>Volume</Th>
                  <Th pe='10px' borderColor={borderColor}>Tanggal</Th>
                  <Th pe='10px' borderColor={borderColor}>Aksi</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredSnapshots.map((s) => (
                  <Tr key={s.id}>
                    <Td borderColor={borderColor}><Text fontSize='sm' fontWeight='700'>{s.name}</Text></Td>
                    <Td borderColor={borderColor}><Text fontSize='sm' fontWeight='700'>{volumes.find(v => v.id === s.volumeId)?.name || s.volumeId}</Text></Td>
                    <Td borderColor={borderColor}><Text fontSize='sm' fontWeight='700'>{new Date(s.createdAt).toLocaleString()}</Text></Td>
                    <Td borderColor={borderColor}>
                      <HStack>
                        <Button size='xs' variant='ghost' leftIcon={<Iconify icon='mdi:information-outline' width={16} height={16} />} onClick={() => { setPreviewSnap(s); snapPreview.onOpen(); }}>Preview</Button>
                        <Button size='xs' colorScheme='brand' leftIcon={<Iconify icon='mdi:backup-restore' width={16} height={16} />} onClick={() => toast({ status: 'info', title: 'Restore dimulai', description: s.name })}>Restore</Button>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
              </Table>
            </Card>
          </TabPanel>

          <TabPanel>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing='20px' mb='16px'>
              <Box p='16px' bg={cardBg} borderRadius='16px' borderWidth='1px' borderColor={borderColor}>
                <Text fontWeight='700'>Status Terakhir</Text>
                <Divider my='8px' />
                {backups[0] ? (
                  <HStack justify='space-between'>
                    <Text>{volumes.find(v => v.id === backups[0].volumeId)?.name || backups[0].volumeId}</Text>
                    <Badge colorScheme={backups[0].status === 'success' ? 'green' : backups[0].status === 'failed' ? 'red' : 'blue'}>{backups[0].status}</Badge>
                  </HStack>
                ) : (
                  <Text color='secondaryGray.600'>Belum ada backup</Text>
                )}
              </Box>
              <Box p='16px' bg={cardBg} borderRadius='16px' borderWidth='1px' borderColor={borderColor}>
                <Text fontWeight='700'>Kebijakan Retensi</Text>
                <Divider my='8px' />
                <HStack>
                  <Select w='220px' value={bkVolId} onChange={(e) => setBkVolId(e.target.value)} aria-label='Pilih volume'>
                    <option value=''>Pilih volume</option>
                    {volumes.map((v) => (<option key={v.id} value={v.id}>{v.name}</option>))}
                  </Select>
                  <NumberInput w='160px' value={bkRetention} min={1} onChange={(_, n) => setBkRetention(n)} aria-label='Retensi'>
                    <NumberInputField />
                    <NumberInputStepper><NumberIncrementStepper /><NumberDecrementStepper /></NumberInputStepper>
                  </NumberInput>
                </HStack>
                <Button mt='10px' onClick={() => toast({ status: 'success', title: 'Retensi diperbarui', description: `${bkRetention} salinan` })}>Simpan</Button>
              </Box>
              <Box p='16px' bg={cardBg} borderRadius='16px' borderWidth='1px' borderColor={borderColor}>
                <Text fontWeight='700'>Restore</Text>
                <Divider my='8px' />
                {backups.length ? (
                  <Stack>
                    {backups.slice(0, 5).map((b) => (
                      <HStack key={b.id} justify='space-between'>
                        <Text>{volumes.find(v => v.id === b.volumeId)?.name || b.volumeId}</Text>
                        <Button size='xs' onClick={() => { setRestoreBackup(b); restoreDisc.onOpen(); }}>Pilih</Button>
                      </HStack>
                    ))}
                  </Stack>
                ) : <Text color='secondaryGray.600'>Tidak ada entri backup</Text>}
              </Box>
            </SimpleGrid>

            <Button leftIcon={<Iconify icon='mdi:backup-restore' width={18} height={18} />} onClick={backupDisc.onOpen}>Create Backup</Button>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Create Volume Modal */}
      <Modal isOpen={createDisc.isOpen} onClose={createDisc.onClose} size='lg'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Volume</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap='12px'>
              <GridItem>
                <FormControl isRequired isInvalid={!!cvErrors.name}>
                  <FormLabel>Nama Volume</FormLabel>
                  <Input value={cvName} onChange={(e) => setCvName(e.target.value)} placeholder='e.g., app-data' aria-label='Nama volume' />
                  <FormErrorMessage>{cvErrors.name}</FormErrorMessage>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl isRequired isInvalid={!!cvErrors.size}>
                  <FormLabel>Ukuran (GB)</FormLabel>
                  <NumberInput value={cvSize} min={1} onChange={(_, n) => setCvSize(n)} aria-label='Ukuran volume'>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormErrorMessage>{cvErrors.size}</FormErrorMessage>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl isRequired isInvalid={!!cvErrors.type}>
                  <FormLabel>Tipe Volume</FormLabel>
                  <Select value={cvType} onChange={(e) => setCvType(e.target.value as VolumeType)} aria-label='Tipe volume'>
                    <option value='standard'>Standard</option>
                    <option value='performance'>High Performance</option>
                    <option value='cold'>Cold</option>
                  </Select>
                  <FormErrorMessage>{cvErrors.type}</FormErrorMessage>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl isRequired isInvalid={!!cvErrors.zone}>
                  <FormLabel>Zona Ketersediaan</FormLabel>
                  <Select value={cvZone} onChange={(e) => setCvZone(e.target.value)} aria-label='Zona ketersediaan'>
                    <option value='us-east-1a'>us-east-1a</option>
                    <option value='us-east-1b'>us-east-1b</option>
                    <option value='us-west-2a'>us-west-2a</option>
                  </Select>
                  <FormErrorMessage>{cvErrors.zone}</FormErrorMessage>
                </FormControl>
              </GridItem>
            </Grid>
            <Divider my='12px' />
            <Text fontWeight='700' mb='8px'>Opsi Lanjutan</Text>
            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap='12px'>
              <GridItem>
                <FormControl>
                  <FormLabel>Deskripsi</FormLabel>
                  <Textarea value={cvDesc} onChange={(e) => setCvDesc(e.target.value)} placeholder='Deskripsi volume' />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Metadata</FormLabel>
                  <HStack>
                    <Input placeholder='key' value={cvMeta.key} onChange={(e) => setCvMeta({ ...cvMeta, key: e.target.value })} />
                    <Input placeholder='value' value={cvMeta.value} onChange={(e) => setCvMeta({ ...cvMeta, value: e.target.value })} />
                    <IconButton aria-label='Tambah metadata' icon={<Iconify icon='mdi:plus' width={18} height={18} />} onClick={addCvMeta} />
                  </HStack>
                  <HStack mt='6px' spacing='6px' wrap='wrap'>
                    {Object.keys(cvMetaList).map((k) => (<Tag key={k} size='sm'><TagLabel>{k}: {cvMetaList[k]}</TagLabel></Tag>))}
                  </HStack>
                </FormControl>
              </GridItem>
              <GridItem colSpan={2}>
                <FormControl display='flex' alignItems='center' isInvalid={!!cvErrors.algo}>
                  <FormLabel mb='0'>Enkripsi</FormLabel>
                  <Switch isChecked={cvEnc} onChange={(e) => setCvEnc(e.target.checked)} aria-label='Aktifkan enkripsi' />
                  <Select ml='12px' w='220px' isDisabled={!cvEnc} value={cvAlgo} onChange={(e) => setCvAlgo(e.target.value)} aria-label='Algoritma enkripsi'>
                    <option value='AES-256'>AES-256</option>
                    <option value='ChaCha20'>ChaCha20</option>
                  </Select>
                  <FormErrorMessage>{cvErrors.algo}</FormErrorMessage>
                </FormControl>
              </GridItem>
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={createDisc.onClose}>Tutup</Button>
            <Button colorScheme='brand' onClick={previewDialog.onOpen}>Preview & Create</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Preview Dialog */}
      <AlertDialog isOpen={previewDialog.isOpen} leastDestructiveRef={undefined} onClose={previewDialog.onClose}>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>Preview Konfigurasi</AlertDialogHeader>
          <AlertDialogBody>
            <Stack spacing='6px'>
              <Text>Nama: {cvName}</Text>
              <Text>Ukuran: {cvSize} GB</Text>
              <Text>Tipe: {cvType}</Text>
              <Text>Zona: {cvZone}</Text>
              {cvDesc && <Text>Deskripsi: {cvDesc}</Text>}
              <Text>Metadata: {Object.keys(cvMetaList).length ? JSON.stringify(cvMetaList) : '-'}</Text>
              <Text>Enkripsi: {cvEnc ? `Ya (${cvAlgo})` : 'Tidak'}</Text>
            </Stack>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button onClick={previewDialog.onClose} mr={3}>Kembali</Button>
            <Button colorScheme='brand' onClick={handleCreateVolume}>Buat</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Attach Wizard */}
      <Modal isOpen={attachDisc.isOpen} onClose={attachDisc.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Attach Volume</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb='8px'>Volume: {selectedVol?.name}</Text>
            <FormControl isRequired>
              <FormLabel>Pilih Instance</FormLabel>
              <Select value={targetInstanceId} onChange={(e) => setTargetInstanceId(e.target.value)} aria-label='Instance target'>
                <option value=''>Pilih...</option>
                {compatibleInstances.map((i: ComputeInstance) => (<option key={i.id} value={i.id}>{i.name} ({i.id})</option>))}
              </Select>
            </FormControl>
            {opLoading && <Progress mt='10px' size='xs' isIndeterminate />}
          </ModalBody>
          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={attachDisc.onClose}>Batal</Button>
            <Button onClick={doAttach} isLoading={opLoading} colorScheme='brand'>Attach</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Detach Confirm */}
      <AlertDialog isOpen={detachDisc.isOpen} leastDestructiveRef={undefined} onClose={detachDisc.onClose}>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>Konfirmasi Detach</AlertDialogHeader>
          <AlertDialogBody>
            <Text mb='6px'>Melepas volume dapat menyebabkan kehilangan data jika belum di-unmount.</Text>
            <Text>Volume: {detachVol?.name}</Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button onClick={detachDisc.onClose} mr={3}>Batal</Button>
            <Button colorScheme='red' onClick={confirmDetach} isLoading={opLoading}>Detach</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Extend Volume */}
      <Modal isOpen={extendDisc.isOpen} onClose={extendDisc.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Extend Volume Size</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Volume: {extendVol?.name}</Text>
            <Text color='secondaryGray.600' mb='8px'>Ukuran saat ini: {extendVol?.sizeGb} GB • Maksimum: {capacityMax} GB</Text>
            <FormControl isRequired isInvalid={!validExtend}>
              <FormLabel>Ukuran baru (GB)</FormLabel>
              <NumberInput value={extendSize} min={(extendVol?.sizeGb || 0) + 1} max={capacityMax} onChange={(_, n) => setExtendSize(n)} aria-label='Ukuran baru'>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {!validExtend && <FormErrorMessage>Harus lebih besar dari saat ini dan ≤ maksimum</FormErrorMessage>}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={extendDisc.onClose}>Batal</Button>
            <Button colorScheme='brand' onClick={submitExtend} isDisabled={!validExtend}>Perbesar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Create Snapshot */}
      <Modal isOpen={snapDisc.isOpen} onClose={snapDisc.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Snapshot</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Volume</FormLabel>
              <Select value={snapVolId} onChange={(e) => setSnapVolId(e.target.value)} aria-label='Volume untuk snapshot'>
                <option value=''>Pilih volume</option>
                {volumes.map((v) => (<option key={v.id} value={v.id}>{v.name}</option>))}
              </Select>
            </FormControl>
            <FormControl isRequired mt='8px'>
              <FormLabel>Nama Snapshot</FormLabel>
              <Input value={snapName} onChange={(e) => setSnapName(e.target.value)} aria-label='Nama snapshot' />
            </FormControl>
            <FormControl mt='8px'>
              <FormLabel>Deskripsi</FormLabel>
              <Textarea value={snapDesc} onChange={(e) => setSnapDesc(e.target.value)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={snapDisc.onClose}>Batal</Button>
            <Button colorScheme='brand' onClick={makeSnapshot}>Buat</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Snapshot Preview */}
      <Modal isOpen={snapPreview.isOpen} onClose={snapPreview.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Snapshot Metadata</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {previewSnap ? (
              <Box>
                <Text fontWeight='600'>Nama: {previewSnap.name}</Text>
                <Text>Volume: {volumes.find(v => v.id === previewSnap.volumeId)?.name || previewSnap.volumeId}</Text>
                <Text>Tanggal: {new Date(previewSnap.createdAt).toLocaleString()}</Text>
                <Divider my='8px' />
                <Text>Metadata:</Text>
                <Box mt='6px' p='10px' bg={cardBg} borderRadius='12px' borderWidth='1px' borderColor={borderColor}>
                  <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(previewSnap.metadata, null, 2)}</pre>
                </Box>
              </Box>
            ) : null}
          </ModalBody>
          <ModalFooter>
            <Button onClick={snapPreview.onClose}>Tutup</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Backup Wizard */}
      <Modal isOpen={backupDisc.isOpen} onClose={backupDisc.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Backup</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Volume</FormLabel>
              <Select value={bkVolId} onChange={(e) => setBkVolId(e.target.value)} aria-label='Volume untuk backup'>
                <option value=''>Pilih volume</option>
                {volumes.map((v) => (<option key={v.id} value={v.id}>{v.name}</option>))}
              </Select>
            </FormControl>
            <FormControl mt='8px' isRequired>
              <FormLabel>Jadwal</FormLabel>
              <Select value={bkSchedule} onChange={(e) => setBkSchedule(e.target.value as any)}>
                <option value='one-time'>One-time</option>
                <option value='recurring'>Recurring</option>
              </Select>
            </FormControl>
            {bkSchedule === 'recurring' && (
              <FormControl mt='8px'>
                <FormLabel>Frekuensi</FormLabel>
                <Select value={bkRecurrence} onChange={(e) => setBkRecurrence(e.target.value as any)}>
                  <option value='daily'>Daily</option>
                  <option value='weekly'>Weekly</option>
                </Select>
              </FormControl>
            )}
            <FormControl mt='8px'>
              <FormLabel>Kebijakan Retensi (jumlah backup disimpan)</FormLabel>
              <NumberInput value={bkRetention} min={1} onChange={(_, n) => setBkRetention(n)}>
                <NumberInputField />
                <NumberInputStepper><NumberIncrementStepper /><NumberDecrementStepper /></NumberInputStepper>
              </NumberInput>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={backupDisc.onClose}>Batal</Button>
            <Button colorScheme='brand' onClick={createBackup}>Jadwalkan</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Restore Dialog */}
      <AlertDialog isOpen={restoreDisc.isOpen} leastDestructiveRef={undefined} onClose={restoreDisc.onClose}>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>Konfirmasi Restore</AlertDialogHeader>
          <AlertDialogBody>
            <Text>Melakukan restore akan menimpa data pada volume tujuan.</Text>
            <Text mt='6px'>Recovery point: {restoreBackup?.id}</Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button onClick={restoreDisc.onClose} mr={3}>Batal</Button>
            <Button colorScheme='brand' onClick={doRestore}>Restore</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  );
}