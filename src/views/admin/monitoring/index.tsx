import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Icon,
  Select,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  HStack,
  Progress,
  Input,
  InputGroup,
  InputLeftElement,
  useToast,
  Tag,
  TagLabel,
} from '@chakra-ui/react';
import { Icon as Iconify } from '@iconify/react';
import Card from 'components/card/Card';
import ReactApexChart from 'react-apexcharts';

// Types
interface ServiceStatus {
  id: string;
  name: string;
  service: 'Nova' | 'Neutron' | 'Cinder' | 'Glance' | 'Keystone';
  status: 'active' | 'down' | 'warning';
  version: string;
  lastUpdated: string;
}

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  source: string;
  message: string;
}

// Mock Data
const servicesData: ServiceStatus[] = [
  { id: '1', name: 'nova-compute-01', service: 'Nova', status: 'active', version: '2.1.0', lastUpdated: '2 mins ago' },
  { id: '2', name: 'nova-scheduler', service: 'Nova', status: 'active', version: '2.1.0', lastUpdated: '2 mins ago' },
  { id: '3', name: 'neutron-agent-01', service: 'Neutron', status: 'warning', version: '1.4.2', lastUpdated: '5 mins ago' },
  { id: '4', name: 'cinder-volume', service: 'Cinder', status: 'active', version: '3.0.1', lastUpdated: '1 min ago' },
  { id: '5', name: 'keystone-auth', service: 'Keystone', status: 'active', version: '1.0.0', lastUpdated: '30 secs ago' },
];

const logsData: LogEntry[] = [
  { id: '1', timestamp: '2025-12-04 08:15:22', level: 'info', source: 'Nova', message: 'Instance created successfully: vm-web-01' },
  { id: '2', timestamp: '2025-12-04 08:14:10', level: 'warning', source: 'Neutron', message: 'High latency detected on router-gateway' },
  { id: '3', timestamp: '2025-12-04 08:10:05', level: 'error', source: 'Cinder', message: 'Volume attachment failed: vol-db-backup' },
  { id: '4', timestamp: '2025-12-04 08:05:00', level: 'info', source: 'Keystone', message: 'User login successful: admin' },
  { id: '5', timestamp: '2025-12-04 08:00:00', level: 'info', source: 'System', message: 'Daily backup completed' },
];

const vms = [
  { id: 'vm1', name: 'vm-web-01' },
  { id: 'vm2', name: 'vm-db-01' },
  { id: 'vm3', name: 'vm-cache-01' },
];

export default function Monitoring() {
  const toast = useToast();
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const iconColor = useColorModeValue('brand.500', 'white');

  // State
  const [timeRange, setTimeRange] = useState('1h');
  const [selectedVm, setSelectedVm] = useState('vm1');
  const [logFilter, setLogFilter] = useState('');

  // Chart Options
  const lineChartOptions: any = {
    chart: {
      toolbar: { show: false },
      dropShadow: { enabled: true, top: 13, left: 0, blur: 10, opacity: 0.1, color: '#4318FF' },
    },
    colors: ['#4318FF', '#39B8FF'],
    markers: { size: 0, colors: 'white', strokeColors: '#7551FF', strokeWidth: 3, strokeOpacity: 0.9, strokeDashArray: 0, fillOpacity: 1, discrete: [], shape: 'circle', radius: 2, offsetX: 0, offsetY: 0, onClick: undefined, onDblClick: undefined, showNullDataPoints: true, hover: { size: undefined, sizeOffset: 3 } },
    tooltip: { theme: 'dark' },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', type: 'line' },
    xaxis: { type: 'numeric', categories: ['00', '04', '08', '12', '14', '16', '18'], labels: { style: { colors: '#A3AED0', fontSize: '12px', fontWeight: '500' } }, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { show: false },
    legend: { show: false },
    grid: { show: false, column: { color: ['#7551FF', '#39B8FF'], opacity: 0.5 } },
    color: ['#7551FF', '#39B8FF'],
  };

  const areaChartOptions: any = {
    chart: { toolbar: { show: false } },
    tooltip: { theme: 'dark' },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth' },
    xaxis: { type: 'numeric', categories: ['00', '04', '08', '12', '14', '16', '18'], labels: { style: { colors: '#A3AED0', fontSize: '12px', fontWeight: '500' } }, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { show: false },
    legend: { show: false },
    grid: { show: false, column: { opacity: 0.5 } },
    colors: ['#6AD2FF', '#4318FF'],
  };

  const barChartOptions: any = {
    chart: { toolbar: { show: false } },
    tooltip: { style: { fontSize: '12px' }, onDatasetHover: { highlightDataSeries: false }, theme: 'dark' },
    xaxis: { categories: ['17', '18', '19', '20', '21', '22', '23', '24', '25'], show: false, labels: { show: true, style: { colors: '#A3AED0', fontSize: '14px', fontWeight: '500' } }, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { show: false, color: 'black', labels: { show: true, style: { colors: '#CBD5E0', fontSize: '14px' } } },
    grid: { show: false, strokeDashArray: 5, yaxis: { lines: { show: true } }, xaxis: { lines: { show: false } } },
    fill: { type: 'gradient', gradient: { type: 'vertical', shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.9, colorStops: [[{ offset: 0, color: '#4318FF', opacity: 1 }, { offset: 100, color: 'rgba(67, 24, 255, 1)', opacity: 0.28 }]] } },
    dataLabels: { enabled: false },
    plotOptions: { bar: { borderRadius: 10, columnWidth: '40px' } },
  };

  // Handlers
  const handleServiceAction = (action: string, serviceName: string) => {
    toast({
      title: `${action} initiated`,
      description: `Service ${serviceName} is being ${action.toLowerCase()}ed.`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleExportLogs = () => {
    toast({
      title: 'Exporting logs',
      description: 'Your logs are being prepared for download.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Tabs variant='soft-rounded' colorScheme='brand'>
        <TabList bg={useColorModeValue('white', 'navy.800')} p='10px' borderRadius='30px' w='fit-content' mb='20px'>
          <Tab>
            <Icon as={Iconify} icon='mdi:view-dashboard' width={18} height={18} mr='10px' />
            Admin Monitoring
          </Tab>
          <Tab>
            <Icon as={Iconify} icon='mdi:chart-line' width={18} height={18} mr='10px' />
            Telemetry
          </Tab>
          <Tab>
            <Icon as={Iconify} icon='mdi:file-document-outline' width={18} height={18} mr='10px' />
            Logging
          </Tab>
        </TabList>

        <TabPanels>
          {/* Admin Monitoring Tab */}
          <TabPanel p='0px'>
            <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing='20px' mb='20px'>
              <Card>
                <Flex align='center' justify='space-between' mb='10px'>
                  <Text fontSize='lg' fontWeight='bold' color={textColor}>Compute Nodes</Text>
                  <Icon as={Iconify} icon='mdi:server' width={24} height={24} color={iconColor} />
                </Flex>
                <Text fontSize='3xl' fontWeight='700' color={textColor}>12 / 12</Text>
                <Text fontSize='sm' color='green.500'>All nodes operational</Text>
                <Progress value={100} colorScheme='green' size='xs' mt='10px' borderRadius='10px' />
              </Card>
              <Card>
                <Flex align='center' justify='space-between' mb='10px'>
                  <Text fontSize='lg' fontWeight='bold' color={textColor}>Avg CPU Load</Text>
                  <Icon as={Iconify} icon='mdi:cpu-64-bit' width={24} height={24} color={iconColor} />
                </Flex>
                <Text fontSize='3xl' fontWeight='700' color={textColor}>45%</Text>
                <Text fontSize='sm' color='gray.500'>Across all nodes</Text>
                <Progress value={45} colorScheme='brand' size='xs' mt='10px' borderRadius='10px' />
              </Card>
              <Card>
                <Flex align='center' justify='space-between' mb='10px'>
                  <Text fontSize='lg' fontWeight='bold' color={textColor}>Memory Usage</Text>
                  <Icon as={Iconify} icon='mdi:memory' width={24} height={24} color={iconColor} />
                </Flex>
                <Text fontSize='3xl' fontWeight='700' color={textColor}>128 GB</Text>
                <Text fontSize='sm' color='gray.500'>Free of 512 GB</Text>
                <Progress value={75} colorScheme='orange' size='xs' mt='10px' borderRadius='10px' />
              </Card>
            </SimpleGrid>

            <Card flexDirection='column' w='100%' px='0px' overflowX={{ sm: 'scroll', lg: 'hidden' }}>
              <Flex px='25px' justify='space-between' mb='20px' align='center'>
                <Text fontSize='22px' fontWeight='700' color={textColor}>Service Status</Text>
              </Flex>
              <Table variant='simple' color='gray.500' mb='24px'>
                <Thead>
                  <Tr>
                    <Th pe='10px' borderColor={borderColor}>Service Name</Th>
                    <Th pe='10px' borderColor={borderColor}>Type</Th>
                    <Th pe='10px' borderColor={borderColor}>Status</Th>
                    <Th pe='10px' borderColor={borderColor}>Version</Th>
                    <Th pe='10px' borderColor={borderColor}>Last Updated</Th>
                    <Th pe='10px' borderColor={borderColor}>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {servicesData.map((service) => (
                    <Tr key={service.id}>
                      <Td borderColor={borderColor}>
                        <Text fontSize='sm' fontWeight='700' color={textColor}>{service.name}</Text>
                      </Td>
                      <Td borderColor={borderColor}>
                        <Tag colorScheme='brand' size='sm'><TagLabel>{service.service}</TagLabel></Tag>
                      </Td>
                      <Td borderColor={borderColor}>
                        <Badge colorScheme={service.status === 'active' ? 'green' : service.status === 'warning' ? 'yellow' : 'red'}>
                          {service.status.toUpperCase()}
                        </Badge>
                      </Td>
                      <Td borderColor={borderColor}>
                        <Text fontSize='sm' color={textColor}>{service.version}</Text>
                      </Td>
                      <Td borderColor={borderColor}>
                        <Text fontSize='sm' color={textColor}>{service.lastUpdated}</Text>
                      </Td>
                      <Td borderColor={borderColor}>
                        <HStack spacing='10px'>
                          <Button size='xs' colorScheme='blue' variant='ghost' onClick={() => handleServiceAction('Restart', service.name)}>Restart</Button>
                          <Button size='xs' colorScheme='red' variant='ghost' onClick={() => handleServiceAction('Stop', service.name)}>Stop</Button>
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Card>
          </TabPanel>

          {/* Telemetry Tab */}
          <TabPanel p='0px'>
            <Flex justify='flex-end' mb='20px' gap='10px'>
              <Select w='200px' value={selectedVm} onChange={(e) => setSelectedVm(e.target.value)} bg={useColorModeValue('white', 'navy.800')}>
                {vms.map((vm) => (
                  <option key={vm.id} value={vm.id}>{vm.name}</option>
                ))}
              </Select>
              <Select w='150px' value={timeRange} onChange={(e) => setTimeRange(e.target.value)} bg={useColorModeValue('white', 'navy.800')}>
                <option value='1h'>Last 1 Hour</option>
                <option value='24h'>Last 24 Hours</option>
                <option value='7d'>Last 7 Days</option>
              </Select>
            </Flex>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing='20px'>
              <Card>
                <Text fontSize='lg' fontWeight='bold' color={textColor} mb='20px'>CPU Usage History</Text>
                <Box h='300px'>
                  <ReactApexChart options={lineChartOptions} series={[{ name: 'CPU Usage', data: [30, 40, 35, 50, 49, 60, 70, 91, 125] }]} type='line' height='100%' />
                </Box>
              </Card>
              <Card>
                <Text fontSize='lg' fontWeight='bold' color={textColor} mb='20px'>RAM Usage History</Text>
                <Box h='300px'>
                  <ReactApexChart options={areaChartOptions} series={[{ name: 'RAM Usage', data: [40, 50, 45, 60, 59, 70, 80, 91, 110] }]} type='area' height='100%' />
                </Box>
              </Card>
              <Card>
                <Text fontSize='lg' fontWeight='bold' color={textColor} mb='20px'>Disk I/O (IOPS)</Text>
                <Box h='300px'>
                  <ReactApexChart options={barChartOptions} series={[{ name: 'IOPS', data: [400, 300, 500, 200, 600, 700, 400, 300, 500] }]} type='bar' height='100%' />
                </Box>
              </Card>
              <Card>
                <Text fontSize='lg' fontWeight='bold' color={textColor} mb='20px'>Network Bandwidth</Text>
                <Box h='300px'>
                  <ReactApexChart options={lineChartOptions} series={[{ name: 'Inbound', data: [10, 20, 15, 30, 25, 40, 35] }, { name: 'Outbound', data: [5, 15, 10, 20, 15, 30, 25] }]} type='line' height='100%' />
                </Box>
              </Card>
            </SimpleGrid>
          </TabPanel>

          {/* Logging Tab */}
          <TabPanel p='0px'>
            <Card flexDirection='column' w='100%' px='0px'>
              <Flex px='25px' justify='space-between' mb='20px' align='center' wrap='wrap' gap='10px'>
                <Text fontSize='22px' fontWeight='700' color={textColor}>System Logs</Text>
                <HStack>
                  <InputGroup w={{ base: '100%', md: '300px' }}>
                    <InputLeftElement children={<Icon as={Iconify} icon='mdi:magnify' color='gray.500' />} />
                    <Input placeholder='Search logs...' value={logFilter} onChange={(e) => setLogFilter(e.target.value)} borderRadius='16px' />
                  </InputGroup>
                  <Button leftIcon={<Icon as={Iconify} icon='mdi:download' />} variant='outline' onClick={handleExportLogs}>Export</Button>
                </HStack>
              </Flex>
              <Table variant='simple' color='gray.500' mb='24px'>
                <Thead>
                  <Tr>
                    <Th pe='10px' borderColor={borderColor}>Timestamp</Th>
                    <Th pe='10px' borderColor={borderColor}>Level</Th>
                    <Th pe='10px' borderColor={borderColor}>Source</Th>
                    <Th pe='10px' borderColor={borderColor}>Message</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {logsData.filter(log => log.message.toLowerCase().includes(logFilter.toLowerCase()) || log.source.toLowerCase().includes(logFilter.toLowerCase())).map((log) => (
                    <Tr key={log.id}>
                      <Td borderColor={borderColor}>
                        <Text fontSize='sm' fontWeight='700' color={textColor}>{log.timestamp}</Text>
                      </Td>
                      <Td borderColor={borderColor}>
                        <Badge colorScheme={log.level === 'info' ? 'blue' : log.level === 'warning' ? 'orange' : 'red'}>
                          {log.level.toUpperCase()}
                        </Badge>
                      </Td>
                      <Td borderColor={borderColor}>
                        <Text fontSize='sm' color={textColor}>{log.source}</Text>
                      </Td>
                      <Td borderColor={borderColor}>
                        <Text fontSize='sm' color={textColor}>{log.message}</Text>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
