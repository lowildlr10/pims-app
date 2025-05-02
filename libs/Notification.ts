import { NotificationData, notifications } from '@mantine/notifications';

export const notify = ({
  title,
  message,
  color = 'blue',
  autoClose = 3000,
  position = 'bottom-left',
}: NotificationData) => {
  notifications.show({
    title,
    message,
    color,
    autoClose,
    position,
    withBorder: true,
  });
};
