import { LoadingOverlay, Modal, ScrollArea } from '@mantine/core';
import React, { useState } from 'react';
import SectionContentClient from './CreateUpdateContent/SectionContent';
import DepartmentContentClient from './CreateUpdateContent/DepartmentContent';
import API from '@/libs/API';
import { notify } from '@/libs/Notification';
import { getErrors } from '@/libs/Errors';
import RoleContentClient from './CreateUpdateContent/RoleContent';

const CreateModalClient = ({
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

  const handleCreate = () => {
    setLoading(true);

    if (!payload) {
      setLoading(false);
      return;
    }

    API.post(endpoint, payload)
      .then((res) => {
        notify({
          title: 'Success!',
          message: res?.data?.message,
          color: 'green',
        });

        if (updateTable) updateTable(null, payload);        

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
      title={title ?? 'Create'}
      size={'md'}
      fullScreen={fullscreen}
      scrollAreaComponent={ScrollArea.Autosize}
      centered
    >
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />

      {content === 'account-department' && (
        <DepartmentContentClient
          data={data}
          type={'create'}
          close={close}
          handleCreateUpdate={handleCreate}
          setPayload={setPayload}
        />
      )}

      {content === 'account-section' && (
        <SectionContentClient
          data={data}
          type={'create'}
          close={close}
          handleCreateUpdate={handleCreate}
          setPayload={setPayload}
        />
      )}

      {content === 'account-role' && (
        <RoleContentClient
          data={data}
          type={'create'}
          close={close}
          handleCreateUpdate={handleCreate}
          setPayload={setPayload}
        />
      )}
    </Modal>
  );
};

export default CreateModalClient;
