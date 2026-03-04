'use client';

import { API_REFRESH_INTERVAL } from '@/config/intervals';
import API from '@/libs/API';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import {
  ActionIcon,
  Badge,
  Box,
  Divider,
  Group,
  JsonInput,
  Modal,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import DataTableClient from '../Generic/DataTable';
import dayjs from 'dayjs';
import { useDisclosure } from '@mantine/hooks';
import { IconEye } from '@tabler/icons-react';

const defaultTableData: TableDataType = {
  head: [
    {
      id: 'log_id',
      label: 'Log ID',
      width: '12%',
      sortable: true,
    },
    {
      id: 'user_formatted',
      label: 'User',
      width: '12%',
      sortable: true,
    },
    {
      id: 'log_module_formatted',
      label: 'Log Module',
      width: '11%',
      sortable: true,
    },
    {
      id: 'log_type_formatted',
      label: 'Log Type',
      width: '11%',
      sortable: true,
    },
    {
      id: 'message_formatted',
      label: 'Message',
      width: '19%',
      sortable: false,
    },
    {
      id: 'details_formatted',
      label: 'Details',
      width: '19%',
      sortable: false,
    },
    {
      id: 'logged_at_formatted',
      label: 'Logged At',
      width: '14%',
      sortable: true,
    },
    {
      id: 'actions_formatted',
      label: '',
      width: '2%',
      sortable: false,
    },
  ],
  body: [],
};

const TruncatedCell = ({ value }: { value?: string }) => {
  if (!value) return <>-</>;
  return (
    <Tooltip label={value} multiline maw={320} withArrow>
      <Text size='sm' lineClamp={2} style={{ cursor: 'default' }}>
        {value}
      </Text>
    </Tooltip>
  );
};

const LogDetailModal = ({
  entry,
  opened,
  close,
}: {
  entry: SystemLogType | null;
  opened: boolean;
  close: () => void;
}) => {
  if (!entry) return null;

  return (
    <Modal
      title={
        <Group gap='xs' align='center'>
          <Text fw={700} size='sm'>
            Log Details
          </Text>
          <Text size='xs' c='dimmed' ff='monospace'>
            #{entry.log_id}
          </Text>
        </Group>
      }
      overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
      opened={opened}
      onClose={close}
      size='lg'
      scrollAreaComponent={ScrollArea.Autosize}
      centered
    >
      <Stack gap='md' pb='md'>
        <SimpleGrid cols={2} spacing='sm'>
          <Box>
            <Text size='xs' c='dimmed' fw={600} tt='uppercase' mb={4}>
              User
            </Text>
            <Text size='sm'>{entry.user?.fullname ?? '—'}</Text>
          </Box>
          <Box>
            <Text size='xs' c='dimmed' fw={600} tt='uppercase' mb={4}>
              Logged At
            </Text>
            <Text size='sm'>
              {dayjs(entry.logged_at).format('YYYY-MM-DD h:mm A')}
            </Text>
          </Box>
          <Box>
            <Text size='xs' c='dimmed' fw={600} tt='uppercase' mb={4}>
              Module
            </Text>
            <Badge color='var(--mantine-color-primary-9)' variant='light'>
              {entry.log_module ?? '—'}
            </Badge>
          </Box>
          <Box>
            <Text size='xs' c='dimmed' fw={600} tt='uppercase' mb={4}>
              Type
            </Text>
            <Badge
              color={
                entry.log_type === 'log'
                  ? 'var(--mantine-color-primary-9)'
                  : 'var(--mantine-color-red-7)'
              }
            >
              {entry.log_type ?? '—'}
            </Badge>
          </Box>
        </SimpleGrid>

        <Divider />

        <Box>
          <Text size='xs' c='dimmed' fw={600} tt='uppercase' mb={4}>
            Message
          </Text>
          <Text size='sm'>{entry.message || '—'}</Text>
        </Box>

        <Box>
          <Text size='xs' c='dimmed' fw={600} tt='uppercase' mb={4}>
            Details
          </Text>
          <Text size='sm' style={{ whiteSpace: 'pre-wrap' }}>
            {entry.details || '—'}
          </Text>
        </Box>

        {entry.data && (
          <>
            <Divider label='Payload' labelPosition='left' />
            <JsonInput
              variant='filled'
              value={JSON.stringify(entry.data, null, 2)}
              formatOnBlur
              autosize
              minRows={4}
              readOnly
            />
          </>
        )}
      </Stack>
    </Modal>
  );
};

const SystemLogsClient = ({ permissions }: LibraryProps) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [columnSort, setColumnSort] = useState('logged_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [paginated] = useState(true);
  const [tableData, setTableData] = useState<TableDataType>(
    defaultTableData ?? {}
  );

  const { data, isLoading, mutate } = useSWR<SystemLogResponse>(
    [`/logs`, search, page, perPage, columnSort, sortDirection, paginated],
    ([
      url,
      search,
      page,
      perPage,
      columnSort,
      sortDirection,
      paginated,
    ]: GeneralResponse) =>
      API.get(url, {
        search,
        page,
        per_page: perPage,
        column_sort: columnSort,
        sort_direction: sortDirection,
        paginated,
      }),
    {
      refreshInterval: API_REFRESH_INTERVAL,
      keepPreviousData: true,
    }
  );

  const [opened, { open, close }] = useDisclosure(false);
  const [selectedEntry, setSelectedEntry] = useState<SystemLogType | null>(
    null
  );

  useEffect(() => {
    const _data = data?.data?.map((body: SystemLogType) => {
      return {
        ...body,
        logged_at_formatted: dayjs(body.logged_at).format('YYYY-MM-DD h:mm A'),
        user_formatted: body.user?.fullname ?? '-',
        log_module_formatted: (
          <Tooltip label={body.log_module}>
            <Badge color={'var(--mantine-color-primary-9)'}>
              {body.log_module}
            </Badge>
          </Tooltip>
        ),
        log_type_formatted: (
          <Badge
            color={
              body.log_type === 'log'
                ? 'var(--mantine-color-primary-9)'
                : 'var(--mantine-color-red-7)'
            }
          >
            {body.log_type}
          </Badge>
        ),
        message_formatted: <TruncatedCell value={body.message} />,
        details_formatted: <TruncatedCell value={body.details} />,
        actions_formatted: (
          <Tooltip label='View details'>
            <ActionIcon
              variant='outline'
              color='var(--mantine-color-secondary-7)'
              onClick={() => {
                setSelectedEntry(body);
                open();
              }}
            >
              <IconEye size={18} stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        ),
      };
    });

    setTableData((prevState) => ({
      ...prevState,
      body: _data ?? [],
    }));
  }, [data]);

  return (
    <>
      <DataTableClient
        mainModule={'system-log'}
        permissions={permissions}
        columnSort={columnSort}
        sortDirection={sortDirection}
        search={search}
        showSearch
        mainItemsClickable={false}
        data={tableData}
        perPage={perPage}
        loading={isLoading}
        page={page}
        lastPage={data?.meta?.last_page ?? 0}
        from={data?.meta?.from ?? 0}
        to={data?.meta?.to ?? 0}
        total={data?.meta?.total ?? 0}
        refreshData={mutate}
        onChange={(_search, _page, _perPage, _columnSort, _sortDirection) => {
          setSearch(_search ?? '');
          setPage(_page);
          setPerPage(_perPage);
          setColumnSort(_columnSort ?? columnSort);
          setSortDirection(_sortDirection ?? 'desc');
        }}
      />

      <LogDetailModal entry={selectedEntry} opened={opened} close={close} />
    </>
  );
};

export default SystemLogsClient;
