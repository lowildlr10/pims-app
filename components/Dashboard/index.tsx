'use client';

import React from 'react';
import StatsCard from '../Generic/StatsCard';
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  NumberFormatter,
  Paper,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
} from '@mantine/core';
import {
  IconArrowRightCircle,
  IconCircleCheck,
  IconClockHour3,
  IconFileDescription,
  IconPlus,
  IconRefresh,
  IconThumbDown,
} from '@tabler/icons-react';
import useSWR from 'swr';
import API from '@/libs/API';
import { API_REFRESH_INTERVAL } from '@/config/intervals';
import { useMediaQuery } from '@mantine/hooks';
import Link from 'next/link';

const WorkflowButton = ({
  color = 'var(--mantine-color-gray-7)',
  name,
  value,
  href = '#',
}: {
  color?: string;
  name: string;
  value: number;
  href?: string;
}) => {
  const lgScreenAndBelow = useMediaQuery('(max-width: 900px)');

  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <Button
        variant='outline'
        color={color}
        size={lgScreenAndBelow ? 'xs' : 'sm'}
        radius={'md'}
        justify='space-between'
        h={50}
        py={lgScreenAndBelow ? 'xs' : 'sm'}
        rightSection={
          <Group>
            <Badge
              color={color}
              radius={'sm'}
              my={'xs'}
              size={lgScreenAndBelow ? 'md' : 'lg'}
              sx={{ fontWeight: 600 }}
            >
              <NumberFormatter value={value} thousandSeparator />
            </Badge>
            <IconArrowRightCircle size={lgScreenAndBelow ? 18 : 20} />
          </Group>
        }
        fullWidth
      >
        {name}
      </Button>
    </Link>
  );
};

const AccountingWorkflow = ({
  workflow,
}: {
  workflow: AccountingWorkflowType;
}) => {
  const lgScreenAndBelow = useMediaQuery('(max-width: 900px)');

  return (
    <Paper withBorder p='lg' radius='md' shadow='xs'>
      <Text fw={600} size={lgScreenAndBelow ? 'sm' : 'md'}>
        Accounting Workflow
      </Text>
      <Stack mt={lgScreenAndBelow ? 'md' : 'lg'}>
        <WorkflowButton
          color='var(--mantine-color-gray-6)'
          name='Draft'
          value={workflow?.draft ?? 0}
          href='/procurement/dv?status=draft'
        />
        <WorkflowButton
          color='var(--mantine-color-gray-7)'
          name='Pending'
          value={workflow?.pending ?? 0}
          href='/procurement/dv?status=pending'
        />
        <WorkflowButton
          color='var(--mantine-color-red-7)'
          name='Disapproved'
          value={workflow?.pending ?? 0}
          href='/procurement/dv?status=disapproved'
        />
        <WorkflowButton
          color='var(--mantine-color-orange-7)'
          name='For Payment'
          value={workflow?.for_payment ?? 0}
          href='/procurement/dv?status=for_payment'
        />
        <WorkflowButton
          color='var(--mantine-color-green-7)'
          name='Paid'
          value={workflow?.paid ?? 0}
          href='/procurement/dv?status=paid'
        />
      </Stack>
    </Paper>
  );
};

const BudgetWorkflow = ({ workflow }: { workflow: BudgetWorkflowType }) => {
  const lgScreenAndBelow = useMediaQuery('(max-width: 900px)');

  return (
    <Paper withBorder p='lg' radius='md' shadow='xs'>
      <Text fw={600} size={lgScreenAndBelow ? 'sm' : 'md'}>
        Budget Workflow
      </Text>
      <Stack mt={lgScreenAndBelow ? 'md' : 'lg'}>
        <WorkflowButton
          color='var(--mantine-color-gray-6)'
          name='Draft'
          value={workflow?.draft ?? 0}
          href='/procurement/obr?status=draft'
        />
        <WorkflowButton
          color='var(--mantine-color-gray-7)'
          name='Pending'
          value={workflow?.pending ?? 0}
          href='/procurement/obr?status=pending'
        />
        <WorkflowButton
          color='var(--mantine-color-red-7)'
          name='Disapproved'
          value={workflow?.disapproved ?? 0}
          href='/procurement/obr?status=disapproved'
        />
        <WorkflowButton
          color='var(--mantine-color-green-7)'
          name='Obligated'
          value={workflow?.obligated ?? 0}
          href='/procurement/obr?status=obligated'
        />
      </Stack>
    </Paper>
  );
};

const PurchaseOrderWorkflow = ({
  workflow,
}: {
  workflow: PurchaseOrderWorkflowType;
}) => {
  const lgScreenAndBelow = useMediaQuery('(max-width: 900px)');

  return (
    <Paper withBorder p='lg' radius='md' shadow='xs'>
      <Text fw={600} size={lgScreenAndBelow ? 'sm' : 'md'}>
        Purchase Order Workflow
      </Text>
      <Stack mt={lgScreenAndBelow ? 'md' : 'lg'}>
        <WorkflowButton
          color='var(--mantine-color-gray-6)'
          name='Draft'
          value={workflow?.draft ?? 0}
          href='/procurement/po?status=draft'
        />
        <WorkflowButton
          color='var(--mantine-color-yellow-7)'
          name='Issued'
          value={workflow?.issued ?? 0}
          href='/procurement/po?status=issued'
        />
        <WorkflowButton
          color='var(--mantine-color-orange-7)'
          name='For Delivery'
          value={workflow?.for_delivery ?? 0}
          href='/procurement/po?status=for_delivery'
        />
        <WorkflowButton
          color='var(--mantine-color-blue-7)'
          name='For Inspection'
          value={workflow?.for_inspection ?? 0}
          href='/procurement/po?status=for_inspection'
        />
        <WorkflowButton
          color='var(--mantine-color-green-7)'
          name='Completed'
          value={workflow?.completed ?? 0}
          href='/procurement/po?status=completed'
        />
      </Stack>
    </Paper>
  );
};

const PurchaseRequestWorkflow = ({
  workflow,
}: {
  workflow: PurchaseRequestWorkflowType;
}) => {
  const lgScreenAndBelow = useMediaQuery('(max-width: 900px)');

  return (
    <Paper withBorder p='lg' radius='md' shadow='xs'>
      <Text fw={600} size={lgScreenAndBelow ? 'sm' : 'md'}>
        Purchase Request Workflow
      </Text>
      <Stack mt={lgScreenAndBelow ? 'md' : 'lg'}>
        <WorkflowButton
          color='var(--mantine-color-gray-6)'
          name='Draft'
          value={workflow?.draft ?? 0}
          href='/procurement/pr?status=draft'
        />
        <WorkflowButton
          color='var(--mantine-color-gray-7)'
          name='Pending'
          value={workflow?.pending ?? 0}
          href='/procurement/pr?status=pending'
        />
        <WorkflowButton
          color='var(--mantine-color-teal-7)'
          name='Approved'
          value={workflow?.approved ?? 0}
          href='/procurement/pr?status=approved'
        />
        <WorkflowButton
          color='var(--mantine-color-orange-7)'
          name='For Canvassing'
          value={workflow?.for_canvassing ?? 0}
          href='/procurement/pr?status=for_canvassing'
        />
        <WorkflowButton
          color='var(--mantine-color-green-7)'
          name='Completed'
          value={workflow?.completed ?? 0}
          href='/procurement/pr?status=completed'
        />
      </Stack>
    </Paper>
  );
};

const WorkflowSkeleton = () => {
  const lgScreenAndBelow = useMediaQuery('(max-width: 900px)');

  return (
    <Paper withBorder p='lg' radius='md' shadow='xs'>
      <Skeleton
        height={lgScreenAndBelow ? 14 : 18}
        radius='sm'
        mb={lgScreenAndBelow ? 'md' : 'lg'}
      />
      <Stack mt={lgScreenAndBelow ? 'md' : 'lg'}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} height={50} radius='md' />
        ))}
      </Stack>
    </Paper>
  );
};

const DashboardClient = ({ user }: DashboardProps) => {
  const lgScreenAndBelow = useMediaQuery('(max-width: 900px)');
  const { data, isLoading, mutate } = useSWR<DashboardResponse>(
    [`/dashboard`],
    ([url]) => API.get(url),
    {
      refreshInterval: API_REFRESH_INTERVAL,
      keepPreviousData: true,
    }
  );
  const workflowCount = [
    data?.data.show_pr_workflow,
    data?.data.show_po_workflow,
    data?.data.show_budget_workflow,
    data?.data.show_accounting_workflow,
  ].filter(Boolean).length;

  return (
    <Stack>
      <Group align='end' justify='end'>
        <Link href={'/procurement/pr/create'}>
          <Button
            color='var(--mantine-color-primary-9)'
            leftSection={<IconPlus size={15} stroke={1.5} />}
            size={lgScreenAndBelow ? 'xs' : 'sm'}
          >
            New Request
          </Button>
        </Link>
        <Button
          variant='light'
          color='var(--mantine-color-primary-9)'
          leftSection={<IconRefresh size={15} stroke={1.5} />}
          loading={isLoading}
          size={lgScreenAndBelow ? 'xs' : 'sm'}
          onClick={() => mutate()}
        >
          Refresh
        </Button>
      </Group>
      <Stack gap={'3em'}>
        <SimpleGrid cols={{ base: 1, xs: 2, lg: 4 }}>
          <StatsCard
            title={'Active Requests'}
            icon={<IconFileDescription size={28} stroke={1.5} />}
            color={'var(--mantine-color-primary-9)'}
            value={data?.data.active ?? 0}
            href={
              '/procurement/pr?status=pending,approved_cash_available,approved,disapproved,' +
              'for_canvassing,for_recanvassing,for_abstract,partially_awarded,awarded'
            }
            loading={isLoading}
          />
          <StatsCard
            title={'Pending Approval'}
            color={'var(--mantine-color-yellow-9)'}
            icon={<IconClockHour3 size={28} stroke={1.5} />}
            value={data?.data.pending_approval ?? 0}
            href={'/procurement/pr?status=pending,approved_cash_available'}
            loading={isLoading}
          />
          <StatsCard
            title={'Disapproved'}
            color={'var(--mantine-color-red-9)'}
            icon={<IconThumbDown size={28} stroke={1.5} />}
            value={data?.data.disapproved ?? 0}
            href={'/procurement/pr?status=disapproved'}
            loading={isLoading}
          />
          <StatsCard
            title={'Completed Requests'}
            icon={<IconCircleCheck size={28} stroke={1.5} />}
            color={'var(--mantine-color-green-7)'}
            value={data?.data.completed ?? 0}
            href={'/procurement/pr?status=completed'}
            loading={isLoading}
          />
        </SimpleGrid>

        {workflowCount > 0 && !isLoading && (
          <SimpleGrid
            cols={{
              base: 1,
              md: workflowCount > 1 ? 2 : 1,
              xl: workflowCount ?? 1,
            }}
          >
            {data?.data.show_pr_workflow && (
              <PurchaseRequestWorkflow workflow={data?.data?.pr_workflow} />
            )}

            {data?.data.show_po_workflow && (
              <PurchaseOrderWorkflow workflow={data?.data?.po_workflow} />
            )}

            {data?.data.show_budget_workflow && (
              <BudgetWorkflow workflow={data?.data.budget_workflow} />
            )}

            {data?.data.show_accounting_workflow && (
              <AccountingWorkflow workflow={data?.data.accounting_workflow} />
            )}
          </SimpleGrid>
        )}

        {isLoading && (
          <SimpleGrid cols={{ base: 1, md: 2, xl: 4 }}>
            <WorkflowSkeleton />
            <WorkflowSkeleton />
            <WorkflowSkeleton />
            <WorkflowSkeleton />
          </SimpleGrid>
        )}
      </Stack>
    </Stack>
  );
};

export default DashboardClient;
