export const dashboardData = {
  systemMetrics: {
    totalVms: {
      value: 8,
      trend: [1, 2, 3, 4, 5, 6, 8],
    },
    resourceUsage: {
      cpu: { used: 120, total: 512, unit: 'Cores', percentage: 23.4 },
      ram: { used: 1024, total: 2048, unit: 'GB', percentage: 50 },
      storage: { used: 10, total: 20, unit: 'TB', percentage: 50 },
    },
    hypervisors: {
      total: 50,
      healthy: 48,
      warning: 1,
      critical: 1,
    },
    networkTraffic: {
      inbound: '1.2 Gbps',
      outbound: '850 Mbps',
    },
    recentAlerts: [
      { id: 1, message: 'High CPU usage on node-05', severity: 'warning', timestamp: '10 mins ago' },
      { id: 2, message: 'Storage pool "ssd-pool" is 85% full', severity: 'warning', timestamp: '1 hour ago' },
      { id: 3, message: 'Network latency detected on switch-02', severity: 'error', timestamp: '2 hours ago' },
      { id: 4, message: 'Backup failed for volume vol-backup-01', severity: 'error', timestamp: '5 hours ago' },
      { id: 5, message: 'New hypervisor node-12 added', severity: 'success', timestamp: '1 day ago' },
    ],
  },
  userMetrics: {
    instanceStatus: {
      running: 8,
      stopped: 2,
    },
    quotaUsage: {
      vcpu: { used: 10, total: 20, unit: 'Cores' },
      ram: { used: 32, total: 64, unit: 'GB' },
      storage: { used: 150, total: 500, unit: 'GB' },
      volumes: { used: 5, total: 10, unit: 'Count' },
      floatingIps: { used: 2, total: 5, unit: 'Count' },
    },
    recentActivities: [
      { id: 1, action: 'Created instance "web-server-01"', timestamp: '15 mins ago', status: 'success' },
      { id: 2, action: 'Attached volume to "db-server"', timestamp: '2 hours ago', status: 'success' },
      { id: 3, action: 'Failed to create snapshot', timestamp: '5 hours ago', status: 'error' },
      { id: 4, action: 'Restarted instance "cache-01"', timestamp: '1 day ago', status: 'success' },
      { id: 5, action: 'Allocated new Floating IP', timestamp: '2 days ago', status: 'success' },
    ],
    billing: {
      currentMonth: 'Rp 2.500.000',
      projected: 'Rp 3.100.000',
    },
  },
};
