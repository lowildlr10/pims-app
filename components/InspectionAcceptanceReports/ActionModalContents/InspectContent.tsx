'use client';

import CustomLoadingOverlay from '@/components/Generic/CustomLoadingOverlay';
import API from '@/libs/API';
import { notify } from '@/libs/Notification';
import Helper from '@/utils/Helpers';
import {
  Box,
  Card,
  Group,
  NumberInput,
  Select,
  Skeleton,
  Stack,
  Switch,
  Table,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core';
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
      included: boolean;
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
        included: item.included,
      })),
    }),
    [items]
  );

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: currentForm,
  });

  const requiredDocumentOptions = [
    { label: 'Acknowledgment Receipt for Equipment', value: 'are' },
    { label: 'Inventory Custodian Slip', value: 'ics' },
    { label: 'Requisition and Issue Slip', value: 'ris' },
  ];

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
              ? res.data?.map(
                  (item: { id: string; classification_name: string }) => ({
                    value: item.id,
                    label: item.classification_name,
                  })
                )
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
            res?.data?.items?.map(
              (item: InspectionAcceptanceReportItemType) => ({
                id: item.id,
                purchase_order_id: item.po_item?.purchase_order_id,
                po_item_id: item.po_item?.id,
                stock_no: item.pr_item?.stock_no,
                name: item.po_item?.description,
                description: '',
                unit_issue_id: item.pr_item?.unit_issue_id,
                unit: item.pr_item?.unit_issue?.unit_name ?? '-',
                quantity: item.pr_item?.quantity,
                unit_cost: item.unit_cost ?? item.po_item?.unit_cost,
                total_cost: item.po_item?.total_cost,
                item_classification_id: null,
                required_document: null,
                included: true,
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

  const hasIncludedItems =
    form.getValues()?.items?.some((item) => item.included) ?? false;

  const renderRequiredAsterisk = () => (
    <IconAsterisk size={7} color='var(--mantine-color-red-8)' stroke={2} />
  );

  return (
    <form
      ref={ref}
      onSubmit={form.onSubmit((values) => {
        if (handleAction) {
          const includedItems = values.items.filter((item) => item.included);

          const missingFields = includedItems
            .map((item, idx) => {
              const missing: string[] = [];
              if (Helper.empty(item.name)) {
                missing.push(`Item ${idx + 1}: Name is required`);
              }
              if (Helper.empty(item.item_classification_id)) {
                missing.push(
                  `Item ${idx + 1}: Item Classification is required`
                );
              }
              if (Helper.empty(item.required_document)) {
                missing.push(
                  `Item ${idx + 1}: Required Inventory Document is required`
                );
              }
              return missing;
            })
            .flat();

          if (missingFields.length > 0) {
            notify({
              title: 'Validation Error',
              message: missingFields[0],
              color: 'red',
            });
            return;
          }

          handleAction({
            items: values.items.map((item) => ({
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
              item_classification_id: item.included
                ? item.item_classification_id
                : null,
              required_document: item.included ? item.required_document : null,
              included: item.included,
            })),
          });
        }
      })}
    >
      <Stack
        p={{ base: 'xs', sm: 'md' }}
        justify={'center'}
        style={{ background: 'var(--mantine-color-gray-1)' }}
      >
        <CustomLoadingOverlay visible={loading} />

        <Card
          shadow={'sm'}
          padding={lgScreenAndBelow ? 'sm' : 'md'}
          radius={0}
          withBorder
          style={{
            borderColor: 'var(--mantine-color-gray-4)',
            background: 'white',
          }}
        >
          <Stack gap={0} bd={1}>
            <Table
              withColumnBorders
              withRowBorders
              verticalSpacing='sm'
              withTableBorder
              m={0}
              bdrs={1}
              borderColor='var(--mantine-color-gray-9)'
              sx={{
                borderRadius: '8px',
                overflow: 'hidden',
              }}
            >
              <Table.Thead>
                <Table.Tr>
                  <Table.Th
                    fz={lgScreenAndBelow ? 'xs' : 'sm'}
                    fw={600}
                    ta='center'
                    py={lgScreenAndBelow ? 8 : 10}
                    px={lgScreenAndBelow ? 'xs' : 'sm'}
                    w='5%'
                  >
                    For Inventory
                  </Table.Th>
                  <Table.Th
                    fz={lgScreenAndBelow ? 'xs' : 'sm'}
                    fw={600}
                    py={lgScreenAndBelow ? 8 : 10}
                    px={lgScreenAndBelow ? 'xs' : 'sm'}
                    w='8%'
                  >
                    Item No.
                  </Table.Th>
                  <Table.Th
                    fz={lgScreenAndBelow ? 'xs' : 'sm'}
                    fw={600}
                    py={lgScreenAndBelow ? 8 : 10}
                    px={lgScreenAndBelow ? 'xs' : 'sm'}
                    w='8%'
                  >
                    Unit
                  </Table.Th>
                  <Table.Th
                    fz={lgScreenAndBelow ? 'xs' : 'sm'}
                    fw={600}
                    py={lgScreenAndBelow ? 8 : 10}
                    px={lgScreenAndBelow ? 'xs' : 'sm'}
                    w='25%'
                  >
                    Name & Description
                  </Table.Th>
                  <Table.Th
                    fz={lgScreenAndBelow ? 'xs' : 'sm'}
                    fw={600}
                    py={lgScreenAndBelow ? 8 : 10}
                    px={lgScreenAndBelow ? 'xs' : 'sm'}
                    w='8%'
                  >
                    Qty
                  </Table.Th>
                  <Table.Th
                    fz={lgScreenAndBelow ? 'xs' : 'sm'}
                    fw={600}
                    py={lgScreenAndBelow ? 8 : 10}
                    px={lgScreenAndBelow ? 'xs' : 'sm'}
                    w='23%'
                  >
                    <Group gap={4} align='center' wrap='nowrap'>
                      <Text
                        fz={lgScreenAndBelow ? 'xs' : 'sm'}
                        fw={600}
                        py={lgScreenAndBelow ? 8 : 10}
                        px={lgScreenAndBelow ? 'xs' : 'sm'}
                      >
                        Item Classification
                      </Text>
                      {renderRequiredAsterisk()}
                    </Group>
                  </Table.Th>
                  <Table.Th
                    fz={lgScreenAndBelow ? 'xs' : 'sm'}
                    fw={600}
                    py={lgScreenAndBelow ? 8 : 10}
                    px={lgScreenAndBelow ? 'xs' : 'sm'}
                    w='23%'
                  >
                    <Group gap={4} align='center' wrap='nowrap'>
                      <Text
                        fz={lgScreenAndBelow ? 'xs' : 'sm'}
                        fw={600}
                        py={lgScreenAndBelow ? 8 : 10}
                        px={lgScreenAndBelow ? 'xs' : 'sm'}
                      >
                        Required Inventory Doc.
                      </Text>
                      {renderRequiredAsterisk()}
                    </Group>
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>

              <Table.Tbody>
                {loading &&
                  Array.from({ length: 5 }).map((_, i) => (
                    <Table.Tr key={i}>
                      <Table.Td colSpan={7}>
                        <Skeleton height={30} radius='sm' />
                      </Table.Td>
                    </Table.Tr>
                  ))}

                {!loading &&
                  form.getValues()?.items.length > 0 &&
                  items?.map((item, index) => {
                    const itemValues = form.getValues()?.items?.[index];
                    const isIncluded = itemValues?.included ?? true;
                    return (
                      <Table.Tr
                        key={`item-${item.id}`}
                        style={{ verticalAlign: 'top' }}
                      >
                        <Table.Td
                          ta='center'
                          py={8}
                          px={lgScreenAndBelow ? 'xs' : 'sm'}
                        >
                          <Switch
                            checked={isIncluded}
                            onChange={(event) =>
                              form.setFieldValue(
                                `items.${index}.included`,
                                event.currentTarget.checked
                              )
                            }
                            size='sm'
                            radius='md'
                            color='var(--mantine-color-primary-9)'
                          />
                        </Table.Td>
                        <Table.Td py={8} px={lgScreenAndBelow ? 'xs' : 'sm'}>
                          <NumberInput
                            size={lgScreenAndBelow ? 'sm' : 'md'}
                            variant='unstyled'
                            value={item?.stock_no}
                            readOnly
                          />
                        </Table.Td>
                        <Table.Td py={8} px={lgScreenAndBelow ? 'xs' : 'sm'}>
                          <TextInput
                            variant='unstyled'
                            placeholder='-'
                            defaultValue={item.unit}
                            size={lgScreenAndBelow ? 'sm' : 'md'}
                            readOnly
                          />
                        </Table.Td>
                        <Table.Td py={8} px={lgScreenAndBelow ? 'xs' : 'sm'}>
                          <TextInput
                            key={form.key(`items.${index}.name`)}
                            {...form.getInputProps(`items.${index}.name`)}
                            placeholder='Enter supply name...'
                            defaultValue={item.name}
                            size={lgScreenAndBelow ? 'sm' : 'md'}
                            mb={4}
                            disabled={!isIncluded}
                            sx={{
                              borderBottom: isIncluded
                                ? '1px solid var(--mantine-color-gray-5)'
                                : undefined,
                            }}
                          />
                          <Textarea
                            key={form.key(`items.${index}.description`)}
                            {...form.getInputProps(
                              `items.${index}.description`
                            )}
                            placeholder='Enter description...'
                            defaultValue={item.description}
                            size={lgScreenAndBelow ? 'sm' : 'md'}
                            autosize
                            minRows={1}
                            disabled={!isIncluded}
                          />
                        </Table.Td>
                        <Table.Td py={8} px={lgScreenAndBelow ? 'xs' : 'sm'}>
                          <NumberInput
                            size={lgScreenAndBelow ? 'sm' : 'md'}
                            variant='unstyled'
                            value={item?.quantity}
                            readOnly
                          />
                        </Table.Td>
                        <Table.Td py={8} px={lgScreenAndBelow ? 'xs' : 'sm'}>
                          <Select
                            key={form.key(
                              `items.${index}.item_classification_id`
                            )}
                            {...form.getInputProps(
                              `items.${index}.item_classification_id`
                            )}
                            size={lgScreenAndBelow ? 'sm' : 'md'}
                            data={classificationData}
                            placeholder='Select'
                            searchable
                            clearable
                            disabled={!isIncluded}
                            sx={{
                              borderBottom: isIncluded
                                ? '1px solid var(--mantine-color-gray-5)'
                                : undefined,
                            }}
                          />
                        </Table.Td>
                        <Table.Td py={8} px={lgScreenAndBelow ? 'xs' : 'sm'}>
                          <Select
                            key={form.key(`items.${index}.required_document`)}
                            {...form.getInputProps(
                              `items.${index}.required_document`
                            )}
                            size={lgScreenAndBelow ? 'sm' : 'md'}
                            data={requiredDocumentOptions}
                            placeholder='Select'
                            searchable
                            clearable
                            disabled={!isIncluded}
                            sx={{
                              borderBottom: isIncluded
                                ? '1px solid var(--mantine-color-gray-5)'
                                : undefined,
                            }}
                          />
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
              </Table.Tbody>
            </Table>
          </Stack>
        </Card>
      </Stack>
    </form>
  );
});

InspectContent.displayName = 'InspectContent';

export default InspectContent;
