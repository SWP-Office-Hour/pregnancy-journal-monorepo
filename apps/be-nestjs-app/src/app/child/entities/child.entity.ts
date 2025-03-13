import { Gender } from '@pregnancy-journal-monorepo/contract';

export class Child {
  child_id: string;
  expected_birth_date: Date;
  name: string;
  gender: Gender | null;
  user_id: string;
}
