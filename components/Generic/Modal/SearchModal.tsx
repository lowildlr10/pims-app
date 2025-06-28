import React, { useEffect } from 'react';
import { ActionIcon, Button, Modal, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconSearch, IconX } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';

const SearchModalClient = ({
  search,
  opened,
  close,
  setSearch,
}: SearchModalProps) => {
  const lgScreenAndBelow = useMediaQuery('(max-width: 1366px)');
  const form = useForm({
    mode: 'controlled',
    initialValues: {
      search,
    },
  });

  useEffect(() => {
    form.setFieldValue('search', search);
  }, [search]);

  const handleClearSearch = () => {
    if (!setSearch) return;

    setSearch('');
    form.reset();
    close();
  };

  return (
    <Modal
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      size={lgScreenAndBelow ? 'xs' : 'sm'}
      opened={opened}
      onClose={close}
      title='Search'
    >
      {opened && (
        <form
          onSubmit={form.onSubmit(() => {
            if (setSearch) setSearch(form.values.search);
            close();
          })}
        >
          <TextInput
            data-autofocus
            placeholder='Keyword...'
            description={'Enter a keyword and press Enter to begin the search.'}
            m={0}
            mb={'lg'}
            leftSection={<IconSearch size={14} />}
            rightSection={
              <ActionIcon
                variant={'light'}
                size={lgScreenAndBelow ? 'xs' : 'sm'}
                radius='sm'
                color={'var(--mantine-color-tertiary-9)'}
                onClick={handleClearSearch}
              >
                <IconX size={14} stroke={3} />
              </ActionIcon>
            }
            value={form.values.search ?? search}
            onChange={(event) =>
              form.setFieldValue('search', event.currentTarget.value)
            }
          />
          <Button
            color={'var(--mantine-color-primary-9)'}
            type={'submit'}
            mb={'sm'}
            size={lgScreenAndBelow ? 'xs' : 'sm'}
            fullWidth
          >
            Search
          </Button>
          <Button
            size={lgScreenAndBelow ? 'xs' : 'sm'}
            variant={'outline'}
            color={'var(--mantine-color-gray-7)'}
            onClick={handleClearSearch}
            fullWidth
          >
            Clear
          </Button>
        </form>
      )}
    </Modal>
  );
};

export default SearchModalClient;
