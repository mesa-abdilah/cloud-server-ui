import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  useToast,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';

interface CreateInstanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: any) => void;
}

export default function CreateInstanceModal({ isOpen, onClose, onCreate }: CreateInstanceModalProps) {
  const [name, setName] = useState('');
  const [region, setRegion] = useState('us-east-1');
  const [image, setImage] = useState('ubuntu');
  const [cpu, setCpu] = useState(1);
  const [ram, setRam] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = () => {
    if (!name) {
      toast({
        title: 'Error',
        description: 'Instance name is required.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newInstance = {
        name,
        region,
        image,
        cpu: `${cpu} vCPU`,
        ram: `${ram} GB`,
        status: 'Pending',
        type: 'custom',
        ip: '-',
        uptime: '-',
        id: `i-${Math.random().toString(36).substr(2, 9)}`,
      };
      
      onCreate(newInstance);
      setIsSubmitting(false);
      onClose();
      resetForm();
      
      toast({
        title: 'Success',
        description: 'Instance created successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }, 1000);
  };

  const resetForm = () => {
    setName('');
    setRegion('us-east-1');
    setImage('ubuntu');
    setCpu(1);
    setRam(1);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size='xl'>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Instance</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Instance Name</FormLabel>
              <Input 
                placeholder='e.g., Web-Server-01' 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </FormControl>

            <FormControl>
              <FormLabel>Region</FormLabel>
              <Select value={region} onChange={(e) => setRegion(e.target.value)}>
                <option value='us-east-1'>US East (N. Virginia)</option>
                <option value='us-west-2'>US West (Oregon)</option>
                <option value='eu-central-1'>EU (Frankfurt)</option>
                <option value='ap-southeast-1'>Asia Pacific (Singapore)</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>OS Image</FormLabel>
              <Select value={image} onChange={(e) => setImage(e.target.value)}>
                <option value='ubuntu'>Ubuntu 22.04 LTS</option>
                <option value='centos'>CentOS Stream 9</option>
                <option value='debian'>Debian 11</option>
                <option value='windows'>Windows Server 2022</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>vCPU</FormLabel>
              <NumberInput min={1} max={64} value={cpu} onChange={(_, val) => setCpu(val)}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>RAM (GB)</FormLabel>
              <NumberInput min={1} max={256} value={ram} onChange={(_, val) => setRam(val)}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant='ghost' mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme='brand' onClick={handleSubmit} isLoading={isSubmitting}>
            Create Instance
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
