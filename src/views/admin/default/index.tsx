import { Box, SimpleGrid, Text, useColorModeValue } from '@chakra-ui/react';
import { Icon as Iconify } from '@iconify/react';
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import HypervisorHealth from 'views/admin/default/components/HypervisorHealth';
import PieCard from 'views/admin/default/components/PieCard';
import QuotaUsage from 'views/admin/default/components/QuotaUsage';
import RecentActivities from 'views/admin/default/components/RecentActivities';
import RecentAlerts from 'views/admin/default/components/RecentAlerts';
import ResourceUsage from 'views/admin/default/components/ResourceUsage';
import { dashboardData } from 'views/admin/default/variables/dashboardData';
import Banner from 'views/admin/default/components/Banner';

export default function UserReports() {
  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Banner />
      {/* System-wide Metrics Section */}
      <Text fontSize='xl' fontWeight='bold' color={textColor} mb='20px' mt='40px'>
        System-wide Metrics
      </Text>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap='20px' mb='20px'>
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={<Iconify icon='mdi:server' width={32} height={32} color={brandColor} />}
            />
          }
          name='Total VMs'
          value={dashboardData.systemMetrics.totalVms.value.toString()}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={<Iconify icon='mdi:network' width={32} height={32} color={brandColor} />}
            />
          }
          name='Network Traffic'
          value={dashboardData.systemMetrics.networkTraffic.inbound}
          endContent={<Text fontSize='xs' color='gray.500'>Inbound</Text>}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={<Iconify icon='mdi:network-outline' width={32} height={32} color={brandColor} />}
            />
          }
          name='Network Traffic'
          value={dashboardData.systemMetrics.networkTraffic.outbound}
          endContent={<Text fontSize='xs' color='gray.500'>Outbound</Text>}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={<Iconify icon='mdi:alert-circle-outline' width={32} height={32} color='orange.500' />}
            />
          }
          name='Active Alerts'
          value={dashboardData.systemMetrics.recentAlerts.length.toString()}
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap='20px' mb='20px'>
        <ResourceUsage data={dashboardData.systemMetrics.resourceUsage} />
        <HypervisorHealth data={dashboardData.systemMetrics.hypervisors} />
        <RecentAlerts data={dashboardData.systemMetrics.recentAlerts} />
      </SimpleGrid>

      {/* User-level Metrics Section */}
      <Text fontSize='xl' fontWeight='bold' color={textColor} mb='20px' mt='40px'>
        User-level Metrics
      </Text>
      <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap='20px' mb='20px'>
        <PieCard />
        <QuotaUsage data={dashboardData.userMetrics.quotaUsage} />
        <RecentActivities data={dashboardData.userMetrics.recentActivities} />
      </SimpleGrid>
    </Box>
  );
}
