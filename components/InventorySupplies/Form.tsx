import { Card, Divider, Flex, Text } from '@mantine/core';
import { Select } from '@mantine/core';
import { NumberInput, Stack, Table, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { randomId, useMediaQuery } from '@mantine/hooks';
import React, {
  forwardRef,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';
import DynamicSelect from '../Generic/DynamicSelect';
import Helper from '@/utils/Helpers';
import dayjs from 'dayjs';

const itemHeaders: PurchaseRequestItemHeader[] = [
  {
    id: 'recipient_name',
    label: 'Name',
    width: '25%',
  },
  {
    id: 'issuance_no',
    label: 'RIS No./ICS No./ARE No.',
    width: '13%',
  },
  {
    id: 'item_no',
    label: 'Inventory Item No./Property No.',
    width: '13%',
  },
  {
    id: 'acquired_date',
    label: 'Date Acquired',
    width: '12%',
  },
  {
    id: 'issued_date',
    label: 'Date Received',
    width: '12%',
  },
  {
    id: 'quantity',
    label: 'Quantity',
    width: '11%',
  },
  {
    id: 'status',
    label: 'Status',
    width: '14%',
  },
];

const FormClient = forwardRef<
  HTMLFormElement,
  ModalInventorySupplyContentProps
>(({ data, readOnly, handleCreateUpdate }, ref) => {
  const lgScreenAndBelow = useMediaQuery('(max-width: 900px)');
  const [currentData, setCurrentData] = useState(data);
  const currentForm = useMemo(() => {
    return {
      sku: currentData?.sku ?? '',
      upc: currentData?.upc ?? '',
      name: currentData?.name ?? '',
      description: currentData?.description ?? '',
      item_classification_id: currentData?.item_classification_id ?? '',
      required_document: currentData?.required_document ?? '',
      recipients: (
        currentData?.issued_items?.map((item) => ({
          key: randomId(),
          recipient_name: item.issuance?.recipient?.fullname ?? '',
          issuance_no: item.issuance?.inventory_no ?? '-',
          item_no: item.inventory_item_no ?? item.property_no ?? '-',
          acquired_date: item.acquired_date
            ? dayjs(item.acquired_date).format('YYYY-MM-DD')
            : '-',
          issued_date: item.issuance?.status_timestamps?.issued_at
            ? dayjs(item.issuance?.status_timestamps?.issued_at).format(
              'YYYY-MM-DD'
            )
            : '-',
          quantity: item.quantity ?? 0,
          status:
            item.issuance?.status === 'cancelled'
              ? 'Cancelled'
              : item.issuance?.status === 'issued'
                ? 'Issued'
                : 'Reserved',
          document_type: item.issuance?.document_type,
        })) ?? []
      ).filter(
        (recipient) =>
          recipient.status !== 'Cancelled' &&
          recipient.document_type === currentData.required_document
      ),
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

  const renderDynamicTdContent = (
    id: string,
    item: InventorySupplyRecipientsFieldType,
    index: number
  ): ReactNode => {
    switch (id) {
      case 'recipient_name':
        return <Table.Td>{item?.recipient_name}</Table.Td>;

      case 'issuance_no':
        return <Table.Td>{item?.issuance_no}</Table.Td>;

      case 'item_no':
        return <Table.Td>{item?.item_no}</Table.Td>;

      case 'acquired_date':
        return <Table.Td>{item?.acquired_date}</Table.Td>;

      case 'issued_date':
        return <Table.Td>{item?.issued_date}</Table.Td>;

      case 'quantity':
        return <Table.Td>{item?.quantity}</Table.Td>;

      case 'status':
        return <Table.Td>{item?.status}</Table.Td>;

      default:
        return <></>;
    }
  };

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
              required={!readOnly}
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
                  value={Helper.mapInventoryIssuanceDocumentType(
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

                <Flex
                  w={'100%'}
                  direction={lgScreenAndBelow ? 'column' : 'row'}
                  gap={'md'}
                >
                  <TextInput
                    variant={readOnly ? 'default' : 'filled'}
                    placeholder={'None'}
                    value={
                      readOnly ? currentData?.unit_issue?.unit_name : undefined
                    }
                    size={lgScreenAndBelow ? 'sm' : 'md'}
                    label={'Unit'}
                    flex={1}
                    readOnly
                  />
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
                </Flex>

                <Flex
                  w={'100%'}
                  direction={lgScreenAndBelow ? 'column' : 'row'}
                  gap={'md'}
                >
                  <NumberInput
                    variant={readOnly ? 'default' : 'filled'}
                    label={'Quantity'}
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
                    label={'Reserved'}
                    placeholder={'None'}
                    value={currentData?.reserved}
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
                    label={'Issued'}
                    placeholder={'None'}
                    value={currentData?.issued}
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
                h={'calc(100vh - 25em)'}
              >
                <Table verticalSpacing={'sm'} highlightOnHover withTableBorder>
                  <Table.Thead>
                    <Table.Tr>
                      {itemHeaders.map((header) => {
                        if (
                          currentData?.required_document === 'ris' &&
                          (header.id === 'item_no' ||
                            header.id === 'acquired_date')
                        )
                          return;

                        return (
                          <Table.Th
                            key={header.id}
                            w={header?.width ?? undefined}
                            fz={lgScreenAndBelow ? 'sm' : 'md'}
                            ta={header.align ?? undefined}
                          >
                            {header.id === 'issuance_no' &&
                              currentData?.required_document === 'ris' && (
                                <>RIS No.</>
                              )}

                            {header.id === 'issuance_no' &&
                              currentData?.required_document === 'ics' && (
                                <>ICS No.</>
                              )}

                            {header.id === 'issuance_no' &&
                              currentData?.required_document === 'are' && (
                                <>ARE No.</>
                              )}

                            {header.id === 'item_no' &&
                              currentData?.required_document === 'ics' && (
                                <>Inventory Item No.</>
                              )}

                            {header.id === 'item_no' &&
                              currentData?.required_document === 'are' && (
                                <>Property No.</>
                              )}

                            {header.id !== 'issuance_no' &&
                              header.id !== 'item_no' && <>{header.label}</>}
                          </Table.Th>
                        );
                      })}
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {Helper.empty(form.getValues()?.recipients) && (
                      <Table.Tr>
                        <Table.Td
                          c={'var(--mantine-color-red-5)'}
                          ta={'center'}
                          colSpan={itemHeaders?.length}
                          fz={{ base: 11, lg: 'xs', xl: 'sm' }}
                        >
                          No data.
                        </Table.Td>
                      </Table.Tr>
                    )}

                    {form.getValues()?.recipients?.map((item, index) => (
                      <Table.Tr
                        key={`item-${item.key}`}
                        sx={{ verticalAlign: 'top' }}
                      >
                        {itemHeaders.map((header) => {
                          if (
                            currentData?.required_document === 'ris' &&
                            (header.id === 'item_no' ||
                              header.id === 'acquired_date')
                          )
                            return;

                          return (
                            <React.Fragment
                              key={`field-${item.key}-${header.id}`}
                            >
                              {renderDynamicTdContent(header.id, item, index)}
                            </React.Fragment>
                          );
                        })}
                      </Table.Tr>
                    ))}
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
