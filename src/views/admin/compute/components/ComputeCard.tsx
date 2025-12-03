import React from 'react';
import {
  Box,
  Flex,
  Text,
  Badge,
  useColorModeValue,
  Image,
  HStack,
  IconButton,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import { Icon as Iconify } from '@iconify/react';
import { ComputeInstance } from '../variables/computeData';
import { motion } from 'framer-motion';

interface ComputeCardProps {
  data: ComputeInstance;
  onDetail: (instance: ComputeInstance) => void;
}

const MotionCard = motion(Card);

export default function ComputeCard(props: ComputeCardProps) {
  const { data, onDetail } = props;
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = useColorModeValue('secondaryGray.600', 'white');
  // const bgStatus = useColorModeValue('white', 'navy.700');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Running':
        return 'green';
      case 'Stopped':
        return 'red';
      case 'Pending':
        return 'orange';
      case 'Terminated':
        return 'gray';
      default:
        return 'gray';
    }
  };

  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      p='20px'
      alignItems='center'
      flexDirection='column'
      w='100%'
      position='relative'
    >
      <Flex w='100%' justifyContent='space-between' alignItems='center' mb='20px'>
        <HStack spacing='14px'>
          <Box p='10px' bg={useColorModeValue('gray.100', 'navy.700')} borderRadius='12px'>
             <Image src={data.image} h='40px' w='40px' alt={data.name} />
          </Box>
          <Box>
            <Text color={textColor} fontSize='lg' fontWeight='700'>
              {data.name}
            </Text>
            <Text color={textColorSecondary} fontSize='sm' fontWeight='500'>
              {data.id}
            </Text>
          </Box>
        </HStack>
        <IconButton
          aria-label='Instance Details'
          variant='ghost'
          color='secondaryGray.500'
          size='sm'
          borderRadius='full'
          _hover={{ bg: useColorModeValue('gray.100', 'whiteAlpha.100') }}
          icon={<Iconify icon="ic:sharp-more-vert" width={20} height={20} />}
          onClick={() => onDetail(data)}
        />
      </Flex>

      <Flex w='100%' justifyContent='space-between' mb='10px'>
        <Flex direction='column'>
          <Text color={textColorSecondary} fontSize='xs'>
            Status
          </Text>
          <Badge
            colorScheme={getStatusColor(data.status)}
            variant='subtle'
            borderRadius='full'
            px='10px'
            w='fit-content'
          >
            {data.status}
          </Badge>
        </Flex>
        <Flex direction='column'>
          <Text color={textColorSecondary} fontSize='xs'>
            Region
          </Text>
          <Text color={textColor} fontSize='sm' fontWeight='600'>
            {data.region}
          </Text>
        </Flex>
        <Flex direction='column'>
          <Text color={textColorSecondary} fontSize='xs'>
            Type
          </Text>
          <Text color={textColor} fontSize='sm' fontWeight='600'>
            {data.type}
          </Text>
        </Flex>
      </Flex>

      <Box w='100%' h='1px' bg={borderColor} mb='10px' />

      <Flex w='100%' justifyContent='space-between'>
        <Flex direction='column' alignItems='center'>
            <Text color={textColorSecondary} fontSize='xs'>CPU</Text>
            <Text color={textColor} fontSize='sm' fontWeight='600'>{data.cpu}</Text>
        </Flex>
        <Flex direction='column' alignItems='center'>
            <Text color={textColorSecondary} fontSize='xs'>RAM</Text>
            <Text color={textColor} fontSize='sm' fontWeight='600'>{data.ram}</Text>
        </Flex>
        <Flex direction='column' alignItems='center'>
            <Text color={textColorSecondary} fontSize='xs'>IP Address</Text>
            <Text color={textColor} fontSize='sm' fontWeight='600'>{data.ip}</Text>
        </Flex>
      </Flex>
    </MotionCard>
  );
}
