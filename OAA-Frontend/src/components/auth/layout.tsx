import * as React from 'react';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { paths } from '@/paths';
import { DynamicLogo } from '@/components/core/logo';

export interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'radial-gradient(circle, #122647 0%, #090E23 100%)',
        color: 'var(--mui-palette-common-white)',
        p: 3,
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Box component={RouterLink} href={paths.home} sx={{ display: 'inline-block', fontSize: 0 }}>
          
        </Box>
      </Box>
      <Typography
        color="inherit"
        sx={{ fontSize: '24px', lineHeight: '32px', textAlign: 'center', mb: 4 }}
        variant="h1"
      >
        Welcome to the{' '}
        <Box component="span" sx={{ color: '#15b79e' }}>
          Operational Awareness Application (OAA)
        </Box>
      </Typography>
      <Box sx={{ maxWidth: '450px', width: '100%' }}>{children}</Box>
    </Box>
  );
}
