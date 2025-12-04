import { Icon as Iconify } from '@iconify/react';
// Admin Imports
import MainDashboard from 'views/admin/default';
import Profile from 'views/admin/profile';
import Compute from 'views/admin/compute';
import Network from 'views/admin/network';
import Volume from 'views/admin/volume';
import ObjectStorage from 'views/admin/objectStorage';
import Monitoring from 'views/admin/monitoring';
import SignIn from 'views/auth/signIn';

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
    component: <Network />,
    hidden: false,
  },
  {
    name: 'Volume',
    layout: '/admin',
    path: '/volume',
    icon: <Iconify icon="hugeicons:hard-drive" width={24} height={24} style={{ color: 'inherit' }} />,
    component: <Volume />,
    hidden: false,
  },
  {
    name: 'Object Storage',
    layout: '/admin',
    path: '/object-storage',
    icon: <Iconify icon="streamline-plump:database" width={24} height={24} style={{ color: 'inherit' }} />,
    component: <ObjectStorage />,
    hidden: false,
  },
  {
    name: 'System Monitoring',
    layout: '/admin',
    path: '/system-monitoring-logging',
    icon: <Iconify icon="carbon:cloud-monitoring" width={24} height={24} style={{ color: 'inherit' }} />,
    component: <Monitoring />,
    hidden: false,
  },
  {
    name: 'Sign In',
    layout: '/auth',
    path: '/sign-in',
    icon: <Iconify icon="iconoir:user" width={24} height={24} style={{ color: 'inherit' }} />,
    component: <SignIn />,
    hidden: true,
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
