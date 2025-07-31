'use client';

import { useForm } from '@mantine/form';
import { IconLock, IconLogin2, IconUser } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

import {
  Anchor,
  Button,
  FocusTrap,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import useAuth from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { notify } from '@/libs/Notification';
import Helper from '@/utils/Helpers';

const LoginFormClient = () => {
  const { loading, error, message, login } = useAuth();
  const [loggedIn, setLoggedIn] = useState(false);
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      login: '',
      password: '',
    },

    validate: {
      login: (val) => {
        if (/^\S+@\S+\.\S+$/.test(val)) {
          return null;
        }

        if (/^[a-zA-Z0-9_]+$/.test(val)) {
          return null;
        }

        return 'Invalid username or email';
      },
      password: (val) =>
        val.length < 6 ? 'Password should include at least 6 characters' : null,
    },
  });

  useEffect(() => {
    if (loading) return;
    if (!message) return;
    if (!error) setLoggedIn(true);

    notify({
      title: error ? 'Failed!' : 'Success!',
      message: message,
      color: error ? 'red' : 'green',
    });

    form.reset();
  }, [loading]);

  const handleLogin = async (_login: string, _password: string) => {
    const userLogin = _login.trim();
    const userPassword = _password.trim();

    if (!Helper.empty(userLogin) && !Helper.empty(userPassword)) {
      await login({
        login: userLogin,
        password: userPassword,
      });
    }
  };

  return (
    <Paper
      radius='md'
      p='xl'
      withBorder
      w={{ base: 'auto', lg: '430px' }}
      bd={'none'}
    >
      <Stack>
        <Title order={2} ta={'center'}>
          Hello!
        </Title>
        <Text size='lg' ta={'center'}>
          Login your account
        </Text>
      </Stack>

      <form
        onSubmit={form.onSubmit(async (values) => {
          await handleLogin(values.login, values.password);
        })}
      >
        <FocusTrap active={!(loggedIn || loading)}>
          <Stack>
            <TextInput
              {...form.getInputProps('login')}
              key={form.key('login')}
              leftSection={<IconUser />}
              size='lg'
              style={{ marginTop: '8%' }}
              required
              placeholder={'Username or email'}
              disabled={loggedIn || loading}
            />

            <PasswordInput
              {...form.getInputProps('password')}
              key={form.key('password')}
              leftSection={<IconLock />}
              size={'lg'}
              required
              placeholder={'Your password'}
              disabled={loggedIn || loading}
            />
          </Stack>
        </FocusTrap>

        <Group justify='right' mt='lg'>
          <Anchor
            onClick={(event) => {
              event.preventDefault();

              notifications.show({
                title: 'Password Reset',
                message:
                  'Please contact your administrator to reset your password.',
                color: 'blue',
                autoClose: 3000,
                position: 'top-right',
              });
            }}
            c={'var(--mantine-color-primary-9)'}
            href='#'
            size='sm'
            variant={'text'}
            fw={700}
          >
            Forgot password?
          </Anchor>
        </Group>

        <Group justify='space-between' mt='xl'>
          <Button
            size='md'
            type='submit'
            color={'var(--mantine-color-primary-9)'}
            loading={loading || loggedIn}
            loaderProps={{ type: 'dots' }}
            autoContrast
            fullWidth
            disabled={loggedIn}
          >
            <IconLogin2 size={18} />
            &nbsp;Login
          </Button>
        </Group>
      </form>
    </Paper>
  );
};

export default LoginFormClient;
