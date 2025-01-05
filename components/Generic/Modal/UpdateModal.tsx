import { Modal } from '@mantine/core';
import React from 'react';
import DepartmentContentClient from './CreateUpdateContent/DepartmentContent';
import SectionContentClient from './CreateUpdateContent/SectionContent';

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
      centered
    >
      {content === 'account-department' && (
        <DepartmentContentClient
          endpoint={endpoint}
          data={data}
          type={'update'}
          close={close}
          updateTable={updateTable}
        />
      )}

      {content === 'account-section' && (
        <SectionContentClient
          endpoint={endpoint}
          data={data}
          type={'update'}
          close={close}
          updateTable={updateTable}
        />
      )}
    </Modal>
  );
};

export default UpdateModalClient;
