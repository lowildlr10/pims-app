'use client';

import { useForm } from '@mantine/form';
import { IconLock, IconLogin2, IconUser } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

import {
  Anchor,
  Button,
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

const LoginFormClient = () => {
  const { loading, error, message, login } = useAuth();
  const [loggedIn, setLoggedIn] = useState(false);

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

  const form = useForm({
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

  const handleLogin = () => {
    if (form.values.login.trim() && form.values.password.trim()) {
      login(form.values).then(() => {});
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

      <form onSubmit={form.onSubmit(() => handleLogin())}>
        <Stack>
          <TextInput
            leftSection={<IconUser />}
            size='lg'
            style={{ marginTop: '8%' }}
            required
            placeholder='Username or email'
            value={form.values.login}
            onChange={(event) =>
              form.setFieldValue('login', event.currentTarget.value)
            }
            error={form.errors.login && 'Invalid username or email'}
            disabled={loggedIn}
          />

          <PasswordInput
            leftSection={<IconLock />}
            size='lg'
            required
            placeholder='Your password'
            value={form.values.password}
            onChange={(event) =>
              form.setFieldValue('password', event.currentTarget.value)
            }
            error={
              form.errors.password &&
              'Password should include at least 6 characters'
            }
            disabled={loggedIn}
          />
        </Stack>

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
