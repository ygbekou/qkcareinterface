import { TokenStorage, GlobalEventsManager } from './services';
import { Injectable } from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpSentEvent, HttpHeaderResponse, HttpProgressEvent,
  HttpResponse, HttpUserEvent, HttpErrorResponse} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import 'rxjs/add/operator/do';

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(public globalEventManager: GlobalEventsManager, private token: TokenStorage, private router: Router) { 
  }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable <HttpUserEvent<any>> {
    let authReq = req;
    if (this.token.hasToken()) {
      this.globalEventManager.showMenu = true;
      authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + this .token.getToken())});
    }
    return next.handle(authReq).do(
        (err: any) => {
          if (err instanceof HttpErrorResponse) {           
            if (err.status === 401) {
              this.router.navigate(['login']);
            }
          }
        }
      );
  }
}