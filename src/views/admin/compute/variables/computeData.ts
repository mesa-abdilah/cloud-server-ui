export type ComputeStatus = 'Running' | 'Stopped' | 'Terminated' | 'Pending';

export interface ComputeInstance {
  id: string;
  name: string;
  status: ComputeStatus;
  region: string;
  type: string;
  ip: string;
  cpu: string;
  ram: string;
  uptime: string;
  image: string; // URL to OS icon or similar
}

const computeData: ComputeInstance[] = [
  {
    id: 'i-0a1b2c3d4e5f',
    name: 'Web-Server-01',
    status: 'Running',
    region: 'us-east-1',
    type: 't3.medium',
    ip: '192.168.1.10',
    cpu: '2 vCPU',
    ram: '4 GB',
    uptime: '14d 2h',
    image: 'https://cdn.iconscout.com/icon/free/png-256/ubuntu-3-1175072.png',
  },
  {
    id: 'i-1b2c3d4e5f6g',
    name: 'DB-Primary',
    status: 'Running',
    region: 'us-east-1',
    type: 'r5.large',
    ip: '192.168.1.20',
    cpu: '4 vCPU',
    ram: '16 GB',
    uptime: '30d 5h',
    image: 'https://cdn.iconscout.com/icon/free/png-256/ubuntu-3-1175072.png',
  },
  {
    id: 'i-2c3d4e5f6g7h',
    name: 'Worker-Node-Alpha',
    status: 'Stopped',
    region: 'us-west-2',
    type: 'c5.xlarge',
    ip: '10.0.0.5',
    cpu: '8 vCPU',
    ram: '16 GB',
    uptime: '-',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Tux.svg/1200px-Tux.svg.png',
  },
  {
    id: 'i-3d4e5f6g7h8i',
    name: 'Dev-Environment',
    status: 'Pending',
    region: 'eu-central-1',
    type: 't3.micro',
    ip: '-',
    cpu: '1 vCPU',
    ram: '1 GB',
    uptime: '-',
    image: 'https://cdn.iconscout.com/icon/free/png-256/ubuntu-3-1175072.png',
  },
  {
    id: 'i-4e5f6g7h8i9j',
    name: 'Analytics-Engine',
    status: 'Running',
    region: 'ap-southeast-1',
    type: 'm5.2xlarge',
    ip: '172.16.0.100',
    cpu: '16 vCPU',
    ram: '64 GB',
    uptime: '2d 1h',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Tux.svg/1200px-Tux.svg.png',
  },
  {
    id: 'i-5f6g7h8i9j0k',
    name: 'Backup-Server',
    status: 'Terminated',
    region: 'us-east-1',
    type: 't3.small',
    ip: '-',
    cpu: '2 vCPU',
    ram: '2 GB',
    uptime: '-',
    image: 'https://cdn.iconscout.com/icon/free/png-256/ubuntu-3-1175072.png',
  },
  {
    id: 'i-6g7h8i9j0k1l',
    name: 'Cache-Cluster-01',
    status: 'Running',
    region: 'us-west-2',
    type: 'r6g.large',
    ip: '10.0.1.50',
    cpu: '2 vCPU',
    ram: '16 GB',
    uptime: '120d 4h',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Tux.svg/1200px-Tux.svg.png',
  },
  {
    id: 'i-7h8i9j0k1l2m',
    name: 'Frontend-LB',
    status: 'Running',
    region: 'us-east-1',
    type: 't3.medium',
    ip: '54.123.45.67',
    cpu: '2 vCPU',
    ram: '4 GB',
    uptime: '45d 12h',
    image: 'https://cdn.iconscout.com/icon/free/png-256/ubuntu-3-1175072.png',
  },
];

export default computeData;
