// import { HttpErrorResponse, HttpHandler, HttpHeaderResponse, HttpInterceptor, HttpProgressEvent, HttpRequest, HttpResponse, HttpSentEvent, HttpUserEvent } from '@angular/common/http';
// import { Injectable, Injector } from '@angular/core';
// import { Router } from '@angular/router';
// import { Observable, of, throwError } from 'rxjs';
// import { mergeMap, catchError } from 'rxjs/operators';

// @Injectable()
// export class HttpAuthInterceptor implements HttpInterceptor {
//   constructor(private injector: Injector) { }

//   NoticeMothed = 'msg';

//   get router() {
//     return this.injector.get(Router);
//   }

//   private httpResponseSuccess = (
//     authReq: any,
//     event: HttpResponse<any>,
//   ): Observable<any> => {
//     let $message = '';
//     try {
//       // this.httpService.end();
//       const $httpCode = event.status;
//       const $notice = 'Info';
//       const data = event.body;

//       switch ($httpCode) {
//         case 200:
//           break;
//         case 201:
//           break;
//         case 202:
//           break;
//         case 203:
//           break;
//         case 204:
//           break;
//         case 205:
//           break;
//       }

//     } catch (e) {
//       console.error(e);
//     }
//     return of(Object.assign(event, { message2: $message }));
//   };

//   private httpResponseError = (
//     authReq: any,
//     err: HttpErrorResponse,
//   ): Observable<any> => {
//     let $message = '';
//     try {
//       // this.httpService.end();
//       const $http_code = err.status;
//       let $notice = 'error';
//       const data = err.error;

//       const format_validate_message = function ($str: any) {
//         let $msg_str = $str;
//         if (isTypeCheck('isArray', $str)) {
//           $msg_str = $str.join('<br/>');
//           $msg_str =
//             `<div style='width: 100%'><span style='font-size: 20px;color: red'>` +
//             $msg_str +
//             `</span></div>`;
//         }
//         return $msg_str;
//       };

//       if (typeof data === 'object' && data.message) {
//         $message += data.message;
//       }

//       switch ($http_code) {
//         case 400:
//           break;
//         case 401:
//           // 退出系统
//           setTimeout(() => {
//             this.router.navigate(['/passport/login']);
//           }, 2000);
//           // _utils.storage_clear(configService);
//           break;
//         case 403:
//           break;
//         case 404:
//           break;
//         case 406:
//           break;
//         case 410:
//           break;
//         case 411:
//           break;
//         case 412:
//           break;
//         case 422:
//           $notice = '';
//           break;
//         case 500:
//           break;
//         case 504:
//           break;
//       }
//       if ($message && $notice) {
//       }
//     } catch (e) {
//       console.error(e);
//     }
//     return throwError(Object.assign(err, { message2: $message }));
//   };

//   intercept(
//     req: HttpRequest<any>,
//     next: HttpHandler,
//   ): Observable<
//     | HttpSentEvent
//     | HttpHeaderResponse
//     | HttpProgressEvent
//     | HttpResponse<any>
//     | HttpUserEvent<any>
//   > {
//     const authReq = req.clone({
//       headers: req.headers,
//       withCredentials: true,
//     });
//     return next.handle(authReq).pipe(
//       mergeMap((event: any) => {
//         // 允许统一对请求错误处理，这是因为一个请求若是业务上错误的情况下其HTTP请求的状态是200的情况下需要
//         if (
//           event instanceof HttpResponse &&
//           [200, 201, 202, 203, 204, 205, 206].indexOf(event.status) > -1
//         )
//           return this.httpResponseSuccess(authReq, event);
//         // 若一切都正常，则后续操作
//         return of(event);
//       }),
//       catchError((err: HttpErrorResponse) => {
//         return this.httpResponseError(authReq, err);
//       }),
//     );
//   }

// }

// const isTypeCheck = function (typeName: string, obj: any) {
//   // console.log(typeName);
//   return (
//     typeName
//       .toLowerCase()
//       .slice(2)
//       .trim() === typeCheck(obj)
//   );
// };

// /**
// * 判断类型
// * @param {*} o
// */
// const typeCheck = function (o: any) {
//   const s: any = Object.prototype.toString.call(o);
//   if (s) {
//     return s
//       .match(/\[object (.*?)\]/)[1]
//       .toLowerCase()
//       .trim();
//   } else {
//     return null;
//   }
// };
