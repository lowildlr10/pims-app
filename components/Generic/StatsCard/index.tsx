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
import { useMediaQuery } from '@mantine/hooks';

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
  const lgScreenAndBelow = useMediaQuery('(max-width: 900px)');

  return (
    <Stack>
      <Paper withBorder p='lg' radius='md'>
        <Group justify='apart'>
          <ThemeIcon
            color={color}
            variant='light'
            size={lgScreenAndBelow ? 48 : 55}
            radius='md'
          >
            {icon}
          </ThemeIcon>
          <Stack gap={4}>
            <Text
              c='dimmed'
              tt='uppercase'
              fw={600}
              fz={lgScreenAndBelow ? 'xs' : 'sm'}
              className={classes.label}
            >
              {title}
            </Text>

            {!loading ? (
              <Text fw={700} size={lgScreenAndBelow ? '1.55rem' : '1.75rem'}>
                <NumberFormatter value={value} thousandSeparator />
              </Text>
            ) : (
              <Skeleton
                height={lgScreenAndBelow ? '1.55rem' : '1.75rem'}
                radius='sm'
              />
            )}
          </Stack>
        </Group>
        <Group align='flex-end' justify='end'>
          <Link href={href}>
            <Button
              variant='transparent'
              size={lgScreenAndBelow ? '0.75rem' : 'xs'}
              p={0}
            >
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
