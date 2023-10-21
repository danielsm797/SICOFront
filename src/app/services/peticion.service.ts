import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { firstValueFrom } from 'rxjs'
import { HttpMethods } from '../utils/enums';

@Injectable({
  providedIn: 'root'
})
export class PeticionService {

  constructor(
    private http: HttpClient
  ) { }

  send(url: string, method: HttpMethods, body = {}) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })

    let promise: Promise<any>

    switch (method) {

      case HttpMethods.GET:
        promise = firstValueFrom(this.http.get(url, { headers }))
        break
      case HttpMethods.DELETE:
        promise = firstValueFrom(this.http.delete(url, { headers }))
        break
      case HttpMethods.POST:
        promise = firstValueFrom(this.http.post(url, body, { headers }))
        break
    }

    return promise
  }
}
