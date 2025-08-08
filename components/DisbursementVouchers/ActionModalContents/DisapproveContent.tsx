'use client';

import { Stack, Text, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMediaQuery } from '@mantine/hooks';
import { forwardRef, useEffect, useMemo, useState } from 'react';

const DisapproveContent = forwardRef<
  HTMLFormElement,
  {
    handleAction?: (uncontrolledPayload?: object) => void;
  }
>(({ handleAction }, ref) => {
  const lgScreenAndBelow = useMediaQuery('(max-width: 900px)');
  const currentForm = useMemo(
    () => ({
      disapproved_reason: '',
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
            disapproved_reason: values.disapproved_reason ?? null,
          });
        }
      })}
    >
      <Stack>
        <Text size={lgScreenAndBelow ? 'sm' : 'md'}>
          Are you sure you want to disapprove this Obligation Request?
        </Text>

        <Textarea
          key={form.key('disapproved_reason')}
          {...form.getInputProps('disapproved_reason')}
          label={'Disapprove Reason'}
          placeholder={'Enter the disapprove reason here...'}
          error={form.errors.disapproved_reason && ''}
          size={lgScreenAndBelow ? 'sm' : 'md'}
          autosize
          autoCapitalize={'sentences'}
        />
      </Stack>
    </form>
  );
});

DisapproveContent.displayName = 'DisapproveContent';

export default DisapproveContent;
