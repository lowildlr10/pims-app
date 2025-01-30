'use client';

import { API_REFRESH_INTERVAL } from '@/config/intervals';
import API from '@/libs/API';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import {
  ActionIcon,
  Badge,
  JsonInput,
  Modal,
  ScrollArea,
  Tooltip,
} from '@mantine/core';
import DataTableClient from '../Generic/DataTable';
import dayjs from 'dayjs';
import { useDisclosure } from '@mantine/hooks';
import { IconCode } from '@tabler/icons-react';

const defaultTableData: TableDataType = {
  head: [
    {
      id: 'logged_at_formatted',
      label: 'Logged At',
      width: '13%',
      sortable: true,
    },
    {
      id: 'user_formatted',
      label: 'User',
      width: '12%',
      sortable: true,
    },
    {
      id: 'log_id',
      label: 'Log ID',
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
      id: 'message',
      label: 'Message',
      width: '17%',
      sortable: false,
    },
    {
      id: 'details',
      label: 'Details',
      width: '17%',
      sortable: false,
    },
    {
      id: 'data_formatted',
      label: 'Data',
      width: '7%',
      sortable: false,
    },
  ],
  body: [],
};

const DataDisplay = ({
  data,
  opened,
  close,
}: {
  data: string;
  opened: boolean;
  close: () => void;
}) => {
  return (
    <Modal
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      opened={opened}
      onClose={close}
      size={'lg'}
      scrollAreaComponent={ScrollArea.Autosize}
      centered
    >
      <ScrollArea
        h={{
          md: '100%',
          lg: 'calc(100vh - 18em)',
        }}
        sx={{ borderRadius: 5 }}
        mb={'lg'}
      >
        <JsonInput
          variant={'filled'}
          placeholder='Payload'
          value={data}
          formatOnBlur
          autosize
          minRows={4}
          readOnly
        />
      </ScrollArea>
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
  const [jsonData, setJsonData] = useState('');

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
        data_formatted: body?.data ? (
          <Tooltip label={'Click to show data/payload'}>
            <ActionIcon
              variant={'outline'}
              color={'var(--mantine-color-secondary-7)'}
              onClick={() => {
                setJsonData(JSON.stringify(body?.data, null, 2));
                open();
              }}
            >
              <IconCode size={18} stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        ) : (
          '-'
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
        permissions={permissions}
        columnSort={columnSort}
        sortDirection={sortDirection}
        search={search}
        data={tableData}
        perPage={perPage}
        loading={isLoading}
        page={page}
        lastPage={data?.last_page ?? 0}
        from={data?.from ?? 0}
        to={data?.to ?? 0}
        total={data?.total ?? 0}
        refreshData={(params) => mutate(params)}
        onChange={(_search, _page, _perPage, _columnSort, _sortDirection) => {
          setSearch(_search ?? '');
          setPage(_page);
          setPerPage(_perPage);
          setColumnSort(_columnSort ?? columnSort);
          setSortDirection(_sortDirection ?? 'desc');
        }}
        showSearch
        itemsClickable={false}
      />

      <DataDisplay data={jsonData} opened={opened} close={close} />
    </>
  );
};

export default SystemLogsClient;
