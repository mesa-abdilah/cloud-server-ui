import React from 'react';

// chakra imports
import {
	Box,
	Flex,
	Drawer,
	DrawerBody,
	Icon,
	useColorModeValue,
	DrawerOverlay,
	useDisclosure,
	DrawerContent,
	DrawerCloseButton
} from '@chakra-ui/react';
import Content from 'components/sidebar/components/Content';
import { renderThumb, renderTrack, renderView } from 'components/scrollbar/Scrollbar';
import { Scrollbars } from 'react-custom-scrollbars-2';

// Assets
import { IoMenuOutline } from 'react-icons/io5';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { SidebarContext } from 'contexts/SidebarContext';

function Sidebar(props: { routes: RoutesType[]; [x: string]: any }) {
  const { routes } = props;
  console.log('[SidebarContext]:', React.useContext(SidebarContext) as any);
  const { toggleSidebar, setToggleSidebar } = React.useContext(SidebarContext) as any;

	let variantChange = '0.2s linear';
	let shadow = useColorModeValue('14px 17px 40px 4px rgba(112, 144, 176, 0.08)', 'unset');
	// Chakra Color Mode
	let sidebarBg = useColorModeValue('white', 'navy.800');
	let sidebarMargins = '0px';

	// SIDEBAR
	return (
    <Box display={{ sm: 'none', xl: 'block' }} position='fixed' minH='100%'>
      <Box
        bg={sidebarBg}
        transition={variantChange}
        w={toggleSidebar ? '80px' : '300px'}
        h='100vh'
        m={sidebarMargins}
        minH='100%'
        overflow='hidden'
        boxShadow={shadow}>
        <Flex px='10px' pt='10px' pb='0' justify='flex-end'>
          <Icon
            as={(toggleSidebar ? MdChevronRight : MdChevronLeft) as any}
            w='24px'
            h='24px'
            _hover={{ cursor: 'pointer' }}
            onClick={() => setToggleSidebar && setToggleSidebar(!toggleSidebar)}
          />
        </Flex>
        <Scrollbars
          autoHide
          renderTrackVertical={renderTrack}
          renderThumbVertical={renderThumb}
          renderView={renderView}>
          <Content routes={routes} collapsed={toggleSidebar} />
        </Scrollbars>
      </Box>
    </Box>
	);
}

// FUNCTIONS
export function SidebarResponsive(props: { routes: RoutesType[] }) {
	let sidebarBackgroundColor = useColorModeValue('white', 'navy.800');
	let menuColor = useColorModeValue('gray.400', 'white');
	// // SIDEBAR
	const { isOpen, onOpen, onClose } = useDisclosure();
	const btnRef = React.useRef();

	const { routes } = props;
	// let isWindows = navigator.platform.startsWith("Win");
	//  BRAND

	return (
		<Flex display={{ sm: 'flex', xl: 'none' }} alignItems='center'>
			<Flex ref={btnRef} w='max-content' h='max-content' onClick={onOpen}>
				<Icon
					as={IoMenuOutline as any}
					color={menuColor}
					my='auto'
					w='20px'
					h='20px'
					me='10px'
					_hover={{ cursor: 'pointer' }}
				/>
			</Flex>
			<Drawer
				isOpen={isOpen}
				onClose={onClose}
				placement={document.documentElement.dir === 'rtl' ? 'right' : 'left'}
				finalFocusRef={btnRef}>
				<DrawerOverlay />
				<DrawerContent w='285px' maxW='285px' bg={sidebarBackgroundColor}>
					<DrawerCloseButton
						zIndex='3'
						onClick={onClose}
						_focus={{ boxShadow: 'none' }}
						_hover={{ boxShadow: 'none' }}
					/>
					<DrawerBody maxW='285px' px='0rem' pb='0'>
						<Scrollbars
							autoHide
							renderTrackVertical={renderTrack}
							renderThumbVertical={renderThumb}
							renderView={renderView}>
							<Content routes={routes} />
						</Scrollbars>
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</Flex>
	);
}
// PROPS

export default Sidebar;
