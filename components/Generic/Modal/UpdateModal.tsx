import { Button, Group, LoadingOverlay, Modal, ScrollArea, Stack } from '@mantine/core';
import React, { useState } from 'react';
import DepartmentContentClient from './CreateUpdateContent/DepartmentContent';
import SectionContentClient from './CreateUpdateContent/SectionContent';
import API from '@/libs/API';
import { notify } from '@/libs/Notification';
import { getErrors } from '@/libs/Errors';
import RoleContentClient from './CreateUpdateContent/RoleContent';
import { IconCancel, IconPencil } from '@tabler/icons-react';

const UpdateModalClient = ({
  title,
  endpoint,
  data,
  opened,
  fullscreen,
  content,
  close,
  updateTable,
}: CreateModalProps) => {
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState<object>();

  const handleUpdate = () => {
    setLoading(true);

    if (!payload) {
      setLoading(false);
      return;
    }

    API.put(endpoint,  payload)
      .then((res) => {
        notify({
          title: 'Success!',
          message: res?.data?.message,
          color: 'green',
        });

        if (updateTable) updateTable(data?.id ?? null, payload);        

        setPayload({});
        setLoading(false);
        close();
      })
      .catch((err) => {
        const errors = getErrors(err);

        errors.forEach((error) => {
          notify({
            title: 'Failed',
            message: error,
            color: 'red',
          });
        });

        setLoading(false);
      });
  };
  
  return (
    <Modal
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      opened={opened}
      onClose={close}
      title={title ?? 'Update'}
      fullScreen={fullscreen}
      size={'md'}
      scrollAreaComponent={ScrollArea.Autosize}
      centered
    >
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />

      <ScrollArea
        h={{ md: '100%', lg: fullscreen ? 'calc(100vh - 7.8em)' : 'calc(100vh - 18.5em)' }}
        sx={{ borderRadius: 5 }}
        mb={'sm'}
      >
        {content === 'account-department' && (
          <DepartmentContentClient
            data={data}
            handleCreateUpdate={handleUpdate}
            setPayload={setPayload}
          />
        )}

        {content === 'account-section' && (
          <SectionContentClient
            data={data}
            handleCreateUpdate={handleUpdate}
            setPayload={setPayload}
          />
        )}

        {content === 'account-role' && (
          <RoleContentClient
            data={data}
            handleCreateUpdate={handleUpdate}
            setPayload={setPayload}
          />
        )}
      </ScrollArea>

      <Stack align={'end'}>
        <Group>
          <Button
            onClick={handleUpdate}
            type={'submit'}
            color={'var(--mantine-color-primary-9)'}
            size={'sm'}
            leftSection={
              <IconPencil size={18} />
            }
          >
            Update
          </Button>
          <Button
            variant={'outline'}
            size={'sm'}
            color={'var(--mantine-color-gray-8)'}
            leftSection={<IconCancel size={18} />}
            onClick={close}
          >
            Cancel
          </Button>
        </Group>
      </Stack> 
    </Modal>
  );
};

export default UpdateModalClient;
