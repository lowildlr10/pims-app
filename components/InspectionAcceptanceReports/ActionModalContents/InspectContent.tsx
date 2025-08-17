'use client';

import CustomLoadingOverlay from '@/components/Generic/CustomLoadingOverlay';
import API from '@/libs/API';
import { notify } from '@/libs/Notification';
import Helper from '@/utils/Helpers';
import { NumberInput, Skeleton, Textarea } from '@mantine/core';
import { Table } from '@mantine/core';
import { Group } from '@mantine/core';
import { Select } from '@mantine/core';
import { TextInput } from '@mantine/core';
import { Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMediaQuery } from '@mantine/hooks';
import { IconAsterisk } from '@tabler/icons-react';
import { forwardRef, useEffect, useMemo, useState } from 'react';

const InspectContent = forwardRef<
  HTMLFormElement,
  {
    id: string;
    documentType: 'po' | 'jo';
    handleAction?: (uncontrolledPayload?: object) => void;
  }
>(({ id, documentType, handleAction }, ref) => {
  const lgScreenAndBelow = useMediaQuery('(max-width: 900px)');
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<
    {
      id: string;
      purchase_order_id: string;
      po_item_id: string;
      stock_no: number;
      name: string;
      description: string;
      unit_issue_id: string;
      unit: string;
      quantity: number;
      unit_cost: number;
      total_cost: number;
      item_classification_id: string;
      required_document: string;
    }[]
  >([]);
  const [classificationData, setClassificationData] = useState<
    {
      value: string;
      label: string;
    }[]
  >();
  const currentForm = useMemo(
    () => ({
      items: items?.map((item) => ({
        id: item.id,
        purchase_order_id: item.purchase_order_id,
        po_item_id: item.po_item_id,
        stock_no: item.stock_no,
        name: item.name,
        description: item.description,
        unit_issue_id: item.unit_issue_id,
        unit: item.unit,
        quantity: item.quantity,
        unit_cost: item.unit_cost,
        total_cost: item.total_cost,
        item_classification_id: item.item_classification_id,
        required_document: item.required_document,
      })),
    }),
    [items]
  );

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: currentForm,
    validate: {
      items: {
        item_classification_id: (value) =>
          Helper.empty(value) ? 'Item classification field is required' : null,
        required_document: (value) =>
          Helper.empty(value) ? 'Required document field is required' : null,
      },
    },
  });

  useEffect(() => {
    setLoading(true);

    let retries = 3;

    const fetch = () => {
      API.get('/libraries/item-classifications', {
        paginated: false,
        show_all: true,
        sort_direction: 'asc',
      })
        .then((res) => {
          setClassificationData(
            res?.data?.length > 0
              ? res.data?.map((item: any) => ({
                  value: item['id'],
                  label: item['classification_name'],
                }))
              : [{ label: 'No data.', value: '' }]
          );
        })
        .catch(() => {
          if (retries > 0) {
            retries -= 1;
            fetch();
          } else {
            notify({
              title: 'Failed',
              message: 'Failed after multiple retries',
              color: 'red',
            });
            setLoading(false);
          }
        })
        .finally(() => setLoading(false));
    };

    fetch();
  }, []);

  useEffect(() => {
    setLoading(true);

    let retries = 3;

    const fetch = () => {
      API.get(`/inspection-acceptance-reports/${id}`)
        .then((res) =>
          setItems(
            res?.data?.data?.items?.map(
              (item: InspectionAcceptanceReportItemType) => ({
                id: item.id,
                purchase_order_id: item.po_item?.purchase_order_id,
                po_item_id: item.po_item?.id,
                stock_no: item.pr_item?.stock_no,
                name: null,
                description: item.po_item?.description,
                unit_issue_id: item.pr_item?.unit_issue_id,
                unit: item.pr_item?.unit_issue?.unit_name,
                quantity: item.pr_item?.quantity,
                unit_cost: item.po_item?.unit_cost,
                total_cost: item.po_item?.total_cost,
                item_classification_id: null,
                required_document: null,
              })
            ) ?? []
          )
        )
        .catch(() => {
          if (retries > 0) {
            retries -= 1;
            fetch();
          } else {
            notify({
              title: 'Failed',
              message: 'Failed after multiple retries',
              color: 'red',
            });
            setLoading(false);
          }
        })
        .finally(() => setLoading(false));
    };

    fetch();
  }, [id]);

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
            items: values.items.map((item) => ({
              purchase_order_id: item.purchase_order_id,
              po_item_id: item.po_item_id,
              stock_no: item.stock_no,
              name: item.name,
              description: item.description,
              unit_issue_id: item.unit_issue_id,
              quantity: item.quantity,
              unit_cost: item.unit_cost,
              total_cost: item.total_cost,
              item_classification_id: item.item_classification_id,
              required_document: item.required_document,
            })),
          });
        }
      })}
    >
      <Stack>
        <CustomLoadingOverlay visible={loading} />

        <Stack>
          <Table
            withColumnBorders
            withRowBorders
            verticalSpacing={'sm'}
            withTableBorder
            m={0}
            borderColor={'var(--mantine-color-gray-8)'}
          >
            <Table.Thead>
              <Table.Tr sx={{ verticalAlign: 'top' }}>
                <Table.Th w={'12%'} fz={lgScreenAndBelow ? 'sm' : 'md'}>
                  Item No.
                </Table.Th>
                <Table.Th w={'14%'} fz={lgScreenAndBelow ? 'sm' : 'md'}>
                  Unit
                </Table.Th>
                <Table.Th w={'30%'} fz={lgScreenAndBelow ? 'sm' : 'md'}>
                  <Group gap={1} align={'flex-start'}>
                    Name & Description
                    <Stack>
                      <IconAsterisk
                        size={7}
                        color={'var(--mantine-color-red-8)'}
                        stroke={2}
                      />
                    </Stack>
                  </Group>
                </Table.Th>
                <Table.Th w={'12%'} fz={lgScreenAndBelow ? 'sm' : 'md'}>
                  Quantity
                </Table.Th>
                <Table.Th w={'17%'} fz={lgScreenAndBelow ? 'sm' : 'md'}>
                  <Group gap={1} align={'flex-start'}>
                    Item Classification
                    <Stack>
                      <IconAsterisk
                        size={7}
                        color={'var(--mantine-color-red-8)'}
                        stroke={2}
                      />
                    </Stack>
                  </Group>
                </Table.Th>
                <Table.Th w={'15%'} fz={lgScreenAndBelow ? 'sm' : 'md'}>
                  <Group gap={1} align={'flex-start'}>
                    Required Inventory Document
                    <Stack>
                      <IconAsterisk
                        size={7}
                        color={'var(--mantine-color-red-8)'}
                        stroke={2}
                      />
                    </Stack>
                  </Group>
                </Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {loading &&
                Array.from({ length: 10 }).map((_, i) => (
                  <Table.Tr key={i}>
                    <Table.Td colSpan={6}>
                      <Skeleton height={30} radius='sm' />
                    </Table.Td>
                  </Table.Tr>
                ))}

              {!loading &&
                form.getValues()?.items.length > 0 &&
                items?.map((item, index) => (
                  <Table.Tr
                    key={`item-${item.id}`}
                    sx={{ verticalAlign: 'top' }}
                  >
                    <Table.Td>
                      <NumberInput
                        size={lgScreenAndBelow ? 'sm' : 'md'}
                        variant={'unstyled'}
                        value={item?.stock_no}
                        readOnly
                      />
                    </Table.Td>
                    <Table.Td align={'center'}>
                      <TextInput
                        variant={'unstyled'}
                        placeholder={'None'}
                        defaultValue={item.unit}
                        size={lgScreenAndBelow ? 'sm' : 'md'}
                        flex={1}
                        readOnly
                      />
                    </Table.Td>
                    <Table.Td>
                      <TextInput
                        key={form.key(`items.${index}.name`)}
                        {...form.getInputProps(`items.${index}.name`)}
                        placeholder={'Enter supply name here...'}
                        defaultValue={item.name}
                        size={lgScreenAndBelow ? 'sm' : 'md'}
                        mb={lgScreenAndBelow ? 'sm' : 'md'}
                        required
                      />
                      <Textarea
                        key={form.key(`items.${index}.description`)}
                        {...form.getInputProps(`items.${index}.description`)}
                        placeholder={'Enter description here...'}
                        defaultValue={item.description}
                        size={lgScreenAndBelow ? 'sm' : 'md'}
                        autosize
                        required
                      />
                    </Table.Td>
                    <Table.Td>
                      <NumberInput
                        size={lgScreenAndBelow ? 'sm' : 'md'}
                        variant={'unstyled'}
                        value={item?.quantity}
                        readOnly
                      />
                    </Table.Td>
                    <Table.Td>
                      <Select
                        key={form.key(`items.${index}.item_classification_id`)}
                        {...form.getInputProps(
                          `items.${index}.item_classification_id`
                        )}
                        size={lgScreenAndBelow ? 'sm' : 'md'}
                        data={classificationData}
                        placeholder={'Item Classification'}
                        searchable
                        clearable
                        required
                      />
                    </Table.Td>
                    <Table.Td>
                      <Select
                        key={form.key(`items.${index}.required_document`)}
                        {...form.getInputProps(
                          `items.${index}.required_document`
                        )}
                        size={lgScreenAndBelow ? 'sm' : 'md'}
                        data={[
                          {
                            label: 'Acknowledgment Receipt for Equipment',
                            value: 'are',
                          },
                          { label: 'Inventory Custodian Slip', value: 'ics' },
                          { label: 'Requisition and Issue Slip', value: 'ris' },
                        ]}
                        placeholder={'Required Inventory Document'}
                        searchable
                        clearable
                        required
                      />
                    </Table.Td>
                  </Table.Tr>
                ))}
            </Table.Tbody>
          </Table>
        </Stack>
      </Stack>
    </form>
  );
});

InspectContent.displayName = 'InspectContent';

export default InspectContent;
