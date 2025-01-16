import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Data Simulation', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'customers', title: 'Operational Overview', href: paths.dashboard.customers, icon: 'users' },
  { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
] satisfies NavItemConfig[];
