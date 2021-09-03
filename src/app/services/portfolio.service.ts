import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Portfolio, PortfolioInfo } from '../model/portfolio';
import { LoginApiService } from './login-api.service';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private apiUrl = "https://test.oongjulian.my.id/api/v1/admin/portofolio";
  private token: string;
  private httpOptions = {headers: new HttpHeaders};

  constructor(private http: HttpClient, private loginApi: LoginApiService) {
    this.token = `${loginApi.getTokenInfo().token_type} ${loginApi.getTokenInfo().token}`;
    this.httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.token,
        'Accept': 'application/json',
        'api_key': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9',
      })
    }
  }

  public getPortfolios(): Observable<PortfolioInfo> {
     return this.http.get<PortfolioInfo>(this.apiUrl, this.httpOptions);
  }
  public deletePortfolio(id: number): Observable<Portfolio[]> {
    const endpoint = `/destroy/${id}`;
    return this.http.delete<Portfolio[]>(this.apiUrl + endpoint, this.httpOptions);
  }
  public createPortfolio(portfolio: FormData): Observable<Object> {
    const endpoint = '/store';
    return this.http.post(this.apiUrl + endpoint, portfolio, this.httpOptions);
  }
  public updatePortfolio(portfolio: FormData, id: number | undefined): Observable<Object> {
    const endpoint = `/update/${id}`;
    return this.http.post(this.apiUrl + endpoint, portfolio, this.httpOptions);
  }
}
