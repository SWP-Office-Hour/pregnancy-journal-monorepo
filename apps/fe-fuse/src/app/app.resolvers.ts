import { inject } from '@angular/core';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { NotificationsService } from 'app/layout/common/notifications/notifications.service';
import { forkJoin } from 'rxjs';

export const initialDataResolver = () => {
  // const messagesService = inject(MessagesService);
  const navigationService = inject(NavigationService);
  const notificationsService = inject(NotificationsService);
  // const quickChatService = inject(QuickChatService);
  // const shortcutsService = inject(ShortcutsService);

  // Fork join multiple API endpoint calls to wait all of them to finish
  return forkJoin([
    navigationService.get(),
    // messagesService.getAll(),
    notificationsService.getAll(),
    // quickChatService.getChats(),
    // shortcutsService.getAll(),
  ]);
};
