import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Post } from '../comment';


@Injectable()
export class CommentsService {
  
  readonly ROUTE_URL_GET = 'http://localhost:8000/api/operations/comment/'; // hard coded URL for api to get all comments
  readonly ROUTE_URL_POST = 'http://localhost:8000/api/operations/comment/create/';

  constructor(private http:HttpClient) { }

  // the method other apps subscribe to in order to get the api
  getComments() {
    return this.http.get(this.ROUTE_URL_GET) //should add a catch error func here, like: import "rxjs/add/operator/catch";
  }

  addComment(data) {
    const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token'})
    }
    return this.http.post(this.ROUTE_URL_POST, data, httpOptions)
  }

}
