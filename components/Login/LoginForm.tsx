'use client';

import { useForm } from '@mantine/form';
import { IconLock, IconLogin2, IconUser } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

import {
  Anchor,
  Button,
  Divider,
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
      radius='xl'
      p={{ base: 'xl', sm: '2.25rem' }}
      w='100%'
      maw={440}
      bd='none'
      style={{
        boxShadow:
          '0 4px 6px -1px rgba(0,0,0,0.07), 0 20px 50px -8px rgba(0,0,0,0.12)',
      }}
    >
      <Stack gap='lg'>
        {/* Header */}
        <Stack gap={4} align='center'>
          <Title order={2} fw={700} ta='center' fz={{ base: 'h3', sm: 'h2' }}>
            Welcome Back
          </Title>
          <Text size='sm' ta='center' c='dimmed'>
            Sign in to your account to continue
          </Text>
        </Stack>

        <Divider />

        <form
          onSubmit={form.onSubmit(async (values) => {
            await handleLogin(values.login, values.password);
          })}
        >
          <FocusTrap active={!(loggedIn || loading)}>
            <Stack gap='md'>
              <TextInput
                {...form.getInputProps('login')}
                key={form.key('login')}
                label='Username or Email'
                leftSection={<IconUser size={16} />}
                size='md'
                required
                placeholder='Enter your username or email'
                disabled={loggedIn || loading}
                radius='md'
              />

              <PasswordInput
                {...form.getInputProps('password')}
                key={form.key('password')}
                label='Password'
                leftSection={<IconLock size={16} />}
                size='md'
                required
                placeholder='Enter your password'
                disabled={loggedIn || loading}
                radius='md'
              />
            </Stack>
          </FocusTrap>

          <Group justify='flex-end' mt='xs'>
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
              c='var(--mantine-color-primary-7)'
              href='#'
              size='sm'
              variant='text'
              fw={500}
            >
              Forgot password?
            </Anchor>
          </Group>

          <Button
            size='md'
            type='submit'
            color='var(--mantine-color-primary-9)'
            loading={loading || loggedIn}
            loaderProps={{ type: 'dots' }}
            autoContrast
            fullWidth
            disabled={loggedIn}
            mt='lg'
            radius='md'
            leftSection={
              !loading && !loggedIn ? <IconLogin2 size={17} /> : undefined
            }
            fw={600}
          >
            Sign In
          </Button>
        </form>
      </Stack>
    </Paper>
  );
};

export default LoginFormClient;
