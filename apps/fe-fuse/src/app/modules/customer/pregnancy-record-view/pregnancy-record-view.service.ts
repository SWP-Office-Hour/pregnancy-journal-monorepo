import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MediaResponse, MetricResponseType, RecordResponse } from '@pregnancy-journal-monorepo/contract';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class PregnancyRecordViewService {
  constructor(
    private _httpClient: HttpClient,
    private _authService: AuthService,
  ) {}

  getRecordById(recordId: string): Observable<RecordResponse> {
    return this._httpClient
      .get<RecordResponse>(`${environment.apiUrl}record/${recordId}`, {
        headers: {
          Authorization: `Bearer ${this._authService.accessToken}`,
        },
      })
      .pipe(
        catchError((error) => {
          console.error('Error fetching record:', error);
          return of({} as RecordResponse);
        }),
      );
  }

  getMediaByRecordId(recordId: string): Observable<MediaResponse[]> {
    return this._httpClient
      .get<MediaResponse[]>(`${environment.apiUrl}media/record/${recordId}`, {
        headers: {
          Authorization: `Bearer ${this._authService.accessToken}`,
        },
      })
      .pipe(
        catchError((error) => {
          console.error('Error fetching media:', error);
          return of([]);
        }),
      );
  }

  getMetric(): Observable<MetricResponseType[]> {
    return this._httpClient.get<MetricResponseType[]>(`${environment.apiUrl}metrics`).pipe(
      catchError((error) => {
        console.error('Error fetching metric:', error);
        return of([]);
      }),
    );
  }
}
