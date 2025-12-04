import { Box, Flex, Icon, SimpleGrid, Text, useColorModeValue } from '@chakra-ui/react';
import Card from 'components/card/Card';
import { Icon as Iconify } from '@iconify/react';
import React from 'react';

export default function HypervisorHealth({ data }: { data: any }) {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const bgItem = useColorModeValue('gray.100', 'whiteAlpha.100');

  return (
    <Card>
      <Text fontSize='lg' fontWeight='bold' color={textColor} mb='20px'>
        Hypervisor Health
      </Text>
      <SimpleGrid columns={3} spacing='20px'>
        <Flex direction='column' align='center' p='15px' bg={bgItem} borderRadius='12px'>
          <Icon as={Iconify} icon='mdi:check-circle' color='green.500' w='32px' h='32px' mb='8px' />
          <Text fontSize='2xl' fontWeight='bold' color={textColor}>{data.healthy}</Text>
          <Text fontSize='sm' color='gray.500'>Healthy</Text>
        </Flex>
        <Flex direction='column' align='center' p='15px' bg={bgItem} borderRadius='12px'>
          <Icon as={Iconify} icon='mdi:alert' color='orange.500' w='32px' h='32px' mb='8px' />
          <Text fontSize='2xl' fontWeight='bold' color={textColor}>{data.warning}</Text>
          <Text fontSize='sm' color='gray.500'>Warning</Text>
        </Flex>
        <Flex direction='column' align='center' p='15px' bg={bgItem} borderRadius='12px'>
          <Icon as={Iconify} icon='mdi:alert-circle' color='red.500' w='32px' h='32px' mb='8px' />
          <Text fontSize='2xl' fontWeight='bold' color={textColor}>{data.critical}</Text>
          <Text fontSize='sm' color='gray.500'>Critical</Text>
        </Flex>
      </SimpleGrid>
      <Text fontSize='sm' color='gray.500' mt='20px' textAlign='center'>
        Total Hypervisors: {data.total}
      </Text>
    </Card>
  );
}
