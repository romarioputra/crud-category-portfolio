import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginAuthentication } from '../model/loginAuthentication';
import { credentials } from '../shared/credentials';

@Injectable({
  providedIn: 'root'
})
export class LoginApiService {
  private apiUrl = "https://test.oongjulian.my.id/auth/login";
  private body = credentials;
  private httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      'api_key': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9'
    })
  }
  private token = "";
  private tokenType = "";
  private currentTimeExpire = 0;
  constructor(private http: HttpClient) {
    this.setTokenInfo();
  }

  public getTokenInfo(): LoginAuthentication {
    return {
      token: this.token,
      token_type: this.tokenType,
    }
  }
  public setTokenInfo(): void {
    const currentTime = new Date().getTime();
    if (localStorage.getItem('token') === null || (currentTime > this.currentTimeExpire)) {
      this.http.post<LoginAuthentication>(this.apiUrl, this.body, this.httpOptions).subscribe((loginInfo) => {
        this.token = loginInfo.token;
        this.tokenType = loginInfo.token_type;

        if (localStorage.getItem('token') === null) {
          this.currentTimeExpire = new Date().getTime() + loginInfo.expires_in!;
        }

        localStorage.setItem('token', this.token!);
        localStorage.setItem('tokenType', this.tokenType);
      });
    }
    else {
      this.token = localStorage.getItem('token')!;
      this.tokenType = localStorage.getItem('tokenType')!;
    }
  }
}
