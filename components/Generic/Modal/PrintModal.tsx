import {
  ActionIcon,
  Button,
  Card,
  Group,
  Modal,
  Stack,
  Switch,
  Text,
  Tooltip,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import {
  IconDownload,
  IconPrinter,
  IconRefresh,
  IconX,
} from '@tabler/icons-react';
import DynamicSelect from '../DynamicSelect';
import API from '@/libs/API';
import { getErrors } from '@/libs/Errors';
import { notify } from '@/libs/Notification';
import { useMediaQuery } from '@mantine/hooks';
import Helper from '@/utils/Helpers';
import CustomLoadingOverlay from '../CustomLoadingOverlay';

const PrintModalClient = ({
  title,
  endpoint,
  defaultPaper = 'A4',
  defaultOrientation = 'P',
  opened,
  close,
}: PrintModalProps) => {
  const lgScreenAndBelow = useMediaQuery('(max-width: 900px)');
  const [loading, setLoading] = useState(false);
  const [filename, setFilename] = useState<string>('');
  const [base64File, setBase64File] = useState<string>();
  const [paperId, setPaperId] = useState('');
  const [pageOrientation, setPageOrientation] = useState<string>(
    defaultOrientation ?? 'P'
  );
  const [showSignatures, setShowSignatures] = useState<boolean>(false);

  useEffect(() => {
    if (
      !Helper.empty(paperId) &&
      !Helper.empty(pageOrientation) &&
      !Helper.empty(endpoint)
    ) {
      handleFetchData();
    }
  }, [paperId, pageOrientation, showSignatures, endpoint]);

  useEffect(() => {
    if (!opened) {
      setPaperId('');
      setPageOrientation('P');
    } else {
      if (defaultOrientation) setPageOrientation(defaultOrientation ?? 'P');
    }
  }, [opened, defaultOrientation]);

  const handleFetchData = () => {
    if (paperId !== defaultPaper) {
      setLoading(true);

      setFilename('');
      setBase64File('');

      API.post(endpoint, {
        paper_id: paperId,
        page_orientation: pageOrientation,
        show_signatures: showSignatures,
      })
        .then((res) => {
          if (res?.data) {
            setFilename(res?.data?.filename);
            setBase64File(`data:application/pdf;base64,${res?.data?.blob}`);
          } else {
            setFilename('');
            setBase64File('');
          }

          setLoading(false);
        })
        .catch((err) => {
          const errors = getErrors(err);

          errors.forEach((error) => {
            notify({
              title: 'Failed',
              message: error,
              color: 'red',
            });
          });

          setLoading(false);
        });
    }
  };

  const handleDownload = () => {
    if (!base64File) return;

    const link = document.createElement('a');
    link.href = `${base64File}`;
    link.download = filename;
    link.click();
  };

  return (
    <Modal
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      opened={opened}
      onClose={close}
      title={title ?? 'Print'}
      fullScreen={true}
      size={lgScreenAndBelow ? 'sm' : 'md'}
      centered
    >
      <Stack mb={50}>
        <Group w={'100%'} align={'flex-start'}>
          <Stack flex={{ base: 1, md: 0.65, lg: 0.75 }}>
            <Card p={0} radius={'sm'} h={'calc(100vh - 8.2em)'} withBorder>
              <CustomLoadingOverlay visible={loading} />

              {opened && base64File && paperId && pageOrientation && (
                <iframe
                  src={base64File}
                  height='100%'
                  width='100%'
                  style={{
                    height: 'calc(100vh - 8.2em)',
                    border: 0,
                  }}
                ></iframe>
              )}
            </Card>
          </Stack>
          <Stack
            flex={{ base: undefined, md: 0.35, lg: 0.25 }}
            display={{ base: 'none', md: 'initial' }}
          >
            <Card
              padding={'md'}
              radius={'sm'}
              h={'calc(100vh - 8.2em)'}
              withBorder
            >
              <Card.Section withBorder inheritPadding py={'sm'}>
                <Group>
                  <IconPrinter size={24} />
                  <Text size={'lg'}>Settings</Text>
                  <Tooltip label={'Refresh'}>
                    <ActionIcon
                      variant={'light'}
                      radius={'xl'}
                      size={lgScreenAndBelow ? 'sm' : 'md'}
                      color={'var(--mantine-color-primary-9)'}
                      loading={loading}
                      onClick={handleFetchData}
                    >
                      <IconRefresh size={14} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Card.Section>

              <Stack my={'md'}>
                <DynamicSelect
                  label={'Document Size'}
                  placeholder={'Select a document size'}
                  size={lgScreenAndBelow ? 'sm' : 'md'}
                  endpoint={'/libraries/paper-sizes'}
                  column={'paper_type'}
                  value={Helper.empty(paperId) ? defaultPaper : paperId}
                  onChange={(value) => setPaperId(value ?? '')}
                  hasPresetValue
                  required
                  preLoading
                />
                <DynamicSelect
                  label={'Page Orientation'}
                  placeholder={'Select a page orientation'}
                  size={lgScreenAndBelow ? 'sm' : 'md'}
                  defaultData={[
                    {
                      value: 'P',
                      label: 'Portrait',
                    },
                    {
                      value: 'L',
                      label: 'Landscape',
                    },
                  ]}
                  defaultValue={defaultOrientation}
                  value={pageOrientation}
                  onChange={(value) => setPageOrientation(value ?? 'P')}
                  hasPresetValue
                  disableFetch
                  required
                />
                <Switch
                  color={'var(--mantine-color-primary-9)'}
                  labelPosition={'left'}
                  label={'Show Signatures?'}
                  checked={showSignatures}
                  onLabel={'Show'}
                  offLabel={'hide'}
                  onChange={(event) =>
                    setShowSignatures(event.currentTarget.checked)
                  }
                />
              </Stack>
            </Card>
          </Stack>
        </Group>
      </Stack>

      <Stack
        w={'100%'}
        bg={'white'}
        pos={'fixed'}
        bottom={0}
        right={0}
        align={'end'}
        p={15}
        sx={{ zIndex: 100 }}
      >
        <Group>
          <Button
            type={'button'}
            color={'var(--mantine-color-primary-9)'}
            size={lgScreenAndBelow ? 'xs' : 'sm'}
            leftSection={<IconDownload size={18} />}
            disabled={loading || !base64File}
            loaderProps={{ type: 'dots' }}
            loading={loading}
            onClick={!loading && base64File ? handleDownload : undefined}
          >
            Download
          </Button>
          <Button
            variant={'outline'}
            size={lgScreenAndBelow ? 'xs' : 'sm'}
            color={'var(--mantine-color-gray-8)'}
            leftSection={<IconX size={18} />}
            onClick={close}
          >
            Close
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default PrintModalClient;
