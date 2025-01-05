import { Modal } from '@mantine/core';
import React from 'react';
import SectionContentClient from './CreateUpdateContent/SectionContent';
import DepartmentContentClient from './CreateUpdateContent/DepartmentContent';

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
      centered
    >
      {content === 'account-department' && (
        <DepartmentContentClient
          endpoint={endpoint}
          data={data}
          type={'create'}
          close={close}
          updateTable={updateTable}
        />
      )}

      {content === 'account-section' && (
        <SectionContentClient
          endpoint={endpoint}
          data={data}
          type={'create'}
          close={close}
          updateTable={updateTable}
        />
      )}
    </Modal>
  );
};

export default CreateModalClient;
