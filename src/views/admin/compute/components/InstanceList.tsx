import React, { useState, useEffect } from 'react';
import {
  Box,
  SimpleGrid,
  Flex,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Button,
  useColorModeValue,
  Icon,
  HStack,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';
import { MdSearch, MdFilterList, MdChevronLeft, MdChevronRight, MdAdd } from 'react-icons/md';
import ComputeCard from './ComputeCard';
import CreateInstanceModal from './CreateInstanceModal';
import InstanceDetailDrawer from './InstanceDetailDrawer';
import computeData, { ComputeInstance } from '../variables/computeData';

const ITEMS_PER_PAGE = 6;

export default function InstanceList() {
  const [data, setData] = useState<ComputeInstance[]>([]);
  const [filteredData, setFilteredData] = useState<ComputeInstance[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Detail Drawer State
  const { 
    isOpen: isDetailOpen, 
    onOpen: onDetailOpen, 
    onClose: onDetailClose 
  } = useDisclosure();
  const [selectedInstance, setSelectedInstance] = useState<ComputeInstance | null>(null);

  // Colors
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const iconColor = useColorModeValue('secondaryGray.500', 'white');
  const bgInput = useColorModeValue('secondaryGray.300', 'navy.900');
  const inputText = useColorModeValue('gray.700', 'gray.100');

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setData(computeData);
      setFilteredData(computeData);
    }, 500);
  }, []);

  useEffect(() => {
    let result = data;

    if (searchQuery) {
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.ip.includes(searchQuery)
      );
    }

    if (statusFilter !== 'All') {
      result = result.filter((item) => item.status === statusFilter);
    }

    setFilteredData(result);
    setCurrentPage(1); // Reset to first page on filter change
  }, [searchQuery, statusFilter, data]);

  const handleCreateInstance = (newInstance: any) => {
    // Prepend new instance to data
    const updatedData = [newInstance, ...data];
    setData(updatedData);
  };

  const handleDetailClick = (instance: ComputeInstance) => {
    setSelectedInstance(instance);
    onDetailOpen();
  };

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <Box>
      {/* Header & Controls */}
      <Flex
        flexDirection={{ base: 'column', md: 'row' }}
        justifyContent='space-between'
        alignItems={{ base: 'start', md: 'center' }}
        mb='20px'
        gap='20px'
      >
        <Box>
          <Text color={textColor} fontSize='2xl' fontWeight='700'>
            Compute Instances
          </Text>
          <Text color='secondaryGray.600' fontSize='sm'>
            Manage your virtual machines and compute resources.
          </Text>
        </Box>
        
        <Flex gap='10px' w={{ base: '100%', md: 'auto' }} flexDirection={{ base: 'column', sm: 'row' }} alignItems='center'>
          <InputGroup w={{ base: '100%', sm: '250px' }} bg={bgInput} borderRadius='30px'>
            <InputLeftElement
              children={
                <IconButton
                  aria-label='search'
                  bg='inherit'
                  borderRadius='inherit'
                  _active={{
                    bg: 'inherit',
                    transform: 'none',
                    borderColor: 'transparent',
                  }}
                  _focus={{
                    boxShadow: 'none',
                  }}
                  icon={<Icon as={MdSearch as any} color={iconColor} w='15px' h='15px' />}
                />
              }
            />
            <Input
              fontSize='sm'
              bg={bgInput}
              color={inputText}
              fontWeight='500'
              _placeholder={{ color: 'gray.400', fontSize: '14px' }}
              borderRadius='30px'
              placeholder='Search instances...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>

          <Select
            w={{ base: '100%', sm: '150px' }}
            variant='auth'
            fontSize='sm'
            fontWeight='500'
            color={inputText}
            placeholder='Filter Status'
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            borderRadius='30px'
            icon={<Icon as={MdFilterList as any} color={iconColor} />}
          >
            <option value='All'>All Status</option>
            <option value='Running'>Running</option>
            <option value='Stopped'>Stopped</option>
            <option value='Pending'>Pending</option>
            <option value='Terminated'>Terminated</option>
          </Select>

          <Button
            variant='brand'
            fontWeight='500'
            leftIcon={<Icon as={MdAdd as any} />}
            onClick={onOpen}
          >
            Create Instance
          </Button>
        </Flex>
      </Flex>

      {/* Grid Content */}
      <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing='20px' mb='20px'>
        {currentItems.map((item) => (
          <ComputeCard key={item.id} data={item} onDetail={handleDetailClick} />
        ))}
      </SimpleGrid>

      {/* Empty State */}
      {filteredData.length === 0 && (
        <Flex justifyContent='center' alignItems='center' h='200px' flexDirection='column'>
            <Text color={textColor} fontSize='lg' fontWeight='600'>No instances found</Text>
            <Text color='secondaryGray.600' fontSize='sm'>Try adjusting your search or filters.</Text>
        </Flex>
      )}

      {/* Pagination */}
      {filteredData.length > 0 && (
        <Flex justifyContent='space-between' alignItems='center' w='100%'>
          <Text fontSize='sm' color='secondaryGray.600'>
            Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredData.length)} of {filteredData.length} entries
          </Text>
          <HStack>
            <Button
              variant='ghost'
              onClick={() => handlePageChange(currentPage - 1)}
              isDisabled={currentPage === 1}
              leftIcon={<Icon as={MdChevronLeft as any} />}
            >
              Prev
            </Button>
            <Text fontSize='sm' fontWeight='bold' color={textColor}>
              {currentPage} / {totalPages}
            </Text>
            <Button
              variant='ghost'
              onClick={() => handlePageChange(currentPage + 1)}
              isDisabled={currentPage === totalPages}
              rightIcon={<Icon as={MdChevronRight as any} />}
            >
              Next
            </Button>
          </HStack>
        </Flex>
      )}

      <CreateInstanceModal isOpen={isOpen} onClose={onClose} onCreate={handleCreateInstance} />
      <InstanceDetailDrawer isOpen={isDetailOpen} onClose={onDetailClose} instance={selectedInstance} />
    </Box>
  );
}
