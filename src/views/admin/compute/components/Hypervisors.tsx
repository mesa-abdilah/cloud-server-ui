import React, { useState } from 'react';
import {
  Box,
  SimpleGrid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  useColorModeValue,
  Flex,
  Badge,
  Progress,
  Icon,
  Button,
} from '@chakra-ui/react';
import { MdDns, MdRefresh } from 'react-icons/md';
import Card from 'components/card/Card';
import ReactApexChart from 'react-apexcharts';

interface Hypervisor {
  id: string;
  hostname: string;
  status: 'Up' | 'Down' | 'Maintenance';
  ip: string;
  version: string;
  cpuUsage: number;
  ramUsage: number;
  diskUsage: number;
}

const initialHypervisors: Hypervisor[] = [
  {
    id: 'hv-1',
    hostname: 'compute-node-01',
    status: 'Up',
    ip: '192.168.10.101',
    version: 'KVM 6.2.0',
    cpuUsage: 45,
    ramUsage: 60,
    diskUsage: 30,
  },
  {
    id: 'hv-2',
    hostname: 'compute-node-02',
    status: 'Up',
    ip: '192.168.10.102',
    version: 'KVM 6.2.0',
    cpuUsage: 78,
    ramUsage: 85,
    diskUsage: 55,
  },
  {
    id: 'hv-3',
    hostname: 'compute-node-03',
    status: 'Maintenance',
    ip: '192.168.10.103',
    version: 'KVM 6.1.0',
    cpuUsage: 5,
    ramUsage: 10,
    diskUsage: 12,
  },
];

export default function Hypervisors() {
  const [hypervisors, setHypervisors] = useState<Hypervisor[]>(initialHypervisors);
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  // Chart Data for Aggregate Usage
  const chartOptions: any = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: hypervisors.map(h => h.hostname),
    },
    fill: { opacity: 1 },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return val + '%';
        },
      },
    },
    colors: ['#4318FF', '#6AD2FF', '#E1E9F8'],
  };

  const chartSeries = [
    {
      name: 'CPU Usage',
      data: hypervisors.map(h => h.cpuUsage),
    },
    {
      name: 'RAM Usage',
      data: hypervisors.map(h => h.ramUsage),
    },
    {
      name: 'Disk Usage',
      data: hypervisors.map(h => h.diskUsage),
    },
  ];

  const handleRefresh = () => {
    // Simulate refresh with random data
    const updated = hypervisors.map(h => ({
      ...h,
      cpuUsage: Math.floor(Math.random() * 100),
      ramUsage: Math.floor(Math.random() * 100),
    }));
    setHypervisors(updated);
  };

  return (
    <Box>
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} spacing='20px' mb='20px'>
        <Card p='20px' flexDirection='column' w='100%' alignItems='center'>
          <Flex justify='space-between' align='center' w='100%' mb='20px'>
            <Text color={textColor} fontSize='lg' fontWeight='700'>
              Resource Usage per Node
            </Text>
            <Button size='sm' leftIcon={<MdRefresh />} onClick={handleRefresh}>
              Refresh
            </Button>
          </Flex>
          <Box h='300px' w='100%'>
            <ReactApexChart options={chartOptions} series={chartSeries} type='bar' height='100%' />
          </Box>
        </Card>

        <Card p='20px' flexDirection='column' w='100%' alignItems='center'>
           <Text color={textColor} fontSize='lg' fontWeight='700' mb='20px' alignSelf='flex-start'>
              Cluster Health
           </Text>
           <SimpleGrid columns={2} spacing={5} w='100%'>
              <Box p={4} bg={useColorModeValue('green.50', 'green.900')} borderRadius='md'>
                  <Text fontSize='sm' color='gray.500'>Total Nodes</Text>
                  <Text fontSize='2xl' fontWeight='bold' color='green.500'>{hypervisors.length}</Text>
              </Box>
              <Box p={4} bg={useColorModeValue('blue.50', 'blue.900')} borderRadius='md'>
                  <Text fontSize='sm' color='gray.500'>Total vCPUs</Text>
                  <Text fontSize='2xl' fontWeight='bold' color='blue.500'>128</Text>
              </Box>
              <Box p={4} bg={useColorModeValue('orange.50', 'orange.900')} borderRadius='md'>
                  <Text fontSize='sm' color='gray.500'>Total RAM</Text>
                  <Text fontSize='2xl' fontWeight='bold' color='orange.500'>512 GB</Text>
              </Box>
              <Box p={4} bg={useColorModeValue('red.50', 'red.900')} borderRadius='md'>
                  <Text fontSize='sm' color='gray.500'>Alerts</Text>
                  <Text fontSize='2xl' fontWeight='bold' color='red.500'>1</Text>
              </Box>
           </SimpleGrid>
        </Card>
      </SimpleGrid>

      <Card flexDirection='column' w='100%' px='0px' overflowX={{ sm: 'scroll', lg: 'hidden' }}>
        <Flex px='25px' justify='space-between' mb='20px' align='center'>
          <Text color={textColor} fontSize='22px' fontWeight='700' lineHeight='100%'>
            Hypervisors List
          </Text>
        </Flex>
        
        <Table variant='simple' color='gray.500' mb='24px'>
          <Thead>
            <Tr>
              <Th pe='10px' borderColor={borderColor}>Hostname</Th>
              <Th pe='10px' borderColor={borderColor}>Status</Th>
              <Th pe='10px' borderColor={borderColor}>IP Address</Th>
              <Th pe='10px' borderColor={borderColor}>Load (CPU/RAM)</Th>
              <Th pe='10px' borderColor={borderColor}>Version</Th>
            </Tr>
          </Thead>
          <Tbody>
            {hypervisors.map((hv) => (
              <Tr key={hv.id}>
                <Td borderColor={borderColor}>
                  <Flex align='center'>
                    <Icon as={MdDns} color='brand.500' me='10px' />
                    <Text color={textColor} fontSize='sm' fontWeight='700'>
                      {hv.hostname}
                    </Text>
                  </Flex>
                </Td>
                <Td borderColor={borderColor}>
                  <Badge colorScheme={hv.status === 'Up' ? 'green' : hv.status === 'Down' ? 'red' : 'orange'}>
                    {hv.status}
                  </Badge>
                </Td>
                <Td borderColor={borderColor}>
                  <Text color={textColor} fontSize='sm' fontWeight='700'>
                    {hv.ip}
                  </Text>
                </Td>
                <Td borderColor={borderColor} width='200px'>
                  <Box>
                    <Text fontSize='xs' mb={1}>CPU: {hv.cpuUsage}%</Text>
                    <Progress value={hv.cpuUsage} size='xs' colorScheme={hv.cpuUsage > 80 ? 'red' : 'blue'} borderRadius='full' mb={2} />
                    <Text fontSize='xs' mb={1}>RAM: {hv.ramUsage}%</Text>
                    <Progress value={hv.ramUsage} size='xs' colorScheme={hv.ramUsage > 80 ? 'red' : 'purple'} borderRadius='full' />
                  </Box>
                </Td>
                <Td borderColor={borderColor}>
                  <Text color={textColor} fontSize='sm' fontWeight='700'>
                    {hv.version}
                  </Text>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>
    </Box>
  );
}
