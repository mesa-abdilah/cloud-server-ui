import { Box, Flex, Progress, SimpleGrid, Text, useColorModeValue } from '@chakra-ui/react';
import Card from 'components/card/Card';
import React from 'react';

interface QuotaProps {
  title: string;
  used: number;
  total: number;
  unit: string;
}

const QuotaItem = ({ title, used, total, unit }: QuotaProps) => {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const percentage = (used / total) * 100;
  const colorScheme = percentage > 90 ? 'red' : percentage > 75 ? 'orange' : 'brand';

  return (
    <Box>
      <Flex justify='space-between' mb='5px'>
        <Text fontSize='sm' fontWeight='600' color={textColor}>
          {title}
        </Text>
        <Text fontSize='xs' color='gray.500'>
          {used} / {total} {unit}
        </Text>
      </Flex>
      <Progress value={percentage} colorScheme={colorScheme} size='xs' borderRadius='10px' />
    </Box>
  );
};

export default function QuotaUsage({ data }: { data: any }) {
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  return (
    <Card>
      <Text fontSize='lg' fontWeight='bold' color={textColor} mb='20px'>
        My Quota Usage
      </Text>
      <SimpleGrid columns={1} spacing='15px'>
        <QuotaItem title='vCPU' used={data.vcpu.used} total={data.vcpu.total} unit={data.vcpu.unit} />
        <QuotaItem title='RAM' used={data.ram.used} total={data.ram.total} unit={data.ram.unit} />
        <QuotaItem title='Storage' used={data.storage.used} total={data.storage.total} unit={data.storage.unit} />
        <QuotaItem title='Volumes' used={data.volumes.used} total={data.volumes.total} unit={data.volumes.unit} />
        <QuotaItem title='Floating IPs' used={data.floatingIps.used} total={data.floatingIps.total} unit={data.floatingIps.unit} />
      </SimpleGrid>
    </Card>
  );
}
