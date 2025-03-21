import {
  Badge,
  Button,
  Card,
  Group,
  Modal,
  Pagination,
  ScrollArea,
  Stack,
  Text,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { IconRefresh, IconX } from '@tabler/icons-react';
import useSWR from 'swr';
import API from '@/libs/API';
import { API_REFRESH_INTERVAL } from '@/config/intervals';
import { LoadingOverlay } from '@mantine/core';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useMediaQuery } from '@mantine/hooks';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const LogCard = ({ fullname, message, logType, loggedAt }: LogCardProps) => {
  const lgScreenAndBelow = useMediaQuery('(max-width: 1366px)');

  return (
    <Card
      shadow='sm'
      padding={lgScreenAndBelow ? 'md' : 'lg'}
      radius='md'
      withBorder
    >
      <Group justify='space-between' mt='md' mb='xs'>
        <Text size={lgScreenAndBelow ? 'sm' : 'md'} fw={500}>
          {fullname ?? '-'}
        </Text>
        <Badge
          size={lgScreenAndBelow ? 'sm' : 'md'}
          color={
            logType === 'error'
              ? 'var(--mantine-color-red-7)'
              : 'var(--mantine-color-primary-9)'
          }
        >
          {logType}
        </Badge>
      </Group>

      <Text size={lgScreenAndBelow ? 'xs' : 'sm'}>{message}</Text>

      <Text
        size={lgScreenAndBelow ? 'xs' : 'sm'}
        c='dimmed'
        pt={lgScreenAndBelow ? 'xs' : 'sm'}
      >
        {loggedAt}
      </Text>
    </Card>
  );
};

const LogModalClient = ({
  id,
  title,
  endpoint,
  opened,
  close,
}: LogModalProps) => {
  const lgScreenAndBelow = useMediaQuery('(max-width: 1366px)');
  const [logId, setLogId] = useState(id ?? '');
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [paginated] = useState(true);

  const { data, isLoading, mutate } = useSWR<SystemLogResponse>(
    opened && logId
      ? [endpoint ?? null, logId, page, perPage, paginated]
      : null,
    ([url, logId, page, perPage, paginated]: GeneralResponse) =>
      API.get(url, {
        page,
        log_id: logId,
        per_page: perPage,
        paginated,
      }),
    {
      refreshInterval: API_REFRESH_INTERVAL,
      refreshWhenHidden: true,
      keepPreviousData: false,
      revalidateOnFocus: true,
      revalidateOnMount: true,
    }
  );

  useEffect(() => {
    if (!opened) return;

    mutate();
  }, [opened]);

  useEffect(() => {
    setLogId(id);
  }, [id]);

  return (
    <Modal
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      opened={opened}
      onClose={close}
      title={title ?? 'Document Logs'}
      size={'lg'}
      scrollAreaComponent={ScrollArea.Autosize}
      centered
    >
      <LoadingOverlay
        visible={isLoading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />

      {opened && (
        <Stack mb={60} p={'sm'}>
          <Button
            size={lgScreenAndBelow ? 'xs' : 'sm'}
            variant={'outline'}
            leftSection={<IconRefresh size={18} stroke={1.5} />}
            loaderProps={{ type: 'dots' }}
            loading={isLoading}
            onClick={() => opened && mutate()}
          >
            Refresh
          </Button>
          {data &&
            data?.data.map((log) => (
              <LogCard
                key={log.id}
                fullname={log.user?.fullname ?? '-'}
                message={log.message ?? '-'}
                logType={log.log_type ?? 'log'}
                loggedAt={
                  log.logged_at
                    ? dayjs
                        .duration(
                          dayjs(log.logged_at).diff(dayjs()),
                          'milliseconds'
                        )
                        .humanize(true)
                    : '-'
                }
              />
            ))}

          <Stack w={'100%'} my={'sm'} justify={'center'} align={'center'}>
            <Pagination
              size={'sm'}
              color={'var(--mantine-color-primary-9)'}
              total={data?.last_page ?? 0}
              value={page}
              onChange={setPage}
            />
          </Stack>
        </Stack>
      )}

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
            size={lgScreenAndBelow ? 'xs' : 'sm'}
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
