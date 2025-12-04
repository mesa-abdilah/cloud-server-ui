import { Box, Flex, Icon, Text, useColorModeValue, VStack } from '@chakra-ui/react';
import Card from 'components/card/Card';
import { Icon as Iconify } from '@iconify/react';
import React from 'react';

export default function RecentActivities({ data }: { data: any[] }) {
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  return (
    <Card>
      <Text fontSize='lg' fontWeight='bold' color={textColor} mb='20px'>
        Recent Activities
      </Text>
      <VStack spacing='15px' align='stretch'>
        {data.map((activity) => (
          <Flex key={activity.id} align='center'>
            <Box
              w='8px'
              h='8px'
              borderRadius='50%'
              bg={activity.status === 'success' ? 'green.500' : 'red.500'}
              mr='15px'
            />
            <Box>
              <Text fontSize='sm' fontWeight='600' color={textColor}>
                {activity.action}
              </Text>
              <Text fontSize='xs' color='gray.500'>
                {activity.timestamp}
              </Text>
            </Box>
          </Flex>
        ))}
      </VStack>
    </Card>
  );
}
