import {
  Button,
  Group,
  LoadingOverlay,
  Modal,
  ScrollArea,
  Stack,
} from '@mantine/core';
import React, { useRef, useState } from 'react';
import DivisionContentClient from '../../UserManagement/DivisionSection/DivisionForm';
import SectionContentClient from '../../UserManagement/DivisionSection/SectionForm';
import API from '@/libs/API';
import { notify } from '@/libs/Notification';
import { getErrors } from '@/libs/Errors';
import RoleContentClient from '../../UserManagement/Roles/Form';
import { IconCancel, IconPencil } from '@tabler/icons-react';
import UserContentClient from '../../UserManagement/Users/Form';
import FundingSourceContentClient from '../../Libraries/FundingSources/Form';
import ItemClassificationContentClient from '../../Libraries/ItemClassifications/Form';
import MfoPapContentClient from '../../Libraries/MfoPaps/Form';
import ProcurementModeContentClient from '../../Libraries/ProcurementModes/Form';
import PaperSizeContentClient from '../../Libraries/PaperSizes/Form';
import SupplierContentClient from '../../Libraries/Suppliers/Form';
import UacsCodeClassificationContentClient from '../../Libraries/UacsClassifications/Form';
import UacsCodeContentClient from '../../Libraries/UacsCodes/Form';
import UnitIssueContentClient from '../../Libraries/UnitIssues/Form';
import SignatoryContentClient from '../../Libraries/Signatories/Form';
import BidsAwardsCommitteeContentClient from '../../Libraries/BidsAwardsCommittees/Form';
import ResponsibilityCenterContentClient from '../../Libraries/ResposibilityCenters/Form';
import PurchaseRequestContentClient from '../../PurchaseRequests/Form';
import { useMediaQuery } from '@mantine/hooks';
import RequestQuotionContentClient from '../../RequestQuotations/Form';
import AbstractQuotionContentClient from '../../AbstractQuotations/Form';
import PurchaseOrderContentClient from '@/components/PurchaseOrders/Form';

const UpdateModalClient = ({
  title,
  endpoint,
  data,
  opened,
  fullscreen,
  content,
  close,
  updateTable,
  stack,
}: CreateModalProps) => {
  const lgScreenAndBelow = useMediaQuery('(max-width: 1366px)');
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState<object>();
  const formRef = useRef<HTMLFormElement>(null);

  const handleUpdate = (uncontrolledPayload?: object) => {
    let isControlled = true;

    setLoading(true);

    if (!uncontrolledPayload) {
      isControlled = true;
    } else {
      isControlled = false;
    }

    if (!payload && isControlled) {
      setLoading(false);
      return;
    }

    if (!uncontrolledPayload && !isControlled) {
      setLoading(false);
      return;
    }

    API.put(endpoint, uncontrolledPayload ?? payload)
      .then((res) => {
        notify({
          title: 'Success!',
          message: res?.data?.message,
          color: 'green',
        });

        if (updateTable) updateTable(data?.id ?? null);

        setPayload({});
        setLoading(false);

        if (stack) {
          stack.close('update-modal');
          stack.open('detail-modal');
        } else {
          close();
        }
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

      <Stack mb={50}>
        {opened && content === 'account-division' && (
          <DivisionContentClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleUpdate}
            setPayload={setPayload}
          />
        )}

        {opened && content === 'account-section' && (
          <SectionContentClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleUpdate}
            setPayload={setPayload}
          />
        )}

        {opened && content === 'account-role' && (
          <RoleContentClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleUpdate}
            setPayload={setPayload}
          />
        )}

        {opened && content === 'account-user' && (
          <UserContentClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleUpdate}
            setPayload={setPayload}
          />
        )}

        {opened && content === 'lib-bid-committee' && (
          <BidsAwardsCommitteeContentClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleUpdate}
            setPayload={setPayload}
          />
        )}

        {opened && content === 'lib-fund-source' && (
          <FundingSourceContentClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleUpdate}
            setPayload={setPayload}
          />
        )}

        {opened && content === 'lib-item-class' && (
          <ItemClassificationContentClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleUpdate}
            setPayload={setPayload}
          />
        )}

        {opened && content === 'lib-mfo-pap' && (
          <MfoPapContentClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleUpdate}
            setPayload={setPayload}
          />
        )}

        {opened && content === 'lib-mode-proc' && (
          <ProcurementModeContentClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleUpdate}
            setPayload={setPayload}
          />
        )}

        {opened && content === 'lib-paper-size' && (
          <PaperSizeContentClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleUpdate}
            setPayload={setPayload}
          />
        )}

        {opened && content === 'lib-responsibility-center' && (
          <ResponsibilityCenterContentClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleUpdate}
            setPayload={setPayload}
          />
        )}

        {opened && content === 'lib-supplier' && (
          <SupplierContentClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleUpdate}
            setPayload={setPayload}
          />
        )}

        {opened && content === 'lib-signatory' && (
          <SignatoryContentClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleUpdate}
            setPayload={setPayload}
          />
        )}

        {opened && content === 'lib-uacs-class' && (
          <UacsCodeClassificationContentClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleUpdate}
            setPayload={setPayload}
          />
        )}

        {opened && content === 'lib-uacs-code' && (
          <UacsCodeContentClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleUpdate}
            setPayload={setPayload}
          />
        )}

        {opened && content === 'lib-unit-issue' && (
          <UnitIssueContentClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleUpdate}
            setPayload={setPayload}
          />
        )}

        {opened && content === 'pr' && (
          <PurchaseRequestContentClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleUpdate}
          />
        )}

        {opened && content === 'rfq' && (
          <RequestQuotionContentClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleUpdate}
          />
        )}

        {opened && content === 'aoq' && (
          <AbstractQuotionContentClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleUpdate}
          />
        )}

        {opened && content === 'po' && (
          <PurchaseOrderContentClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleUpdate}
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
        sx={{ zIndex: 1001 }}
      >
        <Group>
          <Button
            onClick={() =>
              formRef?.current ? formRef?.current.requestSubmit() : undefined
            }
            type={'button'}
            color={'var(--mantine-color-primary-9)'}
            size={lgScreenAndBelow ? 'xs' : 'sm'}
            leftSection={<IconPencil size={18} />}
            loading={loading}
            loaderProps={{ type: 'dots' }}
          >
            Update
          </Button>
          <Button
            variant={'outline'}
            size={lgScreenAndBelow ? 'xs' : 'sm'}
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
