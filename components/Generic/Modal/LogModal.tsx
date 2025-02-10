import {
  Button,
  Divider,
  Group,
  Modal,
  Paper,
  ScrollArea,
  Stack,
  Text,
} from '@mantine/core';
import React, { useState } from 'react';
import { IconX } from '@tabler/icons-react';
import useSWR from 'swr';
import API from '@/libs/API';
import { API_REFRESH_INTERVAL } from '@/config/intervals';
import { LoadingOverlay } from '@mantine/core';
import dayjs from 'dayjs';

const LogModalClient = ({
  id,
  title,
  endpoint,
  opened,
  close
}: LogModalProps) => {
  const [logId, setSetLogId] = useState(id ?? '');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [paginated] = useState(true);
  // const [tableData, setTableData] = useState<TableDataType>(
  //   defaultTableData ?? {}
  // );

  const { data, isLoading, mutate } = useSWR<SystemLogResponse>(
    [endpoint, logId, page, perPage, paginated],
    ([
      url,
      logId,
      page,
      perPage,
      paginated,
    ]: GeneralResponse) =>
      API.get(url, {
        page,
        log_id: logId,
        per_page: perPage,
        paginated,
      }),
    {
      refreshInterval: API_REFRESH_INTERVAL,
      keepPreviousData: true,
    }
  );

  return (
    <Modal
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      opened={opened}
      onClose={close}
      title={title ?? 'Document Logs'}
      size={'md'}
      scrollAreaComponent={ScrollArea.Autosize}
      centered
    >
      <LoadingOverlay
        visible={isLoading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />

      <Stack mb={50} p={'sm'}>
        {data?.data.map(log => (
          <Paper key={log?.id} p={'sm'} py={'md'} shadow={'sm'}>
            <Stack gap={'sm'} c={log.log_type === 'error' ? 'var(--mantine-color-red-7)' : 'var(--mantine-color-gray-7)'}>
              <Group grow>
                <Text>Logged At:</Text>
                <Text>
                  {dayjs(log?.logged_at).format('MM/DD/YYYY HH:mm')}
                </Text>
              </Group>
              <Divider />
              <Group grow>
                <Text>User:</Text>
                <Text>
                  {log?.user?.fullname}
                </Text>
              </Group>
              <Divider />
              <Group grow>
                <Text>
                  Message:
                </Text>
                <Text>
                  {log?.message}
                </Text>
              </Group>
            </Stack>
          </Paper>
        ))}
      </Stack>

      <Stack
        w={'100%'}
        bg={'white'}
        pos={'fixed'}
        bottom={0}
        right={0}
        align={'end'}
        p={15}
        sx={{ zIndex: 100 }}
      >
        <Group>
          <Button
            variant={'outline'}
            size={'sm'}
            color={'var(--mantine-color-gray-8)'}
            leftSection={<IconX size={18} />}
            onClick={close}
          >
            Close
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default LogModalClient;
