import { Box, Flex, Progress, Text, useColorModeValue } from '@chakra-ui/react';
import Card from 'components/card/Card';
import React from 'react';

interface ResourceProps {
  title: string;
  used: number;
  total: number;
  unit: string;
  percentage: number;
  colorScheme: string;
}

const ResourceItem = ({ title, used, total, unit, percentage, colorScheme }: ResourceProps) => {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  return (
    <Box mb='20px'>
      <Flex justify='space-between' mb='5px'>
        <Text fontSize='sm' fontWeight='700' color={textColor}>
          {title}
        </Text>
        <Text fontSize='sm' fontWeight='700' color='gray.500'>
          {used} / {total} {unit} ({percentage}%)
        </Text>
      </Flex>
      <Progress value={percentage} colorScheme={colorScheme} size='sm' borderRadius='10px' />
    </Box>
  );
};

export default function ResourceUsage({ data }: { data: any }) {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  return (
    <Card>
      <Text fontSize='lg' fontWeight='bold' color={textColor} mb='20px'>
        System Resource Usage
      </Text>
      <ResourceItem
        title='vCPU'
        used={data.cpu.used}
        total={data.cpu.total}
        unit={data.cpu.unit}
        percentage={data.cpu.percentage}
        colorScheme='brand'
      />
      <ResourceItem
        title='RAM'
        used={data.ram.used}
        total={data.ram.total}
        unit={data.ram.unit}
        percentage={data.ram.percentage}
        colorScheme='blue'
      />
      <ResourceItem
        title='Storage'
        used={data.storage.used}
        total={data.storage.total}
        unit={data.storage.unit}
        percentage={data.storage.percentage}
        colorScheme='green'
      />
    </Card>
  );
}
