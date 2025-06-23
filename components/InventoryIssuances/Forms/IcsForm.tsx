import API from '@/libs/API';
import { getErrors } from '@/libs/Errors';
import { notify } from '@/libs/Notification';
import { Box, Card, Divider, Flex, Group, Text } from '@mantine/core';
import { Select } from '@mantine/core';
import { NumberInput, Stack, Table, Textarea, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { randomId, useMediaQuery } from '@mantine/hooks';
import { IconAsterisk, IconCalendar } from '@tabler/icons-react';
import dayjs from 'dayjs';
import React, {
  forwardRef,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ToWords } from 'to-words';
import DynamicAutocomplete from '../../Generic/DynamicAutocomplete';
import DynamicSelect from '../../Generic/DynamicSelect';
import Helper from '@/utils/Helpers';

const itemHeaders: PurchaseRequestItemHeader[] = [
  {
    id: 'stock_no',
    label: 'Stock No.',
    width: '12%',
  },
  {
    id: 'unit_issue',
    label: 'Unit',
    width: '14%',
  },
  {
    id: 'description',
    label: 'Item and Description',
    width: '30%',
    required: true,
  },
  {
    id: 'quantity',
    label: 'Qty',
    width: '12%',
  },
  {
    id: 'unit_cost',
    label: 'Unit Cost',
    width: '16%',
  },
  {
    id: 'total_cost',
    label: 'Amount',
    width: '16%',
  },
];

const IcsFormClient = forwardRef<
  HTMLFormElement,
  ModalInventoryIssuanceContentProps
>(({ data, readOnly, handleCreateUpdate }, ref) => {
  const lgScreenAndBelow = useMediaQuery('(max-width: 1366px)');
  const [currentData, setCurrentData] = useState(data);
  const currentForm = useMemo(() => {
    return {
      document_type: currentData?.document_type ?? '',
    };
  }, [currentData]);
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: currentForm,
  });

  useEffect(() => {
    form.reset();
    form.setValues(currentForm);
  }, [currentForm]);

  useEffect(() => {
    setCurrentData(data);
  }, [data]);

  // useEffect(() => {
  //   console.log(currentData);
  // }, [currentData]);

  // const renderDynamicTdContent = (
  //   id: string,
  //   item: PurchaseOrderItemsFieldType,
  //   index: number
  // ): ReactNode => {
  //   switch (id) {
  //     case 'stock_no':
  //       return (
  //         <Table.Td>
  //           <NumberInput
  //             size={lgScreenAndBelow ? 'sm' : 'md'}
  //             variant={readOnly ? 'unstyled' : 'filled'}
  //             value={item?.stock_no}
  //             readOnly
  //           />
  //         </Table.Td>
  //       );

  //     case 'unit_issue':
  //       return (
  //         <Table.Td align={'center'}>
  //           <TextInput
  //             variant={readOnly ? 'unstyled' : 'filled'}
  //             placeholder={'None'}
  //             defaultValue={item.unit_issue}
  //             size={lgScreenAndBelow ? 'sm' : 'md'}
  //             flex={1}
  //             readOnly
  //           />
  //         </Table.Td>
  //       );

  //     case 'description':
  //       return (
  //         <Table.Td>
  //           <Textarea
  //             key={form.key(`items.${index}.description`)}
  //             {...form.getInputProps(`items.${index}.description`)}
  //             variant={readOnly ? 'unstyled' : 'default'}
  //             placeholder={'Description'}
  //             defaultValue={readOnly ? undefined : item.description}
  //             value={readOnly ? item.description : undefined}
  //             size={lgScreenAndBelow ? 'sm' : 'md'}
  //             autosize
  //             readOnly={readOnly}
  //           />
  //         </Table.Td>
  //       );

  //     case 'quantity':
  //       return (
  //         <Table.Td>
  //           <NumberInput
  //             size={lgScreenAndBelow ? 'sm' : 'md'}
  //             variant={readOnly ? 'unstyled' : 'filled'}
  //             value={item?.quantity}
  //             readOnly
  //           />
  //         </Table.Td>
  //       );

  //     case 'unit_cost':
  //       return (
  //         <Table.Td colSpan={readOnly ? 1 : 2}>
  //           <NumberInput
  //             size={lgScreenAndBelow ? 'sm' : 'md'}
  //             variant={readOnly ? 'unstyled' : 'filled'}
  //             value={item?.unit_cost}
  //             decimalScale={2}
  //             fixedDecimalScale
  //             thousandSeparator={','}
  //             readOnly
  //           />
  //         </Table.Td>
  //       );

  //     case 'total_cost':
  //       return (
  //         <Table.Td>
  //           <NumberInput
  //             size={lgScreenAndBelow ? 'sm' : 'md'}
  //             variant={readOnly ? 'unstyled' : 'filled'}
  //             value={item?.total_cost}
  //             decimalScale={2}
  //             fixedDecimalScale
  //             thousandSeparator={','}
  //             readOnly
  //           />
  //         </Table.Td>
  //       );

  //     default:
  //       return <></>;
  //   }
  // };

  return (
    <form
      ref={ref}
      onSubmit={form.onSubmit(
        (values) => handleCreateUpdate && handleCreateUpdate(values)
      )}
    >
      <Stack p={'md'} justify={'center'}>
        <Card
          shadow={'xs'}
          padding={lgScreenAndBelow ? 'md' : 'lg'}
          radius={'xs'}
          withBorder
        >
          ICS
        </Card>
      </Stack>
    </form>
  );
});

IcsFormClient.displayName = 'IcsFormClient';

export default IcsFormClient;
