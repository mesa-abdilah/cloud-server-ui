import React from 'react';
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { MdTimeline, MdSettingsEthernet, MdRouter, MdSecurity, MdCloud, MdDeviceHub } from 'react-icons/md';
import Topology from './components/Topology';
import NetworkList from './components/NetworkList';
import RouterList from './components/RouterList';
import SecurityGroups from './components/SecurityGroups';
import FloatingIPs from './components/FloatingIPs';
import LoadBalancers from './components/LoadBalancers';

export default function Network() {
  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Tabs variant='soft-rounded' colorScheme='brand'>
        <Box overflowX='auto'>
            <TabList mb='20px' bg={useColorModeValue('white', 'navy.800')} p='10px' borderRadius='30px' w='fit-content' minW='max-content'>
            <Tab>
                <Icon as={MdTimeline as any} mr='10px' />
                Topology
            </Tab>
            <Tab>
                <Icon as={MdSettingsEthernet as any} mr='10px' />
                Networks
            </Tab>
            <Tab>
                <Icon as={MdRouter as any} mr='10px' />
                Routers
            </Tab>
            <Tab>
                <Icon as={MdSecurity as any} mr='10px' />
                Security Groups
            </Tab>
            <Tab>
                <Icon as={MdCloud as any} mr='10px' />
                Floating IPs
            </Tab>
            <Tab>
                <Icon as={MdDeviceHub as any} mr='10px' />
                Load Balancers
            </Tab>
            </TabList>
        </Box>

        <TabPanels>
          <TabPanel p='0px'>
            <Topology />
          </TabPanel>
          <TabPanel p='0px'>
            <NetworkList />
          </TabPanel>
          <TabPanel p='0px'>
            <RouterList />
          </TabPanel>
          <TabPanel p='0px'>
            <SecurityGroups />
          </TabPanel>
          <TabPanel p='0px'>
            <FloatingIPs />
          </TabPanel>
          <TabPanel p='0px'>
            <LoadBalancers />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
