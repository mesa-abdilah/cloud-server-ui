import { Icon as Iconify } from '@iconify/react';
// Admin Imports
import MainDashboard from 'views/admin/default';
import NFTMarketplace from 'views/admin/marketplace';
import Profile from 'views/admin/profile';
import DataTables from 'views/admin/dataTables';
import Compute from 'views/admin/compute';

const routes = [
  {
    name: 'Dashboard',
    layout: '/admin',
    path: '/default',
    icon: <Iconify icon="duo-icons:dashboard" width={24} height={24} style={{ color: 'inherit' }} />,
    component: <MainDashboard />,
    hidden: false,
  },
  {
    name: 'Compute',
    layout: '/admin',
    path: '/compute',
    icon: <Iconify icon="uil:server" width={24} height={24} style={{ color: 'inherit' }} />,
    component: <Compute />,
    hidden: false,
  },
  {
    name: 'Network',
    layout: '/admin',
    icon: <Iconify icon="iconoir:network" width={24} height={24} style={{ color: 'inherit' }} />,
    path: '/network',
    component: <DataTables />,
    hidden: false,
  },
  {
    name: 'Volume',
    layout: '/admin',
    path: '/volume',
    icon: <Iconify icon="hugeicons:hard-drive" width={24} height={24} style={{ color: 'inherit' }} />,
    component: <DataTables />,
    hidden: false,
  },
  {
    name: 'Object Storage',
    layout: '/admin',
    path: '/object-storage',
    icon: <Iconify icon="streamline-plump:database" width={24} height={24} style={{ color: 'inherit' }} />,
    component: <DataTables />,
    hidden: false,
  },
  {
    name: 'System Monitoring',
    layout: '/admin',
    path: '/system-monitoring-logging',
    icon: <Iconify icon="carbon:cloud-monitoring" width={24} height={24} style={{ color: 'inherit' }} />,
    component: <DataTables />,
    hidden: false,
  },
  {
    name: 'Profile',
    layout: '/admin',
    path: '/profile',
    icon: <Iconify icon="iconoir:user" width={24} height={24} style={{ color: 'inherit' }} />,
    component: <Profile />,
    hidden: true,
  },
];

export default routes;
