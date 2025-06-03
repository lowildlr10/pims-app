import DynamicSelect from "@/components/Generic/DynamicSelect";
import API from "@/libs/API";
import { LoadingOverlay, NumberInput, Textarea } from "@mantine/core";
import { Table } from "@mantine/core";
import { Select } from "@mantine/core";
import { TextInput } from "@mantine/core";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { forwardRef, useEffect, useState } from "react";

export const InspectContent = forwardRef<
  HTMLFormElement,
  {id: string, handlePayload: (payload: object) => void}
>(({ id, handlePayload }, ref) => {
  const lgScreenAndBelow = useMediaQuery('(max-width: 1366px)');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<InspectionAcceptanceReportType>();
  const [classificationData, setClassificationData] = useState<
    {
      value: string;
      label: string;
    }[]
  >();
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { 
      items: data?.items?.map(item => ({
        id: item.id,
        stock_no: item.pr_item?.stock_no,
        description: item.po_item?.description,
        unit: item.pr_item?.unit_issue?.unit_name,
        quantity: item.pr_item?.quantity,
        item_classification_id: '',
        required_document: ''
      })) 
    },
  });

  useEffect(() => {
    setLoading(true);

    let retries = 3;

    const fetch = () => {
      API.get('/libraries/item-classifications', { paginated: false, show_all: true, sort_direction: 'asc' })
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
            console.error("Failed after multiple retries");
          }
        })
        .finally(() => setLoading(false));
    }
    
    fetch();
  }, []);

  useEffect(() => {
    setLoading(true);

    let retries = 3;

    const fetch = () => {
      API.get(`/inspection-acceptance-reports/${id}`)
        .then((res) => {
          setData(res?.data?.data);
        })
        .catch(() => {
          if (retries > 0) {
            retries -= 1;
            fetch();
          } else {
            console.error("Failed after multiple retries");
          }
        })
        .finally(() => setLoading(false));
    }
    
    fetch();
  }, [id]);

  useEffect(() => {
    form.reset();
    form.setInitialValues({ 
      items: data?.items?.map(item => ({
        id: item.id,
        stock_no: item.pr_item?.stock_no,
        description: item.po_item?.description,
        unit: item.pr_item?.unit_issue?.unit_name,
        quantity: item.pr_item?.quantity,
        item_classification_id: '',
        required_document: ''
      })) 
    });
  }, [data]);

  return (
    <form
      ref={ref}
      onSubmit={form.onSubmit((values) => handlePayload(values))}
    >
      <Stack>
        <LoadingOverlay
          visible={loading || data?.items?.length === 0}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />

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
            <Table.Tr
              sx={{ verticalAlign: 'top' }}
            >
              <Table.Th
                w={'12%'}
                fz={lgScreenAndBelow ? 'sm' : 'md'}
              >
                Item No.
              </Table.Th>
              <Table.Th
                w={'14%'}
                fz={lgScreenAndBelow ? 'sm' : 'md'}
              >
                Unit
              </Table.Th>
              <Table.Th
                w={'30%'}
                fz={lgScreenAndBelow ? 'sm' : 'md'}
              >
                Description
              </Table.Th>
              <Table.Th
                w={'12%'}
                fz={lgScreenAndBelow ? 'sm' : 'md'}
              >
                Quantity
              </Table.Th>
              <Table.Th
                w={'17%'}
                fz={lgScreenAndBelow ? 'sm' : 'md'}
              >
                Item Classification
              </Table.Th>
              <Table.Th
                w={'15%'}
                fz={lgScreenAndBelow ? 'sm' : 'md'}
              >
                Required Inventory Document
              </Table.Th>
            </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {form.getValues()?.items?.map((item, index) => (
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
                    <Textarea
                      variant={'unstyled'}
                      placeholder={'Description'}
                      defaultValue={item.description}
                      size={lgScreenAndBelow ? 'sm' : 'md'}
                      autosize
                      readOnly
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
                    <DynamicSelect
                      key={form.key(`items.${index}.item_classification_id`)}
                      {...form.getInputProps(`items.${index}.item_classification_id`)}
                      placeholder={'Item Classification'}
                      endpoint={'/libraries/item-classifications'}
                      endpointParams={{ paginated: false, show_all: true }}
                      column={'classification_name'}
                      defaultData={classificationData}
                      size={lgScreenAndBelow ? 'sm' : 'md'}
                      required
                      disableFetch
                      isLoading={loading}
                    />
                  </Table.Td>
                  <Table.Td>
                    <Select
                      key={form.key(`items.${index}.required_document`)}
                      {...form.getInputProps(`items.${index}.required_document`)}
                      size={lgScreenAndBelow ? 'sm' : 'md'}
                      data={[
                        { label: 'Acknowledgment Receipt for Equipment', value: 'are' },
                        { label: 'Inventory Custodian Slip', value: 'ics' },
                        { label: 'Requisition and Issue Slip', value: 'ris' },
                      ]}
                      placeholder={'Required Inventory Document'}
                      searchable
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