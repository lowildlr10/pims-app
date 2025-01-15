import {
  Button,
  Group,
  LoadingOverlay,
  Modal,
  ScrollArea,
  Stack,
} from '@mantine/core';
import React, { useState } from 'react';
import SectionContentClient from './CreateUpdateContent/SectionContent';
import DepartmentContentClient from './CreateUpdateContent/DepartmentContent';
import API from '@/libs/API';
import { notify } from '@/libs/Notification';
import { getErrors } from '@/libs/Errors';
import RoleContentClient from './CreateUpdateContent/RoleContent';
import { IconCancel, IconPencilPlus } from '@tabler/icons-react';
import UserContentClient from './CreateUpdateContent/UserContent';
import FundingSourceContentClient from './CreateUpdateContent/FundingSourceContent';
import ItemClassificationContentClient from './CreateUpdateContent/ItemClassificationContent';
import MfoPapContentClient from './CreateUpdateContent/MfoPapContent';
import ProcurementModeContentClient from './CreateUpdateContent/ProcurementModeContent';
import PaperSizeContentClient from './CreateUpdateContent/PaperSizeContent';
import SupplierContentClient from './CreateUpdateContent/SupplierContent';
import UacsCodeClassificationContentClient from './CreateUpdateContent/UacsCodeClassificationContent';
import UacsCodeContentClient from './CreateUpdateContent/UacsCodeContent';
import UnitIssueContentClient from './CreateUpdateContent/UnitIssueContent';

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

      <ScrollArea
        h={{
          md: '100%',
          lg: fullscreen ? 'calc(100vh - 7.8em)' : 'calc(100vh - 18em)',
        }}
        sx={{ borderRadius: 5 }}
        mb={'lg'}
      >
        {content === 'account-department' && (
          <DepartmentContentClient
            data={data}
            handleCreateUpdate={handleCreate}
            setPayload={setPayload}
          />
        )}

        {content === 'account-section' && (
          <SectionContentClient
            data={data}
            handleCreateUpdate={handleCreate}
            setPayload={setPayload}
          />
        )}

        {content === 'account-role' && (
          <RoleContentClient
            data={data}
            handleCreateUpdate={handleCreate}
            setPayload={setPayload}
          />
        )}

        {content === 'account-user' && (
          <UserContentClient
            data={data}
            handleCreateUpdate={handleCreate}
            setPayload={setPayload}
          />
        )}

        {content === 'lib-fund-source' && (
          <FundingSourceContentClient
            data={data}
            handleCreateUpdate={handleCreate}
            setPayload={setPayload}
          />
        )}

        {content === 'lib-item-class' && (
          <ItemClassificationContentClient
            data={data}
            handleCreateUpdate={handleCreate}
            setPayload={setPayload}
          />
        )}

        {content === 'lib-mfo-pap' && (
          <MfoPapContentClient
            data={data}
            handleCreateUpdate={handleCreate}
            setPayload={setPayload}
          />
        )}

        {content === 'lib-mode-proc' && (
          <ProcurementModeContentClient
            data={data}
            handleCreateUpdate={handleCreate}
            setPayload={setPayload}
          />
        )}

        {content === 'lib-paper-size' && (
          <PaperSizeContentClient
            data={data}
            handleCreateUpdate={handleCreate}
            setPayload={setPayload}
          />
        )}

        {content === 'lib-supplier' && (
          <SupplierContentClient
            data={data}
            handleCreateUpdate={handleCreate}
            setPayload={setPayload}
          />
        )}

        {content === 'lib-uacs-classification' && (
          <UacsCodeClassificationContentClient
            data={data}
            handleCreateUpdate={handleCreate}
            setPayload={setPayload}
          />
        )}

        {content === 'lib-uacs-code' && (
          <UacsCodeContentClient
            data={data}
            handleCreateUpdate={handleCreate}
            setPayload={setPayload}
          />
        )}

        {content === 'lib-unit-issue' && (
          <UnitIssueContentClient
            data={data}
            handleCreateUpdate={handleCreate}
            setPayload={setPayload}
          />
        )}
      </ScrollArea>

      <Stack align={'end'}>
        <Group>
          <Button
            onClick={handleCreate}
            type={'submit'}
            color={'var(--mantine-color-primary-9)'}
            size={'sm'}
            leftSection={<IconPencilPlus size={18} />}
          >
            Create
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

export default CreateModalClient;
