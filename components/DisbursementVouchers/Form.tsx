import {
  Alert,
  Card,
  Checkbox,
  Flex,
  Group,
  NumberFormatter,
  NumberInput,
  Stack,
  Table,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import React, {
  forwardRef,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';
import DynamicSelect from '../Generic/DynamicSelect';
import { useForm } from '@mantine/form';
import { randomId, useMediaQuery } from '@mantine/hooks';
import {
  IconAsterisk,
  IconCalendar,
  IconExclamationCircleFilled,
} from '@tabler/icons-react';
import { DateInput } from '@mantine/dates';
import API from '@/libs/API';
import { notify } from '@/libs/Notification';
import Helper from '@/utils/Helpers';

const itemHeaders: PurchaseRequestItemHeader[] = [
  {
    id: 'explanation',
    label: 'Explanation',
    width: '80%',
    required: true,
  },
  {
    id: 'amount',
    label: 'Amount',
    width: '20%',
  },
];

const FormClient = forwardRef<
  HTMLFormElement,
  ModalDisbursementVoucherContentProps
>(({ data, readOnly, handleCreateUpdate }, ref) => {
  const lgScreenAndBelow = useMediaQuery('(max-width: 900px)');
  const [currentData, setCurrentData] = useState(data);
  const currentForm = useMemo(
    () => ({
      dv_no: currentData?.dv_no ?? '',
      mode_payment: currentData?.mode_payment,
      payee_id: currentData?.payee_id ?? '',
      address: currentData?.address ?? '',
      office: currentData?.office ?? '',
      responsibility_center_id: currentData?.responsibility_center_id ?? '',
      explanation: currentData?.explanation ?? '',
      total_amount: currentData.total_amount,
      accountant_certified_choices:
        currentData?.accountant_certified_choices ?? {
          allotment_obligated: false,
          document_complete: false,
        },
      sig_accountant_id: currentData?.sig_accountant_id ?? '',
      accountant_signed_date: currentData?.accountant_signed_date ?? '',
      sig_treasurer_id: currentData?.sig_treasurer_id ?? '',
      treasurer_signed_date: currentData?.treasurer_signed_date ?? '',
      sig_head_id: currentData?.sig_head_id ?? '',
      head_signed_date: currentData?.head_signed_date ?? '',
      check_no: currentData?.check_no ?? '',
      bank_name: currentData?.bank_name ?? '',
      check_date: currentData?.check_date ?? '',
      received_name: currentData?.received_name ?? '',
      received_date: currentData?.received_date ?? '',
      or_other_document: currentData?.or_other_document ?? '',
      jev_no: currentData?.jev_no ?? '',
      jev_date: currentData?.jev_date ?? '',
    }),
    [currentData]
  );
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: currentForm,
  });
  const [modePayment, setModePayment] = useState<
    'check' | 'cash' | 'other' | undefined
  >(currentForm?.mode_payment);
  const [totalAmount, setTotalAmount] = useState(0);
  const [
    selectedAccountantCertifiedChoices,
    setSelectedAccountantCertifiedChoices,
  ] = useState<string[]>([]);
  const [loadingCompany, setLoadingCompany] = useState(false);
  const [loadingResponsibilityCenter, setLoadingResponsibilityCenter] =
    useState(false);
  const [company, setCompany] = useState<CompanyType>();
  const [responsibilityCenters, setResponsibilityCenters] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);

  useEffect(() => {
    form.reset();
    form.setValues(currentForm);
  }, [currentForm]);

  useEffect(() => {
    setCurrentData(data);
    setTotalAmount(currentData.purchase_order?.total_amount ?? 0);
    setModePayment(currentData?.mode_payment);
  }, [data]);

  useEffect(() => {
    if (Helper.empty(currentData)) return;

    const accountantCertifiedChoices =
      currentData.accountant_certified_choices ?? {};
    const accountantCertifiedChoicesKeys: (keyof typeof accountantCertifiedChoices)[] =
      ['allotment_obligated', 'document_complete'];
    const selectedCertifiedChoices = accountantCertifiedChoicesKeys.filter(
      (key) => accountantCertifiedChoices[key]
    );

    if (selectedCertifiedChoices.length) {
      setSelectedAccountantCertifiedChoices(selectedCertifiedChoices);
    }
  }, [currentData]);

  useEffect(() => {
    setLoadingCompany(true);

    let retries = 3;

    const fetch = () => {
      API.get('/companies', {
        paginated: false,
        show_all: true,
        sort_direction: 'asc',
      })
        .then((res) => {
          const company: CompanyType = res?.data?.company;
          setCompany(company);
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
            setLoadingCompany(false);
          }
        })
        .finally(() => setLoadingCompany(false));
    };

    fetch();
  }, []);

  useEffect(() => {
    setLoadingResponsibilityCenter(true);

    let retries = 3;

    const fetch = () => {
      API.get('/libraries/responsibility-centers', {
        paginated: false,
        show_all: true,
        sort_direction: 'asc',
      })
        .then((res) => {
          setResponsibilityCenters(
            res?.data?.length > 0
              ? res.data?.map((item: any) => ({
                  value: item['id'],
                  label: item['description']
                    ? `${item['code']}: ${item['description']}`
                    : item['code'],
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
            setLoadingResponsibilityCenter(false);
          }
        })
        .finally(() => setLoadingResponsibilityCenter(false));
    };

    fetch();
  }, []);

  const renderDynamicTdContent = (id: string): ReactNode => {
    switch (id) {
      case 'explanation':
        return (
          <Table.Td>
            <Textarea
              key={form.key('explanation')}
              {...form.getInputProps('explanation')}
              variant={readOnly ? 'unstyled' : 'default'}
              placeholder={readOnly ? 'None' : 'Enter explanation here...'}
              defaultValue={form?.values?.explanation}
              size={lgScreenAndBelow ? 'sm' : 'md'}
              autosize
              required={!readOnly}
              readOnly={readOnly}
            />
          </Table.Td>
        );

      case 'amount':
        return (
          <Table.Td>
            <Stack>
              <NumberInput
                variant={readOnly ? 'unstyled' : 'filled'}
                placeholder={'Amount'}
                value={currentData.purchase_order?.total_amount}
                size={lgScreenAndBelow ? 'sm' : 'md'}
                min={0}
                clampBehavior={'strict'}
                decimalScale={2}
                fixedDecimalScale
                thousandSeparator={','}
                readOnly
              />
            </Stack>
          </Table.Td>
        );

      default:
        return <></>;
    }
  };

  return (
    <form
      ref={ref}
      onSubmit={form.onSubmit((values) => {
        if (handleCreateUpdate) {
          handleCreateUpdate({
            ...values,
            accountant_certified_choices: {
              allotment_obligated: selectedAccountantCertifiedChoices.includes(
                'allotment_obligated'
              ),
              document_complete:
                selectedAccountantCertifiedChoices.includes(
                  'document_complete'
                ),
            },
            mode_payment: modePayment,
            total_amount: totalAmount,
          });
        }
      })}
    >
      <Stack justify={'center'}>
        {['disapproved', 'draft'].includes(currentData?.status ?? '') &&
          currentData?.disapproved_reason && (
            <Alert
              variant='light'
              color={'var(--mantine-color-red-9)'}
              title='Reason for Disapproval'
              icon={<IconExclamationCircleFilled size={24} />}
            >
              {currentData.disapproved_reason}
            </Alert>
          )}

        <Card
          shadow={'xs'}
          padding={lgScreenAndBelow ? 'md' : 'lg'}
          radius={'xs'}
          withBorder
        >
          <Stack
            bd={'1px solid var(--mantine-color-gray-8)'}
            justify={'center'}
            align={'center'}
            flex={lgScreenAndBelow ? 1 : '0 0 70%'}
            p={lgScreenAndBelow ? 'sm' : 'md'}
            gap={3}
          >
            <Text>Republic of the Philippines</Text>
            <Title order={lgScreenAndBelow ? 5 : 4}>
              {!Helper.empty(company) || loadingCompany
                ? `Province of ${company?.province ?? '________'}`
                : 'Loading...'}
            </Title>
            <Title order={lgScreenAndBelow ? 3 : 2}>
              {!Helper.empty(company) || loadingCompany
                ? (company?.municipality ?? '________')
                : 'Loading...'}
            </Title>
          </Stack>

          <Flex
            direction={lgScreenAndBelow ? 'column' : 'row'}
            sx={{ flexGrow: 1 }}
          >
            <Stack
              bd={'1px solid var(--mantine-color-gray-8)'}
              justify={'center'}
              align={'center'}
              flex={lgScreenAndBelow ? 1 : '0 0 60%'}
              py={3}
            >
              <Text size={lgScreenAndBelow ? 'lg' : 'xl'}>
                DISBURSEMENT VOUCHER
              </Text>
            </Stack>
            <Stack
              bd={'1px solid var(--mantine-color-gray-8)'}
              justify={'center'}
              align={'flex-start'}
              flex={lgScreenAndBelow ? 1 : '0 0 40%'}
              p={3}
            >
              <TextInput
                variant={'unstyled'}
                size={lgScreenAndBelow ? 'md' : 'lg'}
                value={currentData?.dv_no}
                label={'No.'}
                placeholder={'None'}
              />
            </Stack>
          </Flex>

          <Flex
            direction={lgScreenAndBelow ? 'column' : 'row'}
            sx={{ flexGrow: 1 }}
          >
            <Stack
              bd={'1px solid var(--mantine-color-gray-8)'}
              justify={'center'}
              align={'flex-start'}
              flex={lgScreenAndBelow ? 1 : '0 0 15%'}
              p={'sm'}
            >
              <Text size={lgScreenAndBelow ? 'sm' : 'md'}>Mode of Payment</Text>
            </Stack>
            <Stack
              bd={'1px solid var(--mantine-color-gray-8)'}
              justify={'center'}
              align={'flex-start'}
              flex={lgScreenAndBelow ? 1 : '0 0 85%'}
              p={lgScreenAndBelow ? 'sm' : 'md'}
            >
              <Flex
                w={'100%'}
                direction={lgScreenAndBelow ? 'column' : 'row'}
                gap={'sm'}
              >
                <Checkbox
                  label='Check'
                  size={lgScreenAndBelow ? 'sm' : 'md'}
                  variant='outline'
                  radius='xl'
                  checked={modePayment === 'check'}
                  flex={1}
                  onChange={(e) => {
                    !readOnly &&
                      setModePayment(
                        e.currentTarget.checked ? 'check' : undefined
                      );
                  }}
                />
                <Checkbox
                  label='Cash'
                  size={lgScreenAndBelow ? 'sm' : 'md'}
                  variant='outline'
                  radius='xl'
                  checked={modePayment === 'cash'}
                  flex={1}
                  onChange={(e) => {
                    !readOnly &&
                      setModePayment(
                        e.currentTarget.checked ? 'cash' : undefined
                      );
                  }}
                />
                <Checkbox
                  label='Other'
                  size={lgScreenAndBelow ? 'sm' : 'md'}
                  variant='outline'
                  radius='xl'
                  checked={modePayment === 'other'}
                  flex={1}
                  onChange={(e) => {
                    !readOnly &&
                      setModePayment(
                        e.currentTarget.checked ? 'other' : undefined
                      );
                  }}
                />
              </Flex>
            </Stack>
          </Flex>

          <Flex
            direction={lgScreenAndBelow ? 'column' : 'row'}
            sx={{ flexGrow: 1 }}
          >
            <Stack
              bd={'1px solid var(--mantine-color-gray-8)'}
              justify={'center'}
              align={'flex-start'}
              flex={lgScreenAndBelow ? 1 : '0 0 15%'}
              p={'sm'}
            >
              <Group gap={1} align={'flex-start'}>
                <Text size={lgScreenAndBelow ? 'sm' : 'md'}>Payee</Text>
              </Group>
            </Stack>
            <Stack
              bd={'1px solid var(--mantine-color-gray-8)'}
              justify={'center'}
              align={'flex-start'}
              flex={lgScreenAndBelow ? 1 : '0 0 35%'}
              p={'sm'}
            >
              <TextInput
                variant={!readOnly ? 'filled' : 'unstyled'}
                placeholder={'None'}
                value={currentData?.payee?.supplier_name ?? ''}
                size={lgScreenAndBelow ? 'sm' : 'md'}
                w={'100%'}
                my={0}
                sx={{
                  borderBottom: '2px solid var(--mantine-color-gray-5)',
                  input: {
                    width: '100%',
                  },
                }}
                readOnly
              />
            </Stack>
            <Stack
              bd={'1px solid var(--mantine-color-gray-8)'}
              justify={'center'}
              align={'flex-start'}
              flex={lgScreenAndBelow ? 1 : '0 0 25%'}
              p={'sm'}
            >
              <TextInput
                variant={!readOnly ? 'filled' : 'unstyled'}
                placeholder={'None'}
                label={'TIN/Employee No.'}
                value={currentData?.payee?.tin_no ?? ''}
                size={lgScreenAndBelow ? 'sm' : 'md'}
                w={'100%'}
                sx={{
                  borderBottom: '2px solid var(--mantine-color-gray-5)',
                  input: {
                    minHeight: '30px',
                    height: '30px',
                    width: '100%',
                  },
                }}
                readOnly
              />
            </Stack>
            <Stack
              bd={'1px solid var(--mantine-color-gray-8)'}
              justify={'center'}
              align={'flex-start'}
              flex={lgScreenAndBelow ? 1 : '0 0 25%'}
              p={'sm'}
            >
              <TextInput
                variant={!readOnly ? 'filled' : 'unstyled'}
                placeholder={'None'}
                label={'Obligation Request No.'}
                value={currentData?.obligation_request?.obr_no ?? ''}
                size={lgScreenAndBelow ? 'sm' : 'md'}
                w={'100%'}
                sx={{
                  borderBottom: '2px solid var(--mantine-color-gray-5)',
                  input: {
                    minHeight: '30px',
                    height: '30px',
                    width: '100%',
                  },
                }}
                readOnly
              />
            </Stack>
          </Flex>

          <Flex
            direction={lgScreenAndBelow ? 'column' : 'row'}
            sx={{ flexGrow: 1 }}
          >
            <Stack
              bd={'1px solid var(--mantine-color-gray-8)'}
              justify={'center'}
              align={'flex-start'}
              flex={lgScreenAndBelow ? 1 : '0 0 15%'}
              p={'sm'}
            >
              <Text size={lgScreenAndBelow ? 'sm' : 'md'}>Address</Text>
            </Stack>
            <Stack
              bd={'1px solid var(--mantine-color-gray-8)'}
              justify={'center'}
              align={'flex-start'}
              flex={lgScreenAndBelow ? 1 : '0 0 35%'}
              p={'sm'}
            >
              <Textarea
                key={form.key('address')}
                {...form.getInputProps('address')}
                variant={'unstyled'}
                placeholder={'Enter the address here...'}
                defaultValue={readOnly ? undefined : form.values.address}
                value={readOnly ? currentData?.address : undefined}
                error={form.errors.purpose && ''}
                size={lgScreenAndBelow ? 'sm' : 'md'}
                w={'100%'}
                sx={{
                  borderBottom: '2px solid var(--mantine-color-gray-5)',
                  input: {
                    minHeight: '30px',
                    height: '30px',
                  },
                }}
                autosize
                autoCapitalize={'sentences'}
                readOnly={readOnly}
              />
            </Stack>
            <Stack
              bd={'1px solid var(--mantine-color-gray-8)'}
              justify={'center'}
              align={'flex-start'}
              flex={lgScreenAndBelow ? 1 : '0 0 30%'}
              p={'sm'}
            >
              <TextInput
                key={form.key('office')}
                {...form.getInputProps('office')}
                variant={'unstyled'}
                label={'Office/Unit/Project:'}
                placeholder={!readOnly ? 'Enter the office here...' : 'None'}
                defaultValue={readOnly ? undefined : form.values.office}
                value={readOnly ? currentData?.office : undefined}
                error={form.errors.sai_no && ''}
                size={lgScreenAndBelow ? 'sm' : 'md'}
                sx={{
                  borderBottom: '2px solid var(--mantine-color-gray-5)',
                  input: {
                    minHeight: '30px',
                    height: '30px',
                  },
                }}
                w={'100%'}
                readOnly={readOnly}
              />
            </Stack>
            <Stack
              bd={'1px solid var(--mantine-color-gray-8)'}
              justify={'center'}
              align={'flex-start'}
              flex={lgScreenAndBelow ? 1 : '0 0 20%'}
              p={'sm'}
            >
              {!readOnly ? (
                <DynamicSelect
                  key={form.key('responsibility_center_id')}
                  {...form.getInputProps('responsibility_center_id')}
                  variant={'unstyled'}
                  placeholder={'Select a responsibility center...'}
                  label={'Responsibility Code:'}
                  endpoint={'/libraries/responsibility-centers'}
                  endpointParams={{ paginated: false, show_all: true }}
                  column={'code'}
                  defaultData={
                    responsibilityCenters ??
                    (currentData.responsibility_center_id
                      ? [
                          {
                            value: currentData.responsibility_center_id,
                            label: currentData.responsibility_center
                              ?.description
                              ? `${currentData.responsibility_center?.code}: ${currentData.responsibility_center?.description}`
                              : currentData.responsibility_center?.code,
                          },
                        ]
                      : undefined)
                  }
                  value={form.values.responsibility_center_id}
                  size={lgScreenAndBelow ? 'sm' : 'md'}
                  sx={{
                    width: '100%',
                    borderBottom: '2px solid var(--mantine-color-gray-5)',
                    input: {
                      minHeight: '30px',
                      height: '30px',
                    },
                  }}
                  required={!readOnly}
                  readOnly={readOnly}
                  isLoading={loadingResponsibilityCenter}
                />
              ) : (
                <TextInput
                  variant={'unstyled'}
                  placeholder={'None'}
                  label={'Code:'}
                  defaultValue={
                    currentData.responsibility_center?.description
                      ? `${currentData.responsibility_center?.code}: ${currentData.responsibility_center?.description}`
                      : currentData.responsibility_center?.code
                  }
                  sx={{
                    borderBottom: '2px solid var(--mantine-color-gray-5)',
                    input: {
                      minHeight: '30px',
                      height: '30px',
                    },
                  }}
                  size={lgScreenAndBelow ? 'sm' : 'md'}
                  flex={1}
                  readOnly
                />
              )}
            </Stack>
          </Flex>

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
                <Table.Tr>
                  {itemHeaders.map((header) => {
                    return (
                      <Table.Th
                        key={header.id}
                        w={header?.width ?? undefined}
                        fz={lgScreenAndBelow ? 'sm' : 'md'}
                      >
                        <Group gap={1} align={'flex-start'}>
                          {header.label}{' '}
                          {header?.required && !readOnly && (
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
              </Table.Thead>
              <Table.Tbody>
                <Table.Tr sx={{ verticalAlign: 'top' }}>
                  {itemHeaders.map((header) => {
                    return (
                      <React.Fragment key={`field-${header.id}`}>
                        {renderDynamicTdContent(header.id)}
                      </React.Fragment>
                    );
                  })}
                </Table.Tr>

                <Table.Tr>
                  <Table.Td>
                    <Text ta={'right'} size={lgScreenAndBelow ? 'sm' : 'md'}>
                      Amount Due
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <NumberInput
                      variant={readOnly ? 'unstyled' : 'default'}
                      placeholder={'Amount'}
                      value={totalAmount}
                      size={lgScreenAndBelow ? 'sm' : 'md'}
                      min={0}
                      clampBehavior={'strict'}
                      decimalScale={2}
                      fixedDecimalScale
                      thousandSeparator={','}
                      onChange={(value) => setTotalAmount(value as number)}
                      readOnly={readOnly}
                    />
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </Stack>

          <Flex
            direction={lgScreenAndBelow ? 'column' : 'row'}
            sx={{ flexGrow: 1 }}
          >
            <Stack
              bd={'1px solid var(--mantine-color-gray-8)'}
              justify={'space-between'}
              align={'flex-start'}
              flex={lgScreenAndBelow ? 1 : '0 0 50%'}
              p={lgScreenAndBelow ? 'sm' : 'md'}
            >
              <Stack gap={1}>
                <Text size={lgScreenAndBelow ? 'sm' : 'md'}>A. Certified:</Text>
                <Checkbox.Group
                  value={selectedAccountantCertifiedChoices}
                  size={lgScreenAndBelow ? 'sm' : 'md'}
                  onChange={setSelectedAccountantCertifiedChoices}
                  readOnly={readOnly}
                >
                  <Group mt='xs'>
                    <Stack>
                      <Checkbox
                        value='allotment_obligated'
                        label='Allotment obligated for the purpose as indicated above'
                        radius={'xl'}
                        variant={'outline'}
                      />
                      <Checkbox
                        value='document_complete'
                        label='Supporting documents complete and proper'
                        radius={'xl'}
                        variant={'outline'}
                      />
                    </Stack>
                  </Group>
                </Checkbox.Group>
              </Stack>

              <Stack w={'100%'} mt={'md'}>
                {!readOnly ? (
                  <DynamicSelect
                    key={form.key('sig_accountant_id')}
                    {...form.getInputProps('sig_accountant_id')}
                    variant={'unstyled'}
                    label={'Head, Accounting Unit/ Authorized Representative:'}
                    placeholder={!readOnly ? 'Select a signatory...' : 'None'}
                    endpoint={'/libraries/signatories'}
                    endpointParams={{
                      paginated: false,
                      show_all: true,
                      document: 'dv',
                      signatory_type: 'accountant',
                    }}
                    defaultData={
                      currentData?.sig_accountant_id
                        ? [
                            {
                              value: currentData?.sig_accountant_id ?? '',
                              label:
                                currentData?.signatory_head?.user?.fullname ??
                                '',
                            },
                          ]
                        : undefined
                    }
                    valueColumn={'signatory_id'}
                    column={'fullname_designation'}
                    value={form.values.sig_accountant_id}
                    size={lgScreenAndBelow ? 'sm' : 'md'}
                    sx={{
                      borderBottom: '2px solid var(--mantine-color-gray-5)',
                    }}
                    required={!readOnly}
                    readOnly={readOnly}
                  />
                ) : (
                  <TextInput
                    label={'Head, Accounting Unit/ Authorized Representative:'}
                    variant={'unstyled'}
                    placeholder={'None'}
                    value={
                      currentData?.signatory_accountant?.user?.fullname ?? ''
                    }
                    size={lgScreenAndBelow ? 'sm' : 'md'}
                    sx={{
                      borderBottom: '2px solid var(--mantine-color-gray-5)',
                    }}
                    readOnly
                  />
                )}

                <DateInput
                  key={form.key('accountant_signed_date')}
                  {...form.getInputProps('accountant_signed_date')}
                  variant={'unstyled'}
                  label={'Date'}
                  valueFormat={'YYYY-MM-DD'}
                  defaultValue={
                    readOnly
                      ? undefined
                      : form.values.accountant_signed_date
                        ? new Date(form.values.accountant_signed_date)
                        : undefined
                  }
                  value={
                    readOnly
                      ? currentData?.accountant_signed_date
                        ? new Date(currentData?.accountant_signed_date)
                        : undefined
                      : undefined
                  }
                  placeholder={
                    readOnly
                      ? 'None'
                      : 'Enter the accountant signed date here...'
                  }
                  error={form.errors.accountant_signed_date && ''}
                  flex={1}
                  size={lgScreenAndBelow ? 'sm' : 'md'}
                  leftSection={
                    !readOnly ? <IconCalendar size={18} /> : undefined
                  }
                  clearable
                  sx={{
                    borderBottom: '2px solid var(--mantine-color-gray-5)',
                  }}
                  readOnly={readOnly}
                />
              </Stack>
            </Stack>
            <Stack
              bd={'1px solid var(--mantine-color-gray-8)'}
              justify={'space-between'}
              align={'flex-start'}
              flex={lgScreenAndBelow ? 1 : '0 0 50%'}
              p={lgScreenAndBelow ? 'sm' : 'md'}
              gap={1}
            >
              <Text size={lgScreenAndBelow ? 'sm' : 'md'}>
                B. Certified:
                <br />
                Funds Available
              </Text>

              <Stack w={'100%'} mt={'md'}>
                {!readOnly ? (
                  <DynamicSelect
                    key={form.key('sig_treasurer_id')}
                    {...form.getInputProps('sig_treasurer_id')}
                    variant={'unstyled'}
                    label={'Treasurer/Authorized Representative:'}
                    placeholder={!readOnly ? 'Select a signatory...' : 'None'}
                    endpoint={'/libraries/signatories'}
                    endpointParams={{
                      paginated: false,
                      show_all: true,
                      document: 'dv',
                      signatory_type: 'treasurer',
                    }}
                    defaultData={
                      currentData?.sig_treasurer_id
                        ? [
                            {
                              value: currentData?.sig_treasurer_id ?? '',
                              label:
                                currentData?.signatory_treasurer?.user
                                  ?.fullname ?? '',
                            },
                          ]
                        : undefined
                    }
                    valueColumn={'signatory_id'}
                    column={'fullname_designation'}
                    value={form.values.sig_treasurer_id}
                    size={lgScreenAndBelow ? 'sm' : 'md'}
                    sx={{
                      borderBottom: '2px solid var(--mantine-color-gray-5)',
                    }}
                    required={!readOnly}
                    readOnly={readOnly}
                  />
                ) : (
                  <TextInput
                    label={'Treasurer/Authorized Representative:'}
                    variant={'unstyled'}
                    placeholder={'None'}
                    value={
                      currentData?.signatory_treasurer?.user?.fullname ?? ''
                    }
                    size={lgScreenAndBelow ? 'sm' : 'md'}
                    sx={{
                      borderBottom: '2px solid var(--mantine-color-gray-5)',
                    }}
                    readOnly
                  />
                )}

                <DateInput
                  key={form.key('treasurer_signed_date')}
                  {...form.getInputProps('treasurer_signed_date')}
                  variant={'unstyled'}
                  label={'Date'}
                  valueFormat={'YYYY-MM-DD'}
                  defaultValue={
                    readOnly
                      ? undefined
                      : form.values.treasurer_signed_date
                        ? new Date(form.values.treasurer_signed_date)
                        : undefined
                  }
                  value={
                    readOnly
                      ? currentData?.treasurer_signed_date
                        ? new Date(currentData?.treasurer_signed_date)
                        : undefined
                      : undefined
                  }
                  placeholder={
                    readOnly
                      ? 'None'
                      : 'Enter the treasurer signed date here...'
                  }
                  error={form.errors.treasurer_signed_date && ''}
                  flex={1}
                  size={lgScreenAndBelow ? 'sm' : 'md'}
                  leftSection={
                    !readOnly ? <IconCalendar size={18} /> : undefined
                  }
                  clearable
                  sx={{
                    borderBottom: '2px solid var(--mantine-color-gray-5)',
                  }}
                  readOnly={readOnly}
                />
              </Stack>
            </Stack>
          </Flex>

          <Flex
            direction={lgScreenAndBelow ? 'column' : 'row'}
            sx={{ flexGrow: 1 }}
          >
            <Stack
              bd={'1px solid var(--mantine-color-gray-8)'}
              justify={'flex-start'}
              align={'flex-start'}
              flex={lgScreenAndBelow ? 1 : '0 0 50%'}
              p={lgScreenAndBelow ? 'sm' : 'md'}
            >
              <Stack gap={1}>
                <Text size={lgScreenAndBelow ? 'sm' : 'md'}>
                  C. Approved for Payment:
                </Text>
              </Stack>

              <Stack w={'100%'} mt={'md'}>
                {!readOnly ? (
                  <DynamicSelect
                    key={form.key('sig_head_id')}
                    {...form.getInputProps('sig_head_id')}
                    variant={'unstyled'}
                    label={'Agency Head / Authorized Representative:'}
                    placeholder={!readOnly ? 'Select a signatory...' : 'None'}
                    endpoint={'/libraries/signatories'}
                    endpointParams={{
                      paginated: false,
                      show_all: true,
                      document: 'dv',
                      signatory_type: 'head',
                    }}
                    defaultData={
                      currentData?.sig_head_id
                        ? [
                            {
                              value: currentData?.sig_head_id ?? '',
                              label:
                                currentData?.signatory_head?.user?.fullname ??
                                '',
                            },
                          ]
                        : undefined
                    }
                    valueColumn={'signatory_id'}
                    column={'fullname_designation'}
                    value={form.values.sig_head_id}
                    size={lgScreenAndBelow ? 'sm' : 'md'}
                    sx={{
                      borderBottom: '2px solid var(--mantine-color-gray-5)',
                    }}
                    required={!readOnly}
                    readOnly={readOnly}
                  />
                ) : (
                  <TextInput
                    label={'Agency Head / Authorized Representative:'}
                    variant={'unstyled'}
                    placeholder={'None'}
                    value={currentData?.signatory_head?.user?.fullname ?? ''}
                    size={lgScreenAndBelow ? 'sm' : 'md'}
                    sx={{
                      borderBottom: '2px solid var(--mantine-color-gray-5)',
                    }}
                    readOnly
                  />
                )}

                <DateInput
                  key={form.key('head_signed_date')}
                  {...form.getInputProps('head_signed_date')}
                  variant={'unstyled'}
                  label={'Date'}
                  valueFormat={'YYYY-MM-DD'}
                  defaultValue={
                    readOnly
                      ? undefined
                      : form.values.head_signed_date
                        ? new Date(form.values.head_signed_date)
                        : undefined
                  }
                  value={
                    readOnly
                      ? currentData?.head_signed_date
                        ? new Date(currentData?.head_signed_date)
                        : undefined
                      : undefined
                  }
                  placeholder={
                    readOnly ? 'None' : 'Enter the head signed date here...'
                  }
                  error={form.errors.head_signed_date && ''}
                  flex={1}
                  size={lgScreenAndBelow ? 'sm' : 'md'}
                  leftSection={
                    !readOnly ? <IconCalendar size={18} /> : undefined
                  }
                  clearable
                  sx={{
                    borderBottom: '2px solid var(--mantine-color-gray-5)',
                  }}
                  w={'100%'}
                  readOnly={readOnly}
                />
              </Stack>
            </Stack>
            <Stack
              bd={'1px solid var(--mantine-color-gray-8)'}
              justify={'flex-start'}
              align={'flex-start'}
              flex={lgScreenAndBelow ? 1 : '0 0 50%'}
              p={lgScreenAndBelow ? 'sm' : 'md'}
              gap={'xs'}
            >
              <Stack gap={1}>
                <Text size={lgScreenAndBelow ? 'sm' : 'md'}>
                  D. Received Payment:
                </Text>
              </Stack>

              <Stack w={'100%'} gap={0}>
                <Flex
                  direction={lgScreenAndBelow ? 'column' : 'row'}
                  sx={{
                    flexGrow: 1,
                    margin: lgScreenAndBelow ? '0px -13px' : '0 -17px 0 -17px',
                  }}
                >
                  <Stack
                    bd={'1px solid var(--mantine-color-gray-8)'}
                    justify={'center'}
                    align={'flex-start'}
                    flex={lgScreenAndBelow ? 1 : '0 0 30%'}
                    p={'sm'}
                  >
                    <TextInput
                      key={form.key('check_no')}
                      {...form.getInputProps('check_no')}
                      variant={!readOnly ? 'default' : 'unstyled'}
                      label={'Check No.'}
                      placeholder={
                        !readOnly ? 'Enter the check no. here...' : 'None'
                      }
                      defaultValue={readOnly ? undefined : form.values.check_no}
                      value={readOnly ? currentData?.check_no : undefined}
                      error={form.errors.check_no && ''}
                      size={lgScreenAndBelow ? 'sm' : 'md'}
                      w={'100%'}
                      readOnly={readOnly}
                    />
                  </Stack>
                  <Stack
                    bd={'1px solid var(--mantine-color-gray-8)'}
                    justify={'center'}
                    align={'flex-start'}
                    flex={lgScreenAndBelow ? 1 : '0 0 40%'}
                    p={'sm'}
                  >
                    <TextInput
                      key={form.key('bank_name')}
                      {...form.getInputProps('bank_name')}
                      variant={!readOnly ? 'default' : 'unstyled'}
                      label={'Bank Name'}
                      placeholder={
                        !readOnly ? 'Enter the bank name here...' : 'None'
                      }
                      defaultValue={
                        readOnly ? undefined : form.values.bank_name
                      }
                      value={readOnly ? currentData?.bank_name : undefined}
                      error={form.errors.bank_name && ''}
                      size={lgScreenAndBelow ? 'sm' : 'md'}
                      w={'100%'}
                      readOnly={readOnly}
                    />
                  </Stack>
                  <Stack
                    bd={'1px solid var(--mantine-color-gray-8)'}
                    justify={'center'}
                    align={'flex-start'}
                    flex={lgScreenAndBelow ? 1 : '0 0 30%'}
                    p={'sm'}
                  >
                    <DateInput
                      key={form.key('check_date')}
                      {...form.getInputProps('check_date')}
                      variant={!readOnly ? 'default' : 'unstyled'}
                      label={'Check Date'}
                      valueFormat={'YYYY-MM-DD'}
                      defaultValue={
                        readOnly
                          ? undefined
                          : form.values.check_date
                            ? new Date(form.values.check_date)
                            : undefined
                      }
                      value={
                        readOnly
                          ? currentData?.check_date
                            ? new Date(currentData?.check_date)
                            : undefined
                          : undefined
                      }
                      placeholder={
                        readOnly ? 'None' : 'Enter the check date here...'
                      }
                      error={form.errors.check_date && ''}
                      flex={1}
                      size={lgScreenAndBelow ? 'sm' : 'md'}
                      leftSection={
                        !readOnly ? <IconCalendar size={18} /> : undefined
                      }
                      w={'100%'}
                      clearable
                      readOnly={readOnly}
                    />
                  </Stack>
                </Flex>

                <Flex
                  direction={lgScreenAndBelow ? 'column' : 'row'}
                  sx={{
                    flexGrow: 1,
                    margin: lgScreenAndBelow ? '0px -13px' : '0 -17px 0 -17px',
                  }}
                >
                  <Stack
                    bd={'1px solid var(--mantine-color-gray-8)'}
                    justify={'center'}
                    align={'flex-start'}
                    flex={lgScreenAndBelow ? 1 : '0 0 70%'}
                    p={'sm'}
                  >
                    <TextInput
                      key={form.key('received_name')}
                      {...form.getInputProps('received_name')}
                      variant={!readOnly ? 'default' : 'unstyled'}
                      label={'Printed Name'}
                      placeholder={
                        !readOnly ? 'Enter the printed name here...' : 'None'
                      }
                      defaultValue={
                        readOnly ? undefined : form.values.received_name
                      }
                      value={readOnly ? currentData?.received_name : undefined}
                      error={form.errors.received_name && ''}
                      size={lgScreenAndBelow ? 'sm' : 'md'}
                      w={'100%'}
                      readOnly={readOnly}
                    />
                  </Stack>
                  <Stack
                    bd={'1px solid var(--mantine-color-gray-8)'}
                    justify={'center'}
                    align={'flex-start'}
                    flex={lgScreenAndBelow ? 1 : '0 0 30%'}
                    p={'sm'}
                  >
                    <DateInput
                      key={form.key('received_date')}
                      {...form.getInputProps('received_date')}
                      variant={!readOnly ? 'default' : 'unstyled'}
                      label={'Received Date'}
                      valueFormat={'YYYY-MM-DD'}
                      defaultValue={
                        readOnly
                          ? undefined
                          : form.values.received_date
                            ? new Date(form.values.received_date)
                            : undefined
                      }
                      value={
                        readOnly
                          ? currentData?.received_date
                            ? new Date(currentData?.received_date)
                            : undefined
                          : undefined
                      }
                      placeholder={
                        readOnly ? 'None' : 'Enter the received date here...'
                      }
                      error={form.errors.received_date && ''}
                      flex={1}
                      size={lgScreenAndBelow ? 'sm' : 'md'}
                      leftSection={
                        !readOnly ? <IconCalendar size={18} /> : undefined
                      }
                      w={'100%'}
                      clearable
                      readOnly={readOnly}
                    />
                  </Stack>
                </Flex>

                <Flex
                  direction={lgScreenAndBelow ? 'column' : 'row'}
                  sx={{
                    flexGrow: 1,
                    margin: lgScreenAndBelow
                      ? '0px -13px -13px -13px'
                      : '0 -17px -17px -17px',
                  }}
                >
                  <Stack
                    bd={'1px solid var(--mantine-color-gray-8)'}
                    justify={'center'}
                    align={'flex-start'}
                    flex={lgScreenAndBelow ? 1 : '0 0 40%'}
                    p={'sm'}
                  >
                    <TextInput
                      key={form.key('or_other_document')}
                      {...form.getInputProps('or_other_document')}
                      variant={!readOnly ? 'default' : 'unstyled'}
                      label={'OR/Other Documents'}
                      placeholder={
                        !readOnly
                          ? 'Enter the OR or other documents here...'
                          : 'None'
                      }
                      defaultValue={
                        readOnly ? undefined : form.values.or_other_document
                      }
                      value={
                        readOnly ? currentData?.or_other_document : undefined
                      }
                      error={form.errors.or_other_document && ''}
                      size={lgScreenAndBelow ? 'sm' : 'md'}
                      w={'100%'}
                      readOnly={readOnly}
                    />
                  </Stack>
                  <Stack
                    bd={'1px solid var(--mantine-color-gray-8)'}
                    justify={'center'}
                    align={'flex-start'}
                    flex={lgScreenAndBelow ? 1 : '0 0 30%'}
                    p={'sm'}
                  >
                    <TextInput
                      key={form.key('jev_no')}
                      {...form.getInputProps('jev_no')}
                      variant={!readOnly ? 'default' : 'unstyled'}
                      label={'JEV No.'}
                      placeholder={
                        !readOnly ? 'Enter the JEV no. here...' : 'None'
                      }
                      defaultValue={readOnly ? undefined : form.values.jev_no}
                      value={readOnly ? currentData?.jev_no : undefined}
                      error={form.errors.jev_no && ''}
                      size={lgScreenAndBelow ? 'sm' : 'md'}
                      w={'100%'}
                      readOnly={readOnly}
                    />
                  </Stack>
                  <Stack
                    bd={'1px solid var(--mantine-color-gray-8)'}
                    justify={'center'}
                    align={'flex-start'}
                    flex={lgScreenAndBelow ? 1 : '0 0 30%'}
                    p={'sm'}
                  >
                    <DateInput
                      key={form.key('jev_date')}
                      {...form.getInputProps('jev_date')}
                      variant={!readOnly ? 'default' : 'unstyled'}
                      label={'JEV Date'}
                      valueFormat={'YYYY-MM-DD'}
                      defaultValue={
                        readOnly
                          ? undefined
                          : form.values.jev_date
                            ? new Date(form.values.jev_date)
                            : undefined
                      }
                      value={
                        readOnly
                          ? currentData?.jev_date
                            ? new Date(currentData?.jev_date)
                            : undefined
                          : undefined
                      }
                      placeholder={
                        readOnly ? 'None' : 'Enter the JEV date here...'
                      }
                      error={form.errors.jev_date && ''}
                      flex={1}
                      size={lgScreenAndBelow ? 'sm' : 'md'}
                      leftSection={
                        !readOnly ? <IconCalendar size={18} /> : undefined
                      }
                      w={'100%'}
                      clearable
                      readOnly={readOnly}
                    />
                  </Stack>
                </Flex>
              </Stack>
            </Stack>
          </Flex>
        </Card>
      </Stack>
    </form>
  );
});

FormClient.displayName = 'FormClient';

export default FormClient;
