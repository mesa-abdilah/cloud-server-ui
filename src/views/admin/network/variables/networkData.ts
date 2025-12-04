export interface Network {
  id: string;
  name: string;
  status: 'Active' | 'Down' | 'Error';
  adminState: boolean;
  shared: boolean;
  external: boolean;
  subnets: Subnet[];
  tenantId: string;
  availabilityZones: string[];
}

export interface Subnet {
  id: string;
  name: string;
  cidr: string;
  ipVersion: 4 | 6;
  gatewayIp: string;
  allocationPools: { start: string; end: string }[];
  dnsNameservers: string[];
}

export interface Router {
  id: string;
  name: string;
  status: 'Active' | 'Down';
  externalGatewayInfo: {
    networkId: string;
    enableSnat: boolean;
    externalFixedIps: { ipAddress: string; subnetId: string }[];
  } | null;
  adminStateUp: boolean;
}

export interface SecurityGroup {
  id: string;
  name: string;
  description: string;
  rules: SecurityGroupRule[];
}

export interface SecurityGroupRule {
  id: string;
  direction: 'ingress' | 'egress';
  ethertype: 'IPv4' | 'IPv6';
  protocol: string;
  portRangeMin: number | null;
  portRangeMax: number | null;
  remoteIpPrefix: string | null;
}

export interface FloatingIP {
  id: string;
  floatingIpAddress: string;
  fixedIpAddress: string | null;
  status: 'Active' | 'Down';
  routerId: string | null;
  portId: string | null;
}

export interface LoadBalancer {
  id: string;
  name: string;
  vipAddress: string;
  provisioningStatus: 'ACTIVE' | 'PENDING_CREATE' | 'ERROR';
  operatingStatus: 'ONLINE' | 'OFFLINE';
  provider: string;
  listeners: Listener[];
}

export interface Listener {
  id: string;
  name: string;
  protocol: 'HTTP' | 'HTTPS' | 'TCP';
  protocolPort: number;
  adminStateUp: boolean;
}

// Mock Data
export const mockNetworks: Network[] = [
  {
    id: 'net-1',
    name: 'public-net',
    status: 'Active',
    adminState: true,
    shared: true,
    external: true,
    tenantId: 'admin',
    availabilityZones: ['nova'],
    subnets: [
      {
        id: 'sub-1',
        name: 'public-subnet',
        cidr: '172.24.4.0/24',
        ipVersion: 4,
        gatewayIp: '172.24.4.1',
        allocationPools: [{ start: '172.24.4.2', end: '172.24.4.254' }],
        dnsNameservers: ['8.8.8.8'],
      },
    ],
  },
  {
    id: 'net-2',
    name: 'private-net',
    status: 'Active',
    adminState: true,
    shared: false,
    external: false,
    tenantId: 'demo',
    availabilityZones: ['nova'],
    subnets: [
      {
        id: 'sub-2',
        name: 'private-subnet',
        cidr: '10.0.0.0/24',
        ipVersion: 4,
        gatewayIp: '10.0.0.1',
        allocationPools: [{ start: '10.0.0.2', end: '10.0.0.254' }],
        dnsNameservers: [],
      },
    ],
  },
];

export const mockRouters: Router[] = [
  {
    id: 'r-1',
    name: 'demo-router',
    status: 'Active',
    adminStateUp: true,
    externalGatewayInfo: {
      networkId: 'net-1',
      enableSnat: true,
      externalFixedIps: [{ ipAddress: '172.24.4.10', subnetId: 'sub-1' }],
    },
  },
];

export const mockSecurityGroups: SecurityGroup[] = [
  {
    id: 'sg-1',
    name: 'default',
    description: 'Default security group',
    rules: [
      {
        id: 'rule-1',
        direction: 'ingress',
        ethertype: 'IPv4',
        protocol: 'any',
        portRangeMin: null,
        portRangeMax: null,
        remoteIpPrefix: 'sg-1',
      },
      {
        id: 'rule-2',
        direction: 'egress',
        ethertype: 'IPv4',
        protocol: 'any',
        portRangeMin: null,
        portRangeMax: null,
        remoteIpPrefix: '0.0.0.0/0',
      },
    ],
  },
  {
    id: 'sg-2',
    name: 'web-server',
    description: 'Allow HTTP/HTTPS',
    rules: [
      {
        id: 'rule-3',
        direction: 'ingress',
        ethertype: 'IPv4',
        protocol: 'tcp',
        portRangeMin: 80,
        portRangeMax: 80,
        remoteIpPrefix: '0.0.0.0/0',
      },
      {
        id: 'rule-4',
        direction: 'ingress',
        ethertype: 'IPv4',
        protocol: 'tcp',
        portRangeMin: 443,
        portRangeMax: 443,
        remoteIpPrefix: '0.0.0.0/0',
      },
    ],
  },
];

export const mockFloatingIPs: FloatingIP[] = [
  {
    id: 'fip-1',
    floatingIpAddress: '172.24.4.100',
    fixedIpAddress: '10.0.0.15',
    status: 'Active',
    routerId: 'r-1',
    portId: 'port-1',
  },
  {
    id: 'fip-2',
    floatingIpAddress: '172.24.4.101',
    fixedIpAddress: null,
    status: 'Down',
    routerId: null,
    portId: null,
  },
];

export const mockLoadBalancers: LoadBalancer[] = [
  {
    id: 'lb-1',
    name: 'web-lb',
    vipAddress: '10.0.0.50',
    provisioningStatus: 'ACTIVE',
    operatingStatus: 'ONLINE',
    provider: 'octavia',
    listeners: [
      {
        id: 'list-1',
        name: 'http-listener',
        protocol: 'HTTP',
        protocolPort: 80,
        adminStateUp: true,
      },
    ],
  },
];
