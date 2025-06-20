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
import DynamicAutocomplete from '../Generic/DynamicAutocomplete';
import DynamicSelect from '../Generic/DynamicSelect';
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

const FormClient = forwardRef<
  HTMLFormElement,
  ModalInventorySupplyContentProps
>(({ data, readOnly, handleCreateUpdate }, ref) => {
  const lgScreenAndBelow = useMediaQuery('(max-width: 1366px)');
  const [currentData, setCurrentData] = useState(data);
  const currentForm = useMemo(() => {
    return {
      sku: currentData?.sku ?? '',
      upc: currentData?.upc ?? '',
      name: currentData?.name ?? '',
      description: currentData?.description ?? '',
      item_classification_id: currentData?.item_classification_id ?? '',
      required_document: currentData?.required_document ?? '',
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
          <Stack w={'100%'}>
            <Text size={lgScreenAndBelow ? 'lg' : 'xl'} fw={500}>
              Details
            </Text>

            <TextInput
              key={form.key('name')}
              {...form.getInputProps('name')}
              placeholder={readOnly ? 'None' : 'Enter name here...'}
              defaultValue={readOnly ? undefined : form.values.name}
              value={readOnly ? currentData?.name : undefined}
              size={lgScreenAndBelow ? 'sm' : 'md'}
              label={'Name'}
              readOnly={readOnly}
            />
            <Textarea
              key={form.key('description')}
              {...form.getInputProps('description')}
              placeholder={readOnly ? 'None' : 'Enter description here...'}
              defaultValue={form.values.description ?? '-'}
              label={'Description'}
              size={lgScreenAndBelow ? 'sm' : 'md'}
              autosize
              required={!readOnly}
              readOnly={readOnly}
            />
            <TextInput
              key={form.key('sku')}
              {...form.getInputProps('sku')}
              placeholder={readOnly ? 'None' : 'Enter SKU here...'}
              defaultValue={readOnly ? undefined : form.values.sku}
              value={readOnly ? currentData?.sku : undefined}
              size={lgScreenAndBelow ? 'sm' : 'md'}
              label={'SKU'}
              readOnly={readOnly}
            />
            <TextInput
              key={form.key('upc')}
              {...form.getInputProps('upc')}
              placeholder={readOnly ? 'None' : 'Enter UPC here...'}
              defaultValue={readOnly ? undefined : form.values.upc}
              value={readOnly ? currentData?.upc : undefined}
              size={lgScreenAndBelow ? 'sm' : 'md'}
              label={'UPC'}
              readOnly={readOnly}
            />

            <Flex
              w={'100%'}
              direction={lgScreenAndBelow ? 'column' : 'row'}
              gap={'md'}
            >
              {!readOnly ? (
                <DynamicSelect
                  key={form.key('item_classification_id')}
                  {...form.getInputProps('item_classification_id')}
                  label={'Item Classification'}
                  placeholder={
                    !readOnly ? 'Select a classification...' : 'None'
                  }
                  endpoint={'/libraries/item-classifications'}
                  endpointParams={{
                    paginated: false,
                    show_all: true,
                  }}
                  column={'classification_name'}
                  defaultData={
                    currentData?.item_classification_id
                      ? [
                          {
                            value: currentData?.item_classification_id ?? '',
                            label:
                              currentData?.item_classification
                                ?.classification_name ?? '',
                          },
                        ]
                      : undefined
                  }
                  value={form.values.item_classification_id}
                  size={lgScreenAndBelow ? 'sm' : 'md'}
                  sx={{ flex: 1 }}
                  readOnly={readOnly}
                  required={!readOnly}
                />
              ) : (
                <TextInput
                  label={'Item Classification'}
                  placeholder={'None'}
                  value={
                    currentData?.item_classification?.classification_name ?? ''
                  }
                  size={lgScreenAndBelow ? 'sm' : 'md'}
                  flex={1}
                  readOnly
                />
              )}

              {!readOnly ? (
                <Select
                  key={form.key('required_document')}
                  {...form.getInputProps('required_document')}
                  size={lgScreenAndBelow ? 'sm' : 'md'}
                  data={[
                    {
                      label: 'Acknowledgment Receipt for Equipment',
                      value: 'are',
                    },
                    { label: 'Inventory Custodian Slip', value: 'ics' },
                    { label: 'Requisition and Issue Slip', value: 'ris' },
                  ]}
                  defaultValue={form.values.required_document}
                  label={'Required Inventory Document'}
                  placeholder={'Select a required inventory document...'}
                  flex={1}
                  searchable
                  clearable
                  required
                />
              ) : (
                <TextInput
                  label={'Required Inventory Document'}
                  placeholder={'None'}
                  value={Helper.mapInventoryIssuanceType(
                    currentData?.required_document
                  )}
                  size={lgScreenAndBelow ? 'sm' : 'md'}
                  flex={1}
                  readOnly
                />
              )}
            </Flex>

            {readOnly && (
              <>
                <Divider />

                <TextInput
                  variant={readOnly ? 'default' : 'filled'}
                  placeholder={'None'}
                  value={
                    readOnly ? currentData?.unit_issue?.unit_name : undefined
                  }
                  size={lgScreenAndBelow ? 'sm' : 'md'}
                  label={'Unit'}
                  readOnly
                />

                <Flex
                  w={'100%'}
                  direction={lgScreenAndBelow ? 'column' : 'row'}
                  gap={'md'}
                >
                  <NumberInput
                    variant={readOnly ? 'default' : 'filled'}
                    label={'Inventory'}
                    placeholder={'None'}
                    value={currentData?.quantity}
                    size={lgScreenAndBelow ? 'sm' : 'md'}
                    min={0}
                    clampBehavior={'strict'}
                    allowDecimal={false}
                    thousandSeparator={','}
                    flex={1}
                    readOnly
                  />
                  <NumberInput
                    variant={readOnly ? 'default' : 'filled'}
                    label={'Available'}
                    placeholder={'None'}
                    value={currentData?.available}
                    size={lgScreenAndBelow ? 'sm' : 'md'}
                    min={0}
                    clampBehavior={'strict'}
                    allowDecimal={false}
                    thousandSeparator={','}
                    flex={1}
                    readOnly
                  />
                </Flex>
                <NumberInput
                  variant={readOnly ? 'default' : 'filled'}
                  label={'Unit Cost'}
                  placeholder={'None'}
                  value={currentData?.unit_cost}
                  size={lgScreenAndBelow ? 'sm' : 'md'}
                  min={0}
                  decimalScale={2}
                  fixedDecimalScale
                  thousandSeparator={','}
                  flex={1}
                  readOnly
                />
              </>
            )}
          </Stack>
        </Card>

        {readOnly && (
          <Card
            shadow={'xs'}
            padding={lgScreenAndBelow ? 'md' : 'lg'}
            radius={'xs'}
            withBorder
          >
            <Stack w={'100%'}>
              <Text size={lgScreenAndBelow ? 'lg' : 'xl'} fw={500}>
                Recipients
              </Text>

              <Table.ScrollContainer
                minWidth={500}
                w={readOnly ? 'calc(100vw - 8.6em)' : 'calc(100vw - 6.7em)'}
                h={'calc(100vh - 20em)'}
              >
                <Table
                  withColumnBorders
                  withRowBorders
                  verticalSpacing={'sm'}
                  withTableBorder
                  m={0}
                  borderColor={'var(--mantine-color-gray-8)'}
                  stickyHeader
                  stickyHeaderOffset={-1}
                >
                  <Table.Thead>
                    {/* <Table.Tr
                      sx={{
                        backgroundColor: 'var(--mantine-color-gray-2)',
                        th: {
                          borderLeft: '1px solid',
                        },
                      }}
                    >
                      {itemHeaders.map((header) => {
                        const supplierHeader =
                          header.id === 'supplier'
                            ? supplierHeaders.find(
                                (supplier) =>
                                  supplier.supplier_id === header?.label
                              )
                            : undefined;

                        if (readOnly && header.id === 'include_checkbox')
                          return;

                        return (
                          <Table.Th
                            key={
                              header.id === 'supplier'
                                ? header.label
                                : header.id
                            }
                            w={header?.width ?? undefined}
                            miw={header?.width ?? undefined}
                            fz={lgScreenAndBelow ? 'sm' : 'md'}
                            rowSpan={header.id === 'supplier' ? 1 : 2}
                            colSpan={
                              header.id === 'supplier' ? (readOnly ? 3 : 2) : 1
                            }
                          >
                            <Group gap={1} align={'center'} justify={'center'}>
                              {header.id === 'supplier'
                                ? supplierHeader?.supplier_name
                                : header.label}{' '}
                              {header?.required && !readOnly && !isCreate && (
                                <Stack>
                                  <IconAsterisk
                                    size={7}
                                    color={'var(--mantine-color-red-8)'}
                                    stroke={2}
                                  />
                                </Stack>
                              )}
                            </Group>
                          </Table.Th>
                        );
                      })}
                    </Table.Tr>
                    <Table.Tr
                      sx={{
                        lineHeight: 0.4,
                        backgroundColor: 'var(--mantine-color-gray-2)',
                        th: {
                          border: '1px solid',
                        },
                      }}
                    >
                      {itemHeaders.map((header, index) => {
                        if (header.id !== 'supplier') return;

                        return (
                          <React.Fragment key={header.label}>
                            <Table.Th
                              ta={'center'}
                              w={'150px'}
                              miw={'150px'}
                              fz={lgScreenAndBelow ? 'sm' : 'md'}
                            >
                              Brand
                            </Table.Th>
                            <Table.Th
                              ta={'center'}
                              w={'225px'}
                              miw={'225px'}
                              fz={lgScreenAndBelow ? 'sm' : 'md'}
                            >
                              Unit Cost
                            </Table.Th>

                            {readOnly && (
                              <Table.Th
                                ta={'center'}
                                w={'225px'}
                                miw={'225px'}
                                fz={lgScreenAndBelow ? 'sm' : 'md'}
                              >
                                Total Cost
                              </Table.Th>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </Table.Tr> */}
                  </Table.Thead>
                  <Table.Tbody>
                    {/* {form.getValues().items.length === 0 &&
                      Array.from({ length: 5 }).map((_, i) => (
                        <Table.Tr key={i}>
                          <Table.Td colSpan={supplierHeaders.length * 3 + 5}>
                            <Skeleton height={30} radius='sm' />
                          </Table.Td>
                        </Table.Tr>
                      ))}

                    {form.getValues().items.map((item, index) => (
                      <Table.Tr
                        key={`item-${item.key}`}
                        sx={{ verticalAlign: 'top' }}
                      >
                        {itemHeaders.map((header) => {
                          if (header.id === 'include_checkbox') {
                            return null;
                          }

                          return (
                            <React.Fragment
                              key={`field-${item.key}-${header.id === 'supplier' ? header.label : header.id}`}
                            >
                              {renderDynamicTdContent(
                                header.id,
                                item,
                                index,
                                header.id === 'supplier'
                                  ? header.label
                                  : undefined
                              )}
                            </React.Fragment>
                          );
                        })}

                        {!readOnly && (
                          <Table.Td valign={'top'} ta={'center'} pt={'sm'}>
                            <Checkbox
                              key={form.key(`items.${index}.included`)}
                              {...form.getInputProps(`items.${index}.included`)}
                              w={'100%'}
                              size={lgScreenAndBelow ? 'sm' : 'md'}
                              color={'var(--mantine-color-primary-9)'}
                              defaultChecked={item.included}
                              sx={{
                                justifyItems: 'center',
                              }}
                              disabled
                            />
                            <input
                              key={form.key(`items.${index}.quantity`)}
                              {...form.getInputProps(`items.${index}.quantity`)}
                              type={'hidden'}
                              value={item.quantity}
                            />
                            <input
                              key={form.key(`items.${index}.pr_item_id`)}
                              {...form.getInputProps(
                                `items.${index}.pr_item_id`
                              )}
                              type={'hidden'}
                              value={item.pr_item_id}
                            />
                          </Table.Td>
                        )}
                      </Table.Tr>
                    ))}

                    {readOnly && (
                      <Table.Tr>
                        <Table.Td colSpan={4}></Table.Td>

                        {supplierHeaders?.map((supplier) => (
                          <React.Fragment key={supplier.supplier_id}>
                            <Table.Td></Table.Td>
                            <Table.Td></Table.Td>
                            <Table.Td>
                              <NumberFormatter
                                style={{
                                  fontSize: lgScreenAndBelow
                                    ? '0.75rem'
                                    : '0.95rem',
                                  fontWeight: 600,
                                }}
                                prefix={'P '}
                                value={supplier.total_cost}
                                decimalScale={2}
                                fixedDecimalScale
                                thousandSeparator
                              />
                            </Table.Td>
                          </React.Fragment>
                        ))}

                        <Table.Td></Table.Td>
                      </Table.Tr>
                    )} */}
                  </Table.Tbody>
                </Table>
              </Table.ScrollContainer>
            </Stack>
          </Card>
        )}
      </Stack>
    </form>
  );
});

FormClient.displayName = 'FormClient';

export default FormClient;
