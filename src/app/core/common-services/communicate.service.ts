import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
/**
 * 发布者,订阅者方式传递消息
 */
export class CommunicateService {

  /**
   * 菜单定位专用,不要乱用此功能
   */
  // 发布者发送数据
  private subject = new Subject<string>();
  // 订阅者接收数据
  ob = this.subject.asObservable();
  // 发布方法
  send(info: any){
    this.subject.next(info);
  }
  
  
  constructor() { }


  /**
   * 如果需要可以在后面自己加方法,不要用以前的,
   * 发布和订阅应该是一一对应的:一个发布对应一个订阅;
   */
  // 发布者发送数据
  private subjectLoginMsg = new Subject<string>();
  // 订阅者接收数据
  obLoginMsg = this.subjectLoginMsg.asObservable();
  // 发布方法
  sendLoginMsg(info: any){
    this.subjectLoginMsg.next(info);
  }
}
