import { NotificationData, notifications } from '@mantine/notifications';

export const notify = ({
  title,
  message,
  color = 'blue',
  autoClose = 3000,
  position = 'top-right',
}: NotificationData) => {
  notifications.show({
    title,
    message,
    color,
    autoClose,
    position,
  });
};
