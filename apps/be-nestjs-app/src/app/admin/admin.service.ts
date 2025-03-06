import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AdminService {
  constructor(private readonly databaseService: DatabaseService) {}

  // async getGithub(): Promise<GithubIssuesType> {
  //   const  = await this.databaseService
  //   return null;
  // }
}
