import { Flex, Icon, Text, useColorModeValue, VStack } from '@chakra-ui/react';
import Card from 'components/card/Card';
import { Icon as Iconify } from '@iconify/react';
import React from 'react';
import { Box } from '@chakra-ui/react';

export default function RecentAlerts({ data }: { data: any[] }) {
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  return (
    <Card>
      <Text fontSize='lg' fontWeight='bold' color={textColor} mb='20px'>
        Recent Alerts
      </Text>
      <VStack spacing='15px' align='stretch'>
        {data.map((alert) => (
          <Flex key={alert.id} align='center'>
            <Icon
              as={Iconify}
              icon={
                alert.severity === 'error'
                  ? 'mdi:alert-circle'
                  : alert.severity === 'warning'
                  ? 'mdi:alert'
                  : 'mdi:check-circle'
              }
              color={
                alert.severity === 'error'
                  ? 'red.500'
                  : alert.severity === 'warning'
                  ? 'orange.500'
                  : 'green.500'
              }
              w='24px'
              h='24px'
              mr='15px'
            />
            <Box>
              <Text fontSize='sm' fontWeight='600' color={textColor}>
                {alert.message}
              </Text>
              <Text fontSize='xs' color='gray.500'>
                {alert.timestamp}
              </Text>
            </Box>
          </Flex>
        ))}
      </VStack>
    </Card>
  );
}
