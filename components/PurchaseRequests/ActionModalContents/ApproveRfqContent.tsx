'use client';

import DynamicSelect from '@/components/Generic/DynamicSelect';
import { Stack, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMediaQuery } from '@mantine/hooks';
import { forwardRef, useEffect, useMemo, useState } from 'react';

const ApproveRfqContent = forwardRef<
  HTMLFormElement,
  {
    handleAction?: (uncontrolledPayload?: object) => void;
  }
>(({ handleAction }, ref) => {
  const lgScreenAndBelow = useMediaQuery('(max-width: 900px)');
  const [modeProcurementId, setModeProcurementId] = useState<string | null>(
    null
  );

  const currentForm = useMemo(
    () => ({
      mode_procurement_id: '',
    }),
    []
  );

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: currentForm,
  });

  useEffect(() => {
    form.reset();
    form.setValues(currentForm);
  }, [currentForm]);

  return (
    <form
      ref={ref}
      onSubmit={form.onSubmit((values) => {
        if (handleAction) {
          handleAction({
            mode_procurement_id: modeProcurementId,
          });
        }
      })}
    >
      <Stack>
        <Text size={lgScreenAndBelow ? 'sm' : 'md'}>
          Are you sure you want to approve the Request Quotations for Abstract
          of Quotation?
        </Text>

        <DynamicSelect
          variant={'unstyled'}
          label={'Mode of Procurement'}
          placeholder={'Select a mode of procurement...'}
          endpoint={'/libraries/procurement-modes'}
          endpointParams={{
            paginated: false,
            show_all: true,
          }}
          column={'mode_name'}
          valueColumn={'id'}
          value={modeProcurementId}
          onChange={(value) => setModeProcurementId(value)}
          size={lgScreenAndBelow ? 'sm' : 'md'}
          required
          sx={{
            borderBottom: '2px solid var(--mantine-color-gray-5)',
            input: {
              minHeight: '30px',
              height: '30px',
            },
          }}
        />
      </Stack>
    </form>
  );
});

ApproveRfqContent.displayName = 'ApproveRfqContent';

export default ApproveRfqContent;
