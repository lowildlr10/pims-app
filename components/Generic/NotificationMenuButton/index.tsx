'use client';

import API from '@/libs/API';
import { getErrors } from '@/libs/Errors';
import { notify } from '@/libs/Notification';
import Helper from '@/utils/Helpers';
import {
  Anchor,
  Blockquote,
  Button,
  Group,
  Indicator,
  Menu,
  ScrollArea,
  Stack,
  Text,
  Transition,
  ActionIcon,
  Box,
  UnstyledButton,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  IconBellFilled,
  IconCalendarWeek,
  IconCircleDashedCheck,
  IconX,
} from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import useSWRInfinite from 'swr/infinite';

const PAGE_SIZE = 5;

const fetcher = (url: string) => API.get(url);

const getKey = (pageIndex: number, previousPageData: any) => {
  if (previousPageData && previousPageData.data.length === 0) return null;
  return `/notifications?page=${pageIndex + 1}&limit=${PAGE_SIZE}`;
};

const NotificationMenuButtonClient = () => {
  const { push, refresh } = useRouter();
  const lgScreenAndBelow = useMediaQuery('(max-width: 900px)');
  const [opened, setOpened] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  const { data, size, setSize, isLoading, isValidating, mutate } =
    useSWRInfinite(getKey, fetcher);

  const [notifications, setNotifications] = useState(
    data ? data.flatMap((page) => page.data) : []
  );
  const [hasMore, setHasMore] = useState(
    data?.[data.length - 1]?.data.length === PAGE_SIZE
  );

  useEffect(() => {
    setNotifications(data ? data.flatMap((page) => page.data) : []);
    setHasMore(data?.[data.length - 1]?.data.length === PAGE_SIZE);
  }, [data]);

  useEffect(() => {
    if (opened && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }

    if (opened) {
      mutate();
    }
  }, [opened]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el || !hasMore || isLoading || isValidating) return;

    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      setSize((prev) => prev + 1);
    }
  };

  const handleReadNotification = (id: string, href: string) => {
    API.put(`/notifications/${id}/read`)
      .then((res) => {
        push(href);
        refresh();
        mutate();
      })
      .catch((err) => {
        const errors = getErrors(err);

        errors.forEach((error) => {
          notify({
            title: 'Failed!',
            message: error,
            color: 'red',
          });
        });
      });
  };

  const handleReadAllNotifications = () => {
    API.put(`/notifications/read/all`)
      .then((res) => {
        mutate();
      })
      .catch((err) => {
        const errors = getErrors(err);

        errors.forEach((error) => {
          notify({
            title: 'Failed!',
            message: error,
            color: 'red',
          });
        });
      });
  };

  const handleDeleteAllNotifications = () => {
    API.put(`/notifications/delete/all`)
      .then((res) => {
        mutate();
      })
      .catch((err) => {
        const errors = getErrors(err);

        errors.forEach((error) => {
          notify({
            title: 'Failed!',
            message: error,
            color: 'red',
          });
        });
      });
  };

  return (
    <Menu
      shadow='md'
      width={lgScreenAndBelow ? '100%' : 400}
      opened={opened}
      onChange={setOpened}
    >
      <Menu.Target>
        <Box mx='sm'>
          <Indicator
            inline
            size={lgScreenAndBelow ? 4 : 7}
            offset={7}
            position='bottom-end'
            color='var(--mantine-color-red-7)'
            disabled={
              notifications.filter((notif) => Helper.empty(notif?.read_at))
                .length === 0
            }
            processing
          >
            <ActionIcon
              variant='transparent'
              color='white'
              size={lgScreenAndBelow ? 'md' : 'lg'}
              pt={'xs'}
              px={0}
            >
              <IconBellFilled size={lgScreenAndBelow ? 17 : 20} stroke={1.5} />
            </ActionIcon>
          </Indicator>
        </Box>
      </Menu.Target>

      <Menu.Dropdown left={lgScreenAndBelow ? 0 : undefined}>
        <Menu.Label
          fz={lgScreenAndBelow ? 'xs' : 'sm'}
          py={lgScreenAndBelow ? 'xs' : 'sm'}
        >
          <Group justify='space-between'>
            Notifications
            <ActionIcon
              color='var(--mantine-color-gray-7)'
              size={lgScreenAndBelow ? 'xs' : 'sm'}
              variant='subtle'
              onClick={() => setOpened(false)}
            >
              <IconX size={lgScreenAndBelow ? 13 : 15} />
            </ActionIcon>
          </Group>
        </Menu.Label>

        <Menu.Item
          component={ScrollArea}
          h={lgScreenAndBelow ? 'calc(100vh - 10em)' : 400}
          p='5px'
          m={0}
          bg='var(--mantine-color-gray-0)'
          closeMenuOnClick={false}
          sx={{ cursor: 'default' }}
          viewportRef={scrollRef}
          onScrollPositionChange={handleScroll}
        >
          <Stack gap={3} w={'100%'} align={'center'}>
            {notifications.length === 0 && (
              <Stack w={'100%'} align={'center'} my={'md'}>
                <IconCircleDashedCheck
                  size={40}
                  color={'var(--mantine-color-gray-7)'}
                />
                <Text ta={'center'} fw={500} c={'var(--mantine-color-gray-7)'}>
                  You&apos;re All Caught Up
                </Text>
              </Stack>
            )}

            {notifications.length > 0 &&
              notifications.map((notif: any, index: number) => (
                <UnstyledButton
                  key={notif.message ?? index}
                  style={{ textDecoration: 'none' }}
                  onClick={() =>
                    handleReadNotification(notif.id, notif?.data?.href ?? '#')
                  }
                >
                  <Blockquote
                    color={
                      notif?.read_at
                        ? 'var(--mantine-color-gray-1)'
                        : 'var(--mantine-color-primary-9)'
                    }
                    c='var(--mantine-color-dark-7)'
                    bg='white'
                    radius='x2'
                    p='md'
                    h='8.7em'
                    cite={
                      <Group align='center' gap={4}>
                        <IconCalendarWeek size={lgScreenAndBelow ? 13 : 15} />
                        <Text fz={lgScreenAndBelow ? 11 : 12} pt={1}>
                          {notif.created_at
                            ? dayjs(notif.created_at).isSame(dayjs(), 'day')
                              ? `Today at ${dayjs(notif.created_at).format('h:mm A')}`
                              : dayjs(notif.created_at).isSame(
                                    dayjs().subtract(1, 'day'),
                                    'day'
                                  )
                                ? `Yesterday at ${dayjs(notif.created_at).format('h:mm A')}`
                                : dayjs(notif.created_at).format(
                                    'MMM D, YYYY [at] h:mm A'
                                  )
                            : 'Unknown time'}
                        </Text>
                      </Group>
                    }
                    m={0}
                    mt={1}
                  >
                    <Stack gap={'xs'}>
                      <Text fw={500} size={lgScreenAndBelow ? 'xs' : 'sm'}>
                        {notif?.data?.title}
                      </Text>
                      <Text
                        size={lgScreenAndBelow ? 'xs' : 'sm'}
                        sx={{
                          display: '-webkit-box',
                          WebkitBoxOrient: 'vertical',
                          WebkitLineClamp: 2,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                        dangerouslySetInnerHTML={{
                          __html: notif?.data?.message,
                        }}
                      />
                    </Stack>
                  </Blockquote>
                </UnstyledButton>
              ))}

            <Transition
              mounted={isLoading || isValidating}
              transition='scale-y'
              duration={300}
              timingFunction='ease'
            >
              {(styles) => (
                <Button
                  color={'var(--mantine-color-primary-9)'}
                  variant='transparent'
                  size={lgScreenAndBelow ? 'xs' : 'sm'}
                  loaderProps={{ type: 'bars' }}
                  loading
                  style={{ ...styles, justifyContent: 'center' }}
                >
                  Loading...
                </Button>
              )}
            </Transition>
          </Stack>
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item
          fz={lgScreenAndBelow ? 'xs' : 'sm'}
          ta='center'
          closeMenuOnClick={false}
          onClick={() => handleReadAllNotifications()}
        >
          Mark All as Read
        </Menu.Item>

        <Menu.Item
          fz={lgScreenAndBelow ? 'xs' : 'sm'}
          ta='center'
          color='red'
          closeMenuOnClick={false}
          onClick={() => handleDeleteAllNotifications()}
        >
          Delete All Notifications
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default NotificationMenuButtonClient;
