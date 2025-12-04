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
  os: string;
  image: string;
}

const computeData: ComputeInstance[] = [
  {
    id: 'i-0a1b2c3d4e5f',
    name: 'db-cluster',
    status: 'Running',
    region: 'id-jkt-1',
    type: 'g1.2xlarge',
    ip: '34.101.10.21',
    cpu: '16 vCPU',
    ram: '32 GB',
    uptime: '14d 2h',
    os: 'Ubuntu 24.04 LTS',
    image: 'https://logonoid.com/images/ubuntu-logo.png',
  },
  {
    id: 'i-1b2c3d4e5f6g',
    name: 'web-node-01',
    status: 'Running',
    region: 'id-jkt-1',
    type: 'g1.large',
    ip: '34.101.11.22',
    cpu: '4 vCPU',
    ram: '8 GB',
    uptime: '30d 5h',
    os: 'Ubuntu 24.04 LTS',
    image: 'https://logonoid.com/images/ubuntu-logo.png',
  },
  {
    id: 'i-2c3d4e5f6g7h',
    name: 'web-node-02',
    status: 'Running',
    region: 'id-jkt-1',
    type: 'g1.large',
    ip: '34.101.12.23',
    cpu: '4 vCPU',
    ram: '8 GB',
    uptime: '-',
    os: 'Ubuntu 24.04 LTS',
    image: 'https://logonoid.com/images/ubuntu-logo.png',
  },
  {
    id: 'i-3d4e5f6g7h8i',
    name: 'web-node-03',
    status: 'Running',
    region: 'id-jkt-1',
    type: 'g1.large',
    ip: '34.101.13.24',
    cpu: '4 vCPU',
    ram: '8 GB',
    uptime: '-',
    os: 'Ubuntu 24.04 LTS',
    image: 'https://logonoid.com/images/ubuntu-logo.png',
  },
  {
    id: 'i-4e5f6g7h8i9j',
    name: 'big-data-cluster',
    status: 'Running',
    region: 'id-jkt-1',
    type: 's1.xlarge',
    ip: '34.101.14.25',
    cpu: '8 vCPU',
    ram: '16 GB',
    uptime: '2d 1h',
    os: 'Ubuntu 24.04 LTS',
    image: 'https://logonoid.com/images/ubuntu-logo.png',
  },
  {
    id: 'i-5f6g7h8i9j0k',
    name: 'bucket-backup-db',
    status: 'Running',
    region: 'id-jkt-1',
    type: 's1.large',
    ip: '34.101.15.26',
    cpu: '4 vCPU',
    ram: '8 GB',
    uptime: '35d 11h',
    os: 'Ubuntu 24.04 LTS',
    image: 'https://logonoid.com/images/ubuntu-logo.png',
  },
  {
    id: 'i-6g7h8i9j0k1l',
    name: 'Cache-Cluster-01',
    status: 'Running',
    region: 'id-jkt-1',
    type: 'r6g.large',
    ip: '34.101.16.27',
    cpu: '2 vCPU',
    ram: '16 GB',
    uptime: '120d 4h',
    os: 'Ubuntu 24.04 LTS',
    image: 'https://logonoid.com/images/ubuntu-logo.png',
  },
  {
    id: 'i-7h8i9j0k1l2m',
    name: 'Frontend-LB',
    status: 'Running',
    region: 'id-jkt-1',
    type: 't3.medium',
    ip: '34.101.17.28',
    cpu: '2 vCPU',
    ram: '4 GB',
    uptime: '45d 12h',
    os: 'Ubuntu 24.04 LTS',
    image: 'https://logonoid.com/images/ubuntu-logo.png',
  },
];

export default computeData;
