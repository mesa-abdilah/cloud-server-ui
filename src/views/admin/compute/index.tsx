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
import { MdComputer, MdVpnKey, MdDns } from 'react-icons/md';
import InstanceList from './components/InstanceList';
import Keypairs from './components/Keypairs';
import Hypervisors from './components/Hypervisors';

export default function Compute() {

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Tabs variant='soft-rounded' colorScheme='brand'>
        <TabList mb='20px' bg={useColorModeValue('white', 'navy.800')} p='10px' borderRadius='30px' w='fit-content'>
          <Tab>
            <Icon as={MdDns as any} mr='10px' />
            Overview
          </Tab>
          <Tab>
            <Icon as={MdComputer as any} mr='10px' />
            Instances
          </Tab>
          <Tab>
            <Icon as={MdVpnKey as any} mr='10px' />
            Keypairs
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel p='0px'>
            <Hypervisors />
          </TabPanel>
          <TabPanel p='0px'>
            <InstanceList />
          </TabPanel>
          <TabPanel p='0px'>
            <Keypairs />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
