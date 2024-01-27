import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  apiUrl: string = environment.apiUrl;
  constructor(private http: HttpClient) { }
  getHeaders(){
    return new HttpHeaders({
      "Authorization" : "Bearer " + String(localStorage.getItem("accesstoken"))
    });
  }

  login(form: { email: string, password: string }) {
    return this.http.post(this.apiUrl + '/users',  form );
  }
  getProfile() {
    return this.http.get(this.apiUrl + '/users', { headers: this.getHeaders() });
  }

  signUp(form: { email: string, password: string, firstName: string, lastName: string }) {
    return this.http.put(this.apiUrl + '/users', form);
  }

  randomFigures(xMax: number, yMax: number, num: number) {
    return this.http.get(this.apiUrl + `/figures?xMax=${xMax}&yMax=${yMax}&num=${num}`);
  }

  findPath(dto: unknown) {
    return this.http.post(this.apiUrl + '/algorithm', dto);
  }
}
