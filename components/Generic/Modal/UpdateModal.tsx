import {
  Button,
  Group,
  LoadingOverlay,
  Modal,
  ScrollArea,
  Stack,
} from '@mantine/core';
import React, { useRef, useState } from 'react';
import API from '@/libs/API';
import { notify } from '@/libs/Notification';
import { getErrors } from '@/libs/Errors';
import DivisionFormClient from '../../UserManagement/DivisionSection/DivisionForm';
import SectionFormClient from '../../UserManagement/DivisionSection/SectionForm';
import RoleFormClient from '../../UserManagement/Roles/Form';
import { IconCancel, IconPencil } from '@tabler/icons-react';
import UserFormClient from '../../UserManagement/Users/Form';
import FundingSourceFormClient from '../../Libraries/FundingSources/Form';
import ItemClassificationFormClient from '../../Libraries/ItemClassifications/Form';
import MfoPapFormClient from '../../Libraries/MfoPaps/Form';
import ProcurementModeFormClient from '../../Libraries/ProcurementModes/Form';
import PaperSizeFormClient from '../../Libraries/PaperSizes/Form';
import SupplierFormClient from '../../Libraries/Suppliers/Form';
import UacsCodeClassificationFormClient from '../../Libraries/UacsClassifications/Form';
import UacsCodeFormClient from '../../Libraries/UacsCodes/Form';
import UnitIssueFormClient from '../../Libraries/UnitIssues/Form';
import SignatoryFormClient from '../../Libraries/Signatories/Form';
import BidsAwardsCommitteeFormClient from '../../Libraries/BidsAwardsCommittees/Form';
import ResponsibilityCenterFormClient from '../../Libraries/ResposibilityCenters/Form';
import PurchaseRequestFormClient from '../../PurchaseRequests/Form';
import { useMediaQuery } from '@mantine/hooks';
import RequestQuotionFormClient from '../../RequestQuotations/Form';
import AbstractQuotionFormClient from '../../AbstractQuotations/Form';
import PurchaseOrderFormClient from '@/components/PurchaseOrders/Form';
import InspectionAcceptanceReportFormClient from '@/components/InspectionAcceptanceReports/Form';
import InventorySupplyFormClient from '@/components/InventorySupplies/Form';
import RisFormClient from '../../InventoryIssuances/Forms/RisForm';
import IcsFormClient from '../../InventoryIssuances/Forms/IcsForm';
import AreFormClient from '../../InventoryIssuances/Forms/AreForm';

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

        // if (stack) {
        //   stack.close('update-modal');
        //   stack.open('detail-modal');
        // } else {
        //   close();
        // }
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
          <DivisionFormClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleUpdate}
            setPayload={setPayload}
          />
        )}

        {opened && content === 'account-section' && (
          <SectionFormClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleUpdate}
            setPayload={setPayload}
          />
        )}

        {opened && content === 'account-role' && (
          <RoleFormClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleUpdate}
            setPayload={setPayload}
          />
        )}

        {opened && content === 'account-user' && (
          <UserFormClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleUpdate}
            setPayload={setPayload}
          />
        )}

        {opened && content === 'lib-bid-committee' && (
          <BidsAwardsCommitteeFormClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleUpdate}
            setPayload={setPayload}
          />
        )}

        {opened && content === 'lib-fund-source' && (
          <FundingSourceFormClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleUpdate}
            setPayload={setPayload}
          />
        )}

        {opened && content === 'lib-item-class' && (
          <ItemClassificationFormClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleUpdate}
            setPayload={setPayload}
          />
        )}

        {opened && content === 'lib-mfo-pap' && (
          <MfoPapFormClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleUpdate}
            setPayload={setPayload}
          />
        )}

        {opened && content === 'lib-mode-proc' && (
          <ProcurementModeFormClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleUpdate}
            setPayload={setPayload}
          />
        )}

        {opened && content === 'lib-paper-size' && (
          <PaperSizeFormClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleUpdate}
            setPayload={setPayload}
          />
        )}

        {opened && content === 'lib-responsibility-center' && (
          <ResponsibilityCenterFormClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleUpdate}
            setPayload={setPayload}
          />
        )}

        {opened && content === 'lib-supplier' && (
          <SupplierFormClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleUpdate}
            setPayload={setPayload}
          />
        )}

        {opened && content === 'lib-signatory' && (
          <SignatoryFormClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleUpdate}
            setPayload={setPayload}
          />
        )}

        {opened && content === 'lib-uacs-class' && (
          <UacsCodeClassificationFormClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleUpdate}
            setPayload={setPayload}
          />
        )}

        {opened && content === 'lib-uacs-code' && (
          <UacsCodeFormClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleUpdate}
            setPayload={setPayload}
          />
        )}

        {opened && content === 'lib-unit-issue' && (
          <UnitIssueFormClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleUpdate}
            setPayload={setPayload}
          />
        )}

        {opened && content === 'pr' && (
          <PurchaseRequestFormClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleUpdate}
          />
        )}

        {opened && content === 'rfq' && (
          <RequestQuotionFormClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleUpdate}
          />
        )}

        {opened && content === 'aoq' && (
          <AbstractQuotionFormClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleUpdate}
          />
        )}

        {opened && content === 'po' && (
          <PurchaseOrderFormClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleUpdate}
          />
        )}

        {opened && content === 'iar' && (
          <InspectionAcceptanceReportFormClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleUpdate}
          />
        )}

        {opened && content === 'inv-supply' && (
          <InventorySupplyFormClient
            ref={formRef}
            data={data}
            handleCreateUpdate={handleUpdate}
          />
        )}

        {opened && content === 'inv-issuance' && (
          <>
            {data?.document_type === 'ris' && (
              <RisFormClient
                ref={formRef}
                data={data}
                handleCreateUpdate={handleUpdate}
              />
            )}

            {data?.document_type === 'ics' && (
              <IcsFormClient
                ref={formRef}
                data={data}
                handleCreateUpdate={handleUpdate}
              />
            )}

            {data?.document_type === 'are' && (
              <AreFormClient
                ref={formRef}
                data={data}
                handleCreateUpdate={handleUpdate}
              />
            )}
          </>
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
