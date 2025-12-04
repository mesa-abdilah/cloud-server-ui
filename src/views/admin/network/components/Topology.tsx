import React from 'react';
import {
  Box,
  Flex,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import Card from 'components/card/Card';

export default function Topology() {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const bgCanvas = useColorModeValue('gray.50', 'navy.800');

  return (
    <Card flexDirection='column' w='100%' px='0px' h='600px'>
      <Flex px='25px' justify='space-between' mb='20px' align='center'>
        <Text color={textColor} fontSize='22px' fontWeight='700' lineHeight='100%'>
          Network Topology
        </Text>
      </Flex>
      
      <Box w='100%' h='100%' bg={bgCanvas} position='relative' overflow='hidden'>
        {/* Simple SVG Visualization Mockup */}
        <svg width="100%" height="100%">
            {/* Internet Cloud */}
            <g transform="translate(400, 50)">
                <circle cx="0" cy="0" r="40" fill="#4299E1" opacity="0.2" />
                <text x="-25" y="5" fill="#4299E1" fontWeight="bold">Internet</text>
            </g>

            {/* Router */}
            <line x1="400" y1="90" x2="400" y2="150" stroke="#CBD5E0" strokeWidth="2" />
            <g transform="translate(400, 180)">
                <rect x="-30" y="-30" width="60" height="60" rx="10" fill="white" stroke="#CBD5E0" />
                <text x="-20" y="5" fontSize="24">🔄</text>
                <text x="-25" y="45" fontSize="12" fill="gray">Router-1</text>
            </g>

            {/* Network Lines */}
            <line x1="400" y1="210" x2="200" y2="300" stroke="#CBD5E0" strokeWidth="2" />
            <line x1="400" y1="210" x2="600" y2="300" stroke="#CBD5E0" strokeWidth="2" />

            {/* Subnet 1 */}
            <g transform="translate(200, 300)">
                 <rect x="-100" y="-20" width="200" height="150" rx="10" fill="#F7FAFC" stroke="#E2E8F0" strokeDasharray="5,5" />
                 <text x="-90" y="0" fontSize="12" fill="gray">Public Subnet (172.24.4.0/24)</text>
                 
                 {/* Instance 1 */}
                 <g transform="translate(-50, 60)">
                    <rect x="-20" y="-20" width="40" height="40" rx="5" fill="white" stroke="#48BB78" />
                    <text x="-10" y="5" fontSize="20">💻</text>
                    <text x="-30" y="35" fontSize="10">Web-Server</text>
                 </g>
            </g>

            {/* Subnet 2 */}
            <g transform="translate(600, 300)">
                 <rect x="-100" y="-20" width="200" height="150" rx="10" fill="#F7FAFC" stroke="#E2E8F0" strokeDasharray="5,5" />
                 <text x="-90" y="0" fontSize="12" fill="gray">Private Subnet (10.0.0.0/24)</text>

                 {/* Instance 2 */}
                 <g transform="translate(0, 60)">
                    <rect x="-20" y="-20" width="40" height="40" rx="5" fill="white" stroke="#48BB78" />
                    <text x="-10" y="5" fontSize="20">💻</text>
                    <text x="-30" y="35" fontSize="10">DB-Server</text>
                 </g>
            </g>
        </svg>
      </Box>
    </Card>
  );
}
