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
import { IconX } from '@tabler/icons-react';
import useSWR, { useSWRConfig } from 'swr';
import API from '@/libs/API';
import { API_REFRESH_INTERVAL } from '@/config/intervals';
import { LoadingOverlay } from '@mantine/core';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const LogCard = ({ fullname, message, logType, loggedAt }: LogCardProps) => {
  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder>
      <Group justify='space-between' mt='md' mb='xs'>
        <Text fw={500}>{fullname ?? '-'}</Text>
        <Badge
          color={
            logType === 'error'
              ? 'var(--mantine-color-red-7)'
              : 'var(--mantine-color-primary-9)'
          }
        >
          {logType}
        </Badge>
      </Group>

      <Text size='sm'>{message}</Text>

      <Text size='sm' c='dimmed' pt={'sm'}>
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
  const [logId] = useState(id ?? '');
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [paginated] = useState(true);

  const { mutate } = useSWRConfig();
  const { data, isLoading } = useSWR<SystemLogResponse>(
    [endpoint ?? null, logId, page, perPage, paginated],
    ([url, logId, page, perPage, paginated]: GeneralResponse) =>
      API.get(url, {
        page,
        log_id: logId,
        per_page: perPage,
        paginated,
      }),
    {
      refreshInterval: API_REFRESH_INTERVAL,
      keepPreviousData: false,
      revalidateOnFocus: true,
    }
  );

  useEffect(() => {
    if (!opened || !endpoint) return;

    mutate(endpoint);
  }, [opened, endpoint]);

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
