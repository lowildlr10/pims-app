'use client';

import {
  Button,
  Group,
  Loader,
  NumberFormatter,
  Paper,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import React, { ReactNode } from 'react';
import classes from './index.module.css';
import { IconArrowRight, IconFile } from '@tabler/icons-react';
import Link from 'next/link';

const StatsCard = ({
  title,
  value,
  href = '#',
  icon = <IconFile size={28} stroke={1.5} />,
  color = 'var(--mantine-color-primary-9)',
  loading = false,
}: {
  title: string;
  value: string | number;
  href?: string;
  icon?: ReactNode;
  color?: string;
  loading?: boolean;
}) => {
  return (
    <Stack>
      <Paper withBorder p='lg' radius='md'>
        <Group justify='apart'>
          <ThemeIcon color={color} variant='light' size={55} radius='md'>
            {icon}
          </ThemeIcon>
          <Stack gap={4}>
            <Text
              c='dimmed'
              tt='uppercase'
              fw={600}
              fz='sm'
              className={classes.label}
            >
              {title}
            </Text>

            {!loading ? (
              <Text fw={700} size={'1.75rem'}>
                <NumberFormatter value={value} thousandSeparator />
              </Text>
            ) : (
              <Skeleton height={'1.75rem'} radius='sm' />
            )}
          </Stack>
        </Group>
        <Group align='flex-end' justify='end'>
          <Link href={href}>
            <Button variant='transparent' size='xs' p={0}>
              View&nbsp;
              <IconArrowRight size={15} />
            </Button>
          </Link>
        </Group>
      </Paper>
    </Stack>
  );
};

export default StatsCard;
