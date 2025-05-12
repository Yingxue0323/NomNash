import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor as AngularHttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class HttpInterceptor implements AngularHttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Clone the request and add withCredentials to ensure cookies are sent
    const authReq = request.clone({
      withCredentials: true
    });
    
    // Add debug information
    console.log(`[HTTP] ${authReq.method} ${authReq.url}`);
    if (authReq.body) {
      console.log('[HTTP] Request body:', authReq.body);
    }
    
    return next.handle(authReq).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          console.log(`[HTTP] Response status: ${event.status} for ${authReq.url}`);
          console.log(`[HTTP] Response body:`, event.body);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error(`[HTTP] Error ${error.status} for ${authReq.url}:`, error.message);
        if (error.error) {
          console.error('[HTTP] Error details:', error.error);
        }
        return throwError(() => error);
      })
    );
  }
}