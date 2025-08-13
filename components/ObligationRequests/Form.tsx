import {
  Card,
  Checkbox,
  Flex,
  Group,
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
  IconCalendar
} from '@tabler/icons-react';
import { DateInput } from '@mantine/dates';
import dayjs from 'dayjs';
import API from '@/libs/API';
import { notify } from '@/libs/Notification';
import Helper from '@/utils/Helpers';
import DynamicMultiselect from '../Generic/DynamicMultiselect';

const itemHeaders: PurchaseRequestItemHeader[] = [
  {
    id: 'responsibility_center',
    label: 'Responsibility Center',
    width: '15%',
    required: true,
  },
  {
    id: 'particulars',
    label: 'Particulars',
    width: '38%',
    required: true,
  },
  {
    id: 'fpps',
    label: 'F.P.P.',
    width: '13%',
  },
  {
    id: 'accounts',
    label: 'Account Code',
    width: '14%',
  },
  {
    id: 'amount',
    label: 'Amount',
    width: '20%',
  },
];

const FormClient = forwardRef<
  HTMLFormElement,
  ModalObligationRequestContentProps
>(({ data, readOnly, handleCreateUpdate }, ref) => {
  const lgScreenAndBelow = useMediaQuery('(max-width: 900px)');
  const [currentData, setCurrentData] = useState(data);
  const currentForm = useMemo(
    () => ({
      funding: currentData?.funding ?? {
        general: false,
        mdf_20: false,
        gf_mdrrmf_5: false,
        sef: false
      },
      payee_id: currentData?.payee_id ?? '',
      obr_no: currentData?.obr_no ?? '',
      office: currentData?.office ?? '',
      address: currentData?.address ?? '',
      responsibility_center_id: currentData?.responsibility_center_id ?? '',
      particulars: currentData?.particulars ?? '',
      total_amount: currentData.total_amount,
      compliance_status: currentData?.compliance_status ?? {
        allotment_necessary: false,
        document_valid: false
      },
      sig_head_id: currentData?.sig_head_id ?? '',
      head_signed_date: currentData?.head_signed_date ?? '',
      sig_budget_id: currentData?.sig_budget_id ?? '',
      budget_signed_date: currentData?.budget_signed_date ?? '',
      fpps: !Helper.empty(currentData?.fpps) ? currentData?.fpps?.map(fpp => fpp.fpp_id) : [],
      accounts:
        !Helper.empty(currentData?.accounts)
          ? currentData?.accounts?.map((account, index) => ({
            key: account.account_id,
            account_id: account.account_id,
            amount: account.amount
          }))
          : [],
    }),
    [currentData]
  );
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: currentForm,
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedFunds, setSelectedFunds] = useState<string[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [selectedComplianceStatus, setSelectedComplianceStatus] = useState<string[]>([]);

  const [loadingCompany, setLoadingCompany] = useState(false);
  const [loadingResponsibilityCenter, setLoadingResponsibilityCenter] = useState(false);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [company, setCompany] = useState<CompanyType>();
  const [responsibilityCenters, setResponsibilityCenters] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);
  const [accounts, setAccounts] = useState<AccountType[]>([]);

  useEffect(() => {
    form.reset();
    form.setValues(currentForm);
  }, [currentForm]);

  useEffect(() => {
    setCurrentData(data);
  }, [data]);

  useEffect(() => {
    const purchaseOrderTotalAmount = currentData.purchase_order?.total_amount as number ?? 0;
    const accountTotalAmount = form.getValues().accounts?.reduce(
      (sum, account) => sum + (account?.amount ?? 0),
      0
    ) || 0;

    setTotalAmount(
      purchaseOrderTotalAmount + accountTotalAmount
    )
  }, [currentData, form]);

  useEffect(() => {
    if (Helper.empty(currentData)) return;

    const funding = currentData.funding ?? {};
    const fundingKeys: (keyof typeof funding)[] = ['general', 'mdf_20', 'gf_mdrrmf_5', 'sef'];
    const selectedFundings = fundingKeys.filter(key => funding[key]);

    const compliance = currentData.compliance_status ?? {};
    const complianceKeys: (keyof typeof compliance)[] = ['allotment_necessary', 'document_valid'];
    const selectedCompliances = complianceKeys.filter(key => compliance[key]);

    if (selectedFundings.length) {
      setSelectedFunds(prev => [...prev, ...selectedFundings]);
    }

    if (selectedCompliances.length) {
      setSelectedComplianceStatus(prev => [...prev, ...selectedCompliances]);
    }

    if (!Helper.empty(currentData?.accounts) || currentData?.accounts) {
      setSelectedAccounts(
        prev => [...prev, ...currentData?.accounts?.map(account => account.account_id) as string[]]
      )
    }
  }, [currentData]);

  useEffect(() => {
    form.setFieldValue('accounts', selectedAccounts.map(selAccount => ({
      key: randomId(),
      obligation_request_id: currentData.id,
      account_id: selAccount,
      amount: undefined
    })));
  }, [selectedAccounts]);

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

  useEffect(() => {
    setLoadingAccounts(true);

    let retries = 3;

    const fetch = () => {
      API.get('/libraries/accounts', {
        paginated: false,
        show_all: true,
        sort_direction: 'asc',
      })
        .then((res) => {
          const accounts: AccountType[] = res?.data;
          setAccounts(accounts);
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
            setLoadingAccounts(false);
          }
        })
        .finally(() => setLoadingAccounts(false));
    };

    fetch();
  }, []);

  const renderDynamicTdContent = (
    id: string,
  ): ReactNode => {
    switch (id) {
      case 'responsibility_center':
        return (
          <Table.Td rowSpan={selectedAccounts.length + 1}>
            {!readOnly ? (
              <DynamicSelect
                key={form.key('responsibility_center_id')}
                {...form.getInputProps('responsibility_center_id')}
                variant={readOnly ? 'unstyled' : 'default'}
                placeholder={'Select a responsibility center...'}
                endpoint={'/libraries/responsibility-centers'}
                endpointParams={{ paginated: false, show_all: true }}
                column={'code'}
                defaultData={
                  responsibilityCenters ??
                  (currentData.responsibility_center_id
                    ? [
                      {
                        value: currentData.responsibility_center_id,
                        label: currentData.responsibility_center?.description
                          ? `${currentData.responsibility_center?.code}: ${currentData.responsibility_center?.description}`
                          : currentData.responsibility_center?.code
                      },
                    ]
                    : undefined)
                }
                value={form.values.responsibility_center_id}
                size={lgScreenAndBelow ? 'sm' : 'md'}
                required={!readOnly}
                readOnly={readOnly}
                isLoading={loadingResponsibilityCenter}
              />
            ) : (
              <TextInput
                variant={'unstyled'}
                placeholder={'None'}
                defaultValue={
                  currentData.responsibility_center?.description
                    ? `${currentData.responsibility_center?.code}: ${currentData.responsibility_center?.description}`
                    : currentData.responsibility_center?.code
                }
                size={lgScreenAndBelow ? 'sm' : 'md'}
                flex={1}
                readOnly
              />
            )}
          </Table.Td>
        );

      case 'particulars':
        return (
          <Table.Td rowSpan={selectedAccounts.length + 1}>
            <Textarea
              key={form.key('particulars')}
              {...form.getInputProps('particulars')}
              variant={readOnly ? 'unstyled' : 'default'}
              placeholder={
                readOnly ? 'None' : 'Enter particulars here...'
              }
              defaultValue={form?.values?.particulars}
              size={lgScreenAndBelow ? 'sm' : 'md'}
              autosize
              required={!readOnly}
              readOnly={readOnly}
            />
          </Table.Td>
        );

      case 'fpps':
        return (
          <Table.Td rowSpan={selectedAccounts.length + 1}>
            {!readOnly ? (
              <DynamicMultiselect
                key={form.key('fpps')}
                {...form.getInputProps('fpps')}
                variant={readOnly ? 'unstyled' : 'default'}
                placeholder={'Select F.P.P. here...'}
                endpoint={'/libraries/function-program-projects'}
                endpointParams={{
                  paginated: false,
                  show_all: true,
                  show_inactive: false,
                }}
                column={'code'}
                value={(form.values.fpps as string[]) ?? undefined}
                size={lgScreenAndBelow ? 'sm' : 'md'}
                readOnly={readOnly}
              />
            ) : (
              <Textarea
                variant={readOnly ? 'unstyled' : 'default'}
                placeholder={'None'}
                value={
                  currentData?.fpps
                    ?.map((fpp, i) => fpp.fpp?.code)
                    .join('\n') ?? '-'
                }
                size={lgScreenAndBelow ? 'sm' : 'md'}
                autosize
                readOnly
              />
            )}
          </Table.Td>
        );

      case 'accounts':
        return (
          <Table.Td>
            {!readOnly ? (
              <DynamicMultiselect
                variant={readOnly ? 'unstyled' : 'default'}
                placeholder={'Select account code here...'}
                endpoint={'/libraries/accounts'}
                endpointParams={{
                  paginated: false,
                  show_all: true,
                  show_inactive: false,
                }}
                column={'code'}
                value={selectedAccounts}
                onChange={(value) => {
                  value.sort();
                  setSelectedAccounts(value);
                }}
                size={lgScreenAndBelow ? 'sm' : 'md'}
                readOnly={readOnly}
              />
            ) : (
              <Textarea
                variant={readOnly ? 'unstyled' : 'default'}
                placeholder={'None'}
                value={
                  currentData?.accounts
                    ?.map((account, i) => account.account_id)
                    .join('\n') ?? '-'
                }
                size={lgScreenAndBelow ? 'sm' : 'md'}
                autosize
                readOnly
              />
            )}
          </Table.Td>
        );

      case 'amount':
        return (
          <Table.Td>
            <NumberInput
              variant={readOnly ? 'unstyled' : 'default'}
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
        // if (handleCreateUpdate) {
        //   handleCreateUpdate({
        //     ...values,
        //     department_id: departmentId,
        //     section_id: sectionId,
        //     pr_date: values.pr_date
        //       ? dayjs(values.pr_date).format('YYYY-MM-DD')
        //       : '',
        //     sai_date: values.sai_date
        //       ? dayjs(values.sai_date).format('YYYY-MM-DD')
        //       : '',
        //     alobs_date: values.alobs_date
        //       ? dayjs(values.alobs_date).format('YYYY-MM-DD')
        //       : '',
        //     items: values.items ?? [],
        //   });
        // }

        console.log(values);
      })}
    >
      <Stack justify={'center'}>
        <Card
          shadow={'xs'}
          padding={lgScreenAndBelow ? 'md' : 'lg'}
          radius={'xs'}
          withBorder
        >
          <Flex
            direction={lgScreenAndBelow ? 'column' : 'row'}
            sx={{ flexGrow: 1 }}
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
              <Title order={lgScreenAndBelow ? 4 : 3}>
                {
                  !Helper.empty(company) || loadingCompany
                    ? (`Province of ${company?.province ?? '________'}`)
                    : 'Loading...'
                }
              </Title>
              <Title order={lgScreenAndBelow ? 3 : 2}>
                {
                  !Helper.empty(company) || loadingCompany
                    ? (company?.municipality ?? '________')
                    : 'Loading...'
                }
              </Title>
            </Stack>
            <Stack
              bd={'1px solid var(--mantine-color-gray-8)'}
              justify={'center'}
              align={'flex-start'}
              flex={lgScreenAndBelow ? 1 : '0 0 30%'}
              p={lgScreenAndBelow ? 'sm' : 'md'}
            >
              <Checkbox.Group
                value={selectedFunds}
                label={'Funding'}
                size={lgScreenAndBelow ? 'sm' : 'md'}
                onChange={setSelectedFunds}
                readOnly={readOnly}
              >
                <Group mt="xs">
                  <Stack>
                    <Checkbox
                      value='general'
                      label="General"
                      radius={'xl'}
                      variant={'outline'}
                    />
                    <Checkbox
                      value='mdf_20'
                      label="20% MDF"
                      radius={'xl'}
                      variant={'outline'}
                    />
                  </Stack>
                  <Stack>
                    <Checkbox
                      value='gf_mdrrmf_5'
                      label="GF - 5% MDRRMF"
                      radius={'xl'}
                      variant={'outline'}
                    />
                    <Checkbox
                      value='sef'
                      label="SEF"
                      radius={'xl'}
                      variant={'outline'}
                    />
                  </Stack>
                </Group>
              </Checkbox.Group>
            </Stack>
          </Flex>

          <Flex
            direction={lgScreenAndBelow ? 'column' : 'row'}
            bd={'1px solid var(--mantine-color-gray-8)'}
            sx={{ flexGrow: 1 }}
          >
            <Stack
              justify={'center'}
              align={'center'}
              flex={lgScreenAndBelow ? 1 : '0 0 60%'}
              py={3}
            >
              <Title order={lgScreenAndBelow ? 3 : 2}>
                OBLIGATION REQUEST
              </Title>
            </Stack>
            <Stack
              justify={'center'}
              align={lgScreenAndBelow ? 'center' : 'flex-end'}
              flex={lgScreenAndBelow ? 1 : '0 0 40%'}
              p={3}
            >
              <Title order={lgScreenAndBelow ? 3 : 2}>
                No. {currentData?.obr_no}
              </Title>
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
              p={4}
            >
              <Group gap={1} align={'flex-start'}>
                <Text size={lgScreenAndBelow ? 'sm' : 'md'}>
                  Payee/ Office:
                </Text>
                {!readOnly && (
                  <Stack>
                    <IconAsterisk
                      size={7}
                      color={'var(--mantine-color-red-8)'}
                      stroke={2}
                    />
                  </Stack>
                )}
              </Group>
            </Stack>
            <Stack
              bd={'1px solid var(--mantine-color-gray-8)'}
              justify={'center'}
              align={'flex-start'}
              flex={lgScreenAndBelow ? 1 : '0 0 85%'}
              p={4}
            >
              <TextInput
                variant={!readOnly ? 'unstyled' : 'filled'}
                placeholder={'None'}
                value={currentData?.payee?.supplier_name ?? ''}
                size={lgScreenAndBelow ? 'sm' : 'md'}
                w={'100%'}
                sx={{
                  borderBottom: '2px solid var(--mantine-color-gray-5)',
                  input: {
                    minHeight: '30px',
                    height: '30px',
                    width: '100%'
                  },
                }}
                flex={1}
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
              p={4}
            >
              <Text size={lgScreenAndBelow ? 'sm' : 'md'}>
                Office:
              </Text>
            </Stack>
            <Stack
              bd={'1px solid var(--mantine-color-gray-8)'}
              justify={'center'}
              align={'flex-start'}
              flex={lgScreenAndBelow ? 1 : '0 0 85%'}
              p={4}
            >
              <TextInput
                key={form.key('office')}
                {...form.getInputProps('office')}
                variant={'unstyled'}
                placeholder={
                  !readOnly ? 'Enter the office here...' : 'None'
                }
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
          </Flex>

          <Flex
            direction={lgScreenAndBelow ? 'column' : 'row'}
            sx={{ flexGrow: 1 }}
          >
            <Stack
              bd={'1px solid var(--mantine-color-gray-8)'}
              justify={'flex-start'}
              align={'flex-start'}
              flex={lgScreenAndBelow ? 1 : '0 0 15%'}
              p={4}
            >
              <Text size={lgScreenAndBelow ? 'sm' : 'md'}>
                Address:
              </Text>
            </Stack>
            <Stack
              bd={'1px solid var(--mantine-color-gray-8)'}
              justify={'flex-start'}
              align={'flex-start'}
              flex={lgScreenAndBelow ? 1 : '0 0 85%'}
              p={4}
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
                    if (readOnly && header.id === 'delete') return;

                    if (!readOnly && header.id === 'estimated_cost') return;

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
                <Table.Tr
                  sx={{ verticalAlign: 'top' }}
                >
                  {itemHeaders.map((header) => {
                    return (
                      <React.Fragment
                        key={`field-${header.id}`}
                      >
                        {renderDynamicTdContent(header.id)}
                      </React.Fragment>
                    );
                  })}
                </Table.Tr>

                {!loadingAccounts && form.getValues().accounts?.map((selAccount, index) => {
                  const account = accounts?.find(account => account.id === selAccount.account_id);

                  return (
                    <Table.Tr key={selAccount.key}>
                      <Table.Td
                        fz={lgScreenAndBelow ? 'sm' : 'md'}
                        fw={500}
                        ta={'center'}
                      >
                        <Group gap={1} align={'flex-start'}>
                          {account?.code}{' '}
                          {!readOnly && (
                            <Stack>
                              <IconAsterisk
                                size={7}
                                color={'var(--mantine-color-red-8)'}
                                stroke={2}
                              />
                            </Stack>
                          )}
                        </Group>
                        <input
                          key={form.key(`accounts.${index}.account_id`)}
                          {...form.getInputProps(`accounts.${index}.account_id`)}
                          type={'hidden'}
                          defaultValue={selAccount?.account_id}
                        />
                      </Table.Td>
                      <Table.Td>
                        <NumberInput
                          key={form.key(`accounts.${index}.amount`)}
                          {...form.getInputProps(`accounts.${index}.amount`)}
                          variant={readOnly ? 'unstyled' : 'default'}
                          placeholder={'Amount'}
                          defaultValue={selAccount.amount}
                          size={lgScreenAndBelow ? 'sm' : 'md'}
                          min={0}
                          clampBehavior={'strict'}
                          decimalScale={2}
                          fixedDecimalScale
                          thousandSeparator={','}
                          onBlur={(e) => form.replaceListItem('accounts', index, {
                            key: randomId(),
                            obligation_request_id: currentData?.id,
                            account_id: selAccount?.account_id,
                            amount: parseFloat(e.currentTarget.value.replace(/,/g, ''))
                          })}
                          readOnly={readOnly}
                          required={!readOnly}
                        />
                      </Table.Td>
                    </Table.Tr>
                  );
                })}

                <Table.Tr>
                  <Table.Td></Table.Td>
                  <Table.Td>
                    <Title ta={'center'} order={lgScreenAndBelow ? 5 : 4}>TOTAL</Title>
                  </Table.Td>
                  <Table.Td></Table.Td>
                  <Table.Td></Table.Td>
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
                <Text size={lgScreenAndBelow ? 'sm' : 'md'}>
                  A. Certified:
                </Text>
                <Checkbox.Group
                  value={selectedComplianceStatus}
                  size={lgScreenAndBelow ? 'sm' : 'md'}
                  onChange={setSelectedComplianceStatus}
                  readOnly={readOnly}
                >
                  <Group mt="xs">
                    <Stack>
                      <Checkbox
                        value='allotment_necessary'
                        label="Charges to appropriation / allotment necessary, lawful and under my direct supervision"
                        radius={'xl'}
                        variant={'outline'}
                      />
                      <Checkbox
                        value='document_valid'
                        label="Supporting documents valid, proper and legal"
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
                    key={form.key('sig_head_id')}
                    {...form.getInputProps('sig_head_id')}
                    variant={'unstyled'}
                    label={'Head, Requesting Office/Authorized Representative:'}
                    placeholder={!readOnly ? 'Select a signatory...' : 'None'}
                    endpoint={'/libraries/signatories'}
                    endpointParams={{
                      paginated: false,
                      show_all: true,
                      document: 'obr',
                      signatory_type: 'head',
                    }}
                    defaultData={
                      currentData?.sig_head_id
                        ? [
                          {
                            value: currentData?.sig_head_id ?? '',
                            label:
                              currentData?.signatory_head?.user
                                ?.fullname ?? '',
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
                    label={'Head, Requesting Office/Authorized Representative:'}
                    variant={'unstyled'}
                    placeholder={'None'}
                    value={
                      currentData?.signatory_head?.user?.fullname ?? ''
                    }
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
                B. Certified:<br />
                Existence of available appropriation
              </Text>

              <Stack w={'100%'} mt={'md'}>
                {!readOnly ? (
                  <DynamicSelect
                    key={form.key('sig_budget_id')}
                    {...form.getInputProps('sig_budget_id')}
                    variant={'unstyled'}
                    label={'Head, Budget Unit/Authorized Representative:'}
                    placeholder={!readOnly ? 'Select a signatory...' : 'None'}
                    endpoint={'/libraries/signatories'}
                    endpointParams={{
                      paginated: false,
                      show_all: true,
                      document: 'obr',
                      signatory_type: 'budget',
                    }}
                    defaultData={
                      currentData?.sig_budget_id
                        ? [
                          {
                            value: currentData?.sig_budget_id ?? '',
                            label:
                              currentData?.signatory_budget?.user
                                ?.fullname ?? '',
                          },
                        ]
                        : undefined
                    }
                    valueColumn={'signatory_id'}
                    column={'fullname_designation'}
                    value={form.values.sig_budget_id}
                    size={lgScreenAndBelow ? 'sm' : 'md'}
                    sx={{
                      borderBottom: '2px solid var(--mantine-color-gray-5)',
                    }}
                    required={!readOnly}
                    readOnly={readOnly}
                  />
                ) : (
                  <TextInput
                    label={'Head, Budget Unit/Authorized Representative:'}
                    variant={'unstyled'}
                    placeholder={'None'}
                    value={
                      currentData?.signatory_budget?.user?.fullname ?? ''
                    }
                    size={lgScreenAndBelow ? 'sm' : 'md'}
                    sx={{
                      borderBottom: '2px solid var(--mantine-color-gray-5)',
                    }}
                    readOnly
                  />
                )}

                <DateInput
                  key={form.key('budget_signed_date')}
                  {...form.getInputProps('budget_signed_date')}
                  variant={'unstyled'}
                  label={'Date'}
                  valueFormat={'YYYY-MM-DD'}
                  defaultValue={
                    readOnly
                      ? undefined
                      : form.values.budget_signed_date
                        ? new Date(form.values.budget_signed_date)
                        : undefined
                  }
                  value={
                    readOnly
                      ? currentData?.budget_signed_date
                        ? new Date(currentData?.budget_signed_date)
                        : undefined
                      : undefined
                  }
                  placeholder={
                    readOnly ? 'None' : 'Enter the budget signed date here...'
                  }
                  error={form.errors.budget_signed_date && ''}
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
        </Card>
      </Stack>
    </form>
  );
});

FormClient.displayName = 'FormClient';

export default FormClient;
