import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category, CategoryInfo } from '../model/category';
import { LoginApiService } from './login-api.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = "https://test.oongjulian.my.id/api/v1/admin/category";
  private token: string;
  private httpOptions = {headers: new HttpHeaders()};

  constructor(private http: HttpClient, private loginApi: LoginApiService) {
    this.token = `${loginApi.getTokenInfo().token_type} ${loginApi.getTokenInfo().token}`;
    this.httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.token,
        'Accept': 'application/json',
        'api_key': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9'
      })
    }
  }

  public getCategories(): Observable<CategoryInfo> {
     return this.http.get<CategoryInfo>(this.apiUrl, this.httpOptions);
  }
  public deleteCategory(id: number): Observable<Category[]> {
    const endpoint = `/destroy/${id}`;
    return this.http.delete<Category[]>(this.apiUrl + endpoint, this.httpOptions);
  }
  public updateCategory(category: Category): Observable<Object> {
    const endpoint = `/update/${category.id}`;
    return this.http.put(this.apiUrl + endpoint, {name_category: category.name_category, 
    desc_category: category.desc_category}, this.httpOptions);
  }
  public createCategory(category: Category): Observable<Object> {
    const endpoint = '/store';
    return this.http.post(this.apiUrl + endpoint, category, this.httpOptions);
  }
}
