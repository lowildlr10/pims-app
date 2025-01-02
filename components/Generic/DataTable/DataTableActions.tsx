'use client';

import React from 'react';
import {
  ActionIcon,
  Button,
  Group,
  Modal,
  Paper,
  TextInput,
} from '@mantine/core';
import { IconPencil, IconSearch, IconX } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';

const DataTableActionsClient = ({
  search,
  showSearch,
  setSearch,
}: DataTableActionsProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const form = useForm({
    mode: 'controlled',
    initialValues: {
      search: search ?? '',
    },
  });

  const handleClearSearch = () => {
    if (!setSearch) return;

    setSearch('');
    form.reset();
    close();
  };

  return (
    <Paper p={'sm'}>
      <Group justify={'space-between'}>
        <Button
          size={'xs'}
          radius='sm'
          color={'var(--mantine-color-primary-9)'}
          leftSection={<IconPencil size={14} />}
        >
          Create
        </Button>

        {showSearch && (
          <>
            {search ? (
              <Button
                variant={'outline'}
                radius={'xl'}
                color={'var(--mantine-color-primary-9)'}
                size={'xs'}
                leftSection={<IconSearch size={14} stroke={3} />}
                onClick={open}
              >
                &quot;{search}&quot;
              </Button>
            ) : (
              <ActionIcon
                variant={'outline'}
                size='md'
                radius='xl'
                color={'var(--mantine-color-primary-9)'}
                onClick={open}
              >
                <IconSearch size={14} stroke={3} />
              </ActionIcon>
            )}
          </>
        )}
      </Group>

      {showSearch && (
        <Modal
          overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3,
          }}
          size={'sm'}
          opened={opened}
          onClose={close}
          title='Search'
        >
          <form
            onSubmit={form.onSubmit(() => {
              if (setSearch) setSearch(form.values.search);
              close();
            })}
          >
            <TextInput
              data-autofocus
              placeholder='Keyword...'
              description={
                'Enter a search tag and press Enter to begin the search.'
              }
              m={0}
              mb={'lg'}
              leftSection={<IconSearch size={14} />}
              rightSection={
                <ActionIcon
                  variant={'light'}
                  size='sm'
                  radius='sm'
                  color={'var(--mantine-color-tertiary-9)'}
                  onClick={handleClearSearch}
                >
                  <IconX size={14} stroke={3} />
                </ActionIcon>
              }
              value={form.values.search}
              onChange={(event) =>
                form.setFieldValue('search', event.currentTarget.value)
              }
            />
            <Button
              color={'var(--mantine-color-primary-9)'}
              type={'submit'}
              mb={'sm'}
              size={'sm'}
              fullWidth
            >
              Search
            </Button>
            <Button
              size={'sm'}
              variant={'outline'}
              color={'var(--mantine-color-tertiary-9)'}
              onClick={handleClearSearch}
              fullWidth
            >
              Clear
            </Button>
          </form>
        </Modal>
      )}
    </Paper>
  );
};

export default DataTableActionsClient;
