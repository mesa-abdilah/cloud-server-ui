// Chakra imports
import { Avatar, Box, Flex, FormLabel, Icon, Select, SimpleGrid, useColorModeValue } from '@chakra-ui/react';
// Assets
import Usa from 'assets/img/dashboards/usa.png';
import { Icon as Iconify } from '@iconify/react';
// Custom components
import MiniCalendar from 'components/calendar/MiniCalendar';
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import { MdAddTask, MdFileCopy } from 'react-icons/md';
import CheckTable from 'views/admin/rtl/components/CheckTable';
import ComplexTable from 'views/admin/default/components/ComplexTable';
import DailyTraffic from 'views/admin/default/components/DailyTraffic';
import PieCard from 'views/admin/default/components/PieCard';
import Tasks from 'views/admin/default/components/Tasks';
import TotalSpent from 'views/admin/default/components/TotalSpent';
import WeeklyRevenue from 'views/admin/default/components/WeeklyRevenue';
import tableDataCheck from 'views/admin/default/variables/tableDataCheck';
import tableDataComplex from 'views/admin/default/variables/tableDataComplex';

export default function UserReports() {
	// Chakra Color Mode
	const brandColor = useColorModeValue('brand.500', 'white');
	const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
	return (
		<Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
			<SimpleGrid columns={{ base: 1, md: 2, lg: 3, '2xl': 6 }} gap='20px' mb='20px'>
				<MiniStatistics
					startContent={
						<IconBox
							w='56px'
							h='56px'
							bg={boxBg}
              icon={<Iconify icon='mdi:server' width={24} height={24} />}
						/>
					}
					name='Instances'
					value='4'
				/>
				<MiniStatistics
					startContent={
						<IconBox
							w='56px'
							h='56px'
							bg={boxBg}
              icon={<Iconify icon='hugeicons:hard-drive' width={24} height={24} />}
						/>
					}
					name='Volume'
					value='200GB'
				/>
				<MiniStatistics growth='+23%' name='Total Cost' value='Rp 20.000.000' />
				<MiniStatistics
					endContent={
						<Flex me='-16px' mt='10px'>
							<FormLabel htmlFor='balance'>
								<Avatar src={Usa} />
							</FormLabel>
							<Select id='balance' variant='mini' mt='5px' me='0px' defaultValue='usd'>
								<option value='usd'>USD</option>
								<option value='eur'>EUR</option>
								<option value='gba'>GBA</option>
							</Select>
						</Flex>
					}
					name='Your balance'
					value='$1,000'
				/>
				<MiniStatistics
					startContent={
						<IconBox
							w='56px'
							h='56px'
							bg='linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)'
                            icon={<Icon w='28px' h='28px' as={MdAddTask as any} color='white' />}
						/>
					}
					name='New Tasks'
					value='154'
				/>
				<MiniStatistics
					startContent={
						<IconBox
							w='56px'
							h='56px'
							bg={boxBg}
                            icon={<Icon w='32px' h='32px' as={MdFileCopy as any} color={brandColor} />}
						/>
					}
					name='Total Projects'
					value='2935'
				/>
			</SimpleGrid>

			<SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px' mb='20px'>
				<TotalSpent />
				<WeeklyRevenue />
			</SimpleGrid>
			<SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap='20px' mb='20px'>
				<CheckTable tableData={tableDataCheck} />
				<SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px'>
					<DailyTraffic />
					<PieCard />
				</SimpleGrid>
			</SimpleGrid>
			<SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap='20px' mb='20px'>
				<ComplexTable tableData={tableDataComplex} />
				<SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px'>
					<Tasks />
					<MiniCalendar h='100%' minW='100%' selectRange={false} />
				</SimpleGrid>
			</SimpleGrid>
		</Box>
	);
}
