import { inject, Injectable } from '@angular/core';
import { AuthMockApi } from 'app/mock-api/common/auth/api';
import { ChatMockApi } from 'app/mock-api/common/chat/api';
import { MessagesMockApi } from 'app/mock-api/common/messages/api';
import { NavigationMockApi } from 'app/mock-api/common/navigation/api';
import { NotificationsMockApi } from 'app/mock-api/common/notifications/api';
import { UserMockApi } from 'app/mock-api/common/user/api';
import { IconsMockApi } from 'app/mock-api/icons/api';
import { AdminMockApi } from './common/dashboards/project/api';

// export const mockApiServices = [
//   // AcademyMockApi,
//   // ActivitiesMockApi,
//   // AnalyticsMockApi,
//   AuthMockApi,
//   ChatMockApi,
//   // ContactsMockApi,
//   // CryptoMockApi,
//   // FinanceMockApi,
//   IconsMockApi,
//   MessagesMockApi,
//   NavigationMockApi,
//   NotificationsMockApi,
//   // ProjectMockApi,
//   // SearchMockApi,
//   // ShortcutsMockApi,
//   UserMockApi,
//   // BlogsMockApi,
//   AdminMockApi,
// ];

// noinspection JSUnusedGlobalSymbols
@Injectable({ providedIn: 'root' })
export class MockApiService {
  // academyMockApi = inject(AcademyMockApi);
  // activitiesMockApi = inject(ActivitiesMockApi);
  // analyticsMockApi = inject(AnalyticsMockApi);
  authMockApi = inject(AuthMockApi);
  chatMockApi = inject(ChatMockApi);
  // contactsMockApi = inject(ContactsMockApi);
  // cryptoMockApi = inject(CryptoMockApi);
  // eCommerceInventoryMockApi = inject(ECommerceInventoryMockApi);
  // fileManagerMockApi = inject(FileManagerMockApi);
  // financeMockApi = inject(FinanceMockApi);
  // helpCenterMockApi = inject(HelpCenterMockApi);
  iconsMockApi = inject(IconsMockApi);
  // mailboxMockApi = inject(MailboxMockApi);
  messagesMockApi = inject(MessagesMockApi);
  navigationMockApi = inject(NavigationMockApi);
  // notesMockApi = inject(NotesMockApi);
  notificationsMockApi = inject(NotificationsMockApi);
  // projectMockApi = inject(ProjectMockApi);
  // searchMockApi = inject(SearchMockApi);
  // scrumboardMockApi = inject(ScrumboardMockApi);
  // shortcutsMockApi = inject(ShortcutsMockApi);
  // tasksMockApi = inject(TasksMockApi);
  userMockApi = inject(UserMockApi);
  adminMockApi = inject(AdminMockApi);
}
