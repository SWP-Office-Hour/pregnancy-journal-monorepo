import { AcademyMockApi } from 'app/mock-api/apps/academy/api';
import { ChatMockApi } from 'app/mock-api/apps/chat/api';
import { ContactsMockApi } from 'app/mock-api/apps/contacts/api';
import { AuthMockApi } from 'app/mock-api/common/auth/api';
import { MessagesMockApi } from 'app/mock-api/common/messages/api';
import { NavigationMockApi } from 'app/mock-api/common/navigation/api';
import { NotificationsMockApi } from 'app/mock-api/common/notifications/api';
// import { SearchMockApi } from 'app/mock-api/common/search/api';
import { ShortcutsMockApi } from 'app/mock-api/common/shortcuts/api';
import { UserMockApi } from 'app/mock-api/common/user/api';
import { AnalyticsMockApi } from 'app/mock-api/dashboards/analytics/api';
import { CryptoMockApi } from 'app/mock-api/dashboards/crypto/api';
import { FinanceMockApi } from 'app/mock-api/dashboards/finance/api';
import { ProjectMockApi } from 'app/mock-api/dashboards/project/api';
import { ActivitiesMockApi } from 'app/mock-api/pages/activities/api';
import { IconsMockApi } from 'app/mock-api/ui/icons/api';
import { BlogsMockApi } from './dashboards/blogs/api';

export const mockApiServices = [
  AcademyMockApi,
  ActivitiesMockApi,
  AnalyticsMockApi,
  AuthMockApi,
  ChatMockApi,
  ContactsMockApi,
  CryptoMockApi,
  FinanceMockApi,
  IconsMockApi,
  MessagesMockApi,
  NavigationMockApi,
  NotificationsMockApi,
  ProjectMockApi,
  // SearchMockApi,
  ShortcutsMockApi,
  UserMockApi,
  BlogsMockApi,
];
