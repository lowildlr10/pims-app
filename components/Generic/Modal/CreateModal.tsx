import {
  Button,
  Group,
  LoadingOverlay,
  Modal,
  ScrollArea,
  Stack,
} from '@mantine/core';
import React, { useRef, useState } from 'react';
import SectionContentClient from './CreateUpdateContent/SectionContent';
import DivisionContentClient from './CreateUpdateContent/DivisionContent';
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
import SignatoryContentClient from './CreateUpdateContent/SignatoryContent';
import BidsAwardsCommitteeContentClient from './CreateUpdateContent/BidsAwardsCommitteeContent';
import ResponsibilityCenterContentClient from './CreateUpdateContent/ResponsibilityCenterContent';
import PurchaseRequestContentClient from './CreateUpdateContent/PurchaseRequestContent';

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
  const formRef = useRef<HTMLFormElement>(null);

  const handleCreate = (uncontrolledPayload?: object) => {
    let isControlled = true;

    setLoading(true);

    if (!uncontrolledPayload) {
      setLoading(false);
      return;
    } else {
      isControlled = false;
    }

    if (!payload && isControlled) {
      setLoading(false);
      return;
    }

    API.post(endpoint, uncontrolledPayload ?? payload)
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

      <Stack mb={50}>
        {content === 'account-division' && (
          <DivisionContentClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleCreate}
            setPayload={setPayload}
          />
        )}

        {content === 'account-section' && (
          <SectionContentClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleCreate}
            setPayload={setPayload}
          />
        )}

        {content === 'account-role' && (
          <RoleContentClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleCreate}
            setPayload={setPayload}
          />
        )}

        {content === 'account-user' && (
          <UserContentClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleCreate}
            setPayload={setPayload}
          />
        )}

        {content === 'lib-bid-committee' && (
          <BidsAwardsCommitteeContentClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleCreate}
            setPayload={setPayload}
          />
        )}

        {content === 'lib-fund-source' && (
          <FundingSourceContentClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleCreate}
            setPayload={setPayload}
          />
        )}

        {content === 'lib-item-class' && (
          <ItemClassificationContentClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleCreate}
            setPayload={setPayload}
          />
        )}

        {content === 'lib-mfo-pap' && (
          <MfoPapContentClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleCreate}
            setPayload={setPayload}
          />
        )}

        {content === 'lib-mode-proc' && (
          <ProcurementModeContentClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleCreate}
            setPayload={setPayload}
          />
        )}

        {content === 'lib-paper-size' && (
          <PaperSizeContentClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleCreate}
            setPayload={setPayload}
          />
        )}

        {content === 'lib-responsibility-center' && (
          <ResponsibilityCenterContentClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleCreate}
            setPayload={setPayload}
          />
        )}

        {content === 'lib-supplier' && (
          <SupplierContentClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleCreate}
            setPayload={setPayload}
          />
        )}

        {content === 'lib-signatory' && (
          <SignatoryContentClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleCreate}
            setPayload={setPayload}
          />
        )}

        {content === 'lib-uacs-class' && (
          <UacsCodeClassificationContentClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleCreate}
            setPayload={setPayload}
          />
        )}

        {content === 'lib-uacs-code' && (
          <UacsCodeContentClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleCreate}
            setPayload={setPayload}
          />
        )}

        {content === 'lib-unit-issue' && (
          <UnitIssueContentClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleCreate}
            setPayload={setPayload}
          />
        )}

        {content === 'pr' && (
          <PurchaseRequestContentClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleCreate}
          />
        )}
      </Stack>

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
            onClick={() =>
              formRef?.current ? formRef?.current.requestSubmit() : undefined
            }
            type={'button'}
            color={'var(--mantine-color-primary-9)'}
            size={'sm'}
            leftSection={<IconPencilPlus size={18} />}
            loading={loading}
            loaderProps={{ type: 'dots' }}
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
