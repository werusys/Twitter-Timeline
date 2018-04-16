import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/observable';

@Injectable()
export class TwitterProxyInterceptor implements HttpInterceptor{
    intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const authReq = req.clone({
            headers: req.headers.set('Access-Control-Allow-Origin', '*')
      });
      return next.handle(authReq);
    }
  }