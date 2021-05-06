import {
  Component, OnInit, OnChanges, AfterViewInit, ElementRef,
  ViewChild, Inject, Input, Output, EventEmitter
} from '@angular/core';
import { Title } from "@angular/platform-browser";
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MessageBoxComponent } from '../../core/common-components/message-box/message-box.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiUrl } from '../../core/models/api-url';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { FileUploader } from 'ng2-file-upload';
import wx from 'weixin-jsapi';
import { AllServices } from '../../core/common-services';
import * as Peer from 'peerjs';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from 'ngx-qrcode2';

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnChanges, AfterViewInit {
  // 二维码链接
  code_url: any;
  // 二维码链接相关
  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  // H5支付返回的mweb_url
  mweb_url: any;
  // 定时任务状态
  interval: any;
  // 是否关闭咨询
  isClosed: any;
  // 是否支付成功
  isPaySuccess: any;
  //文档弹框里tab
  summaryShow:boolean = true;
  labShow:boolean = false;
  imageShow:boolean = false;
  reportShow:boolean = false;
  articleShow:boolean = false;
  isPc: any;
  isWeixin: any;
  optionSelected: boolean = false;
  @ViewChild('myCallVideo') myCallVideo: any;
  @ViewChild('myAnswerVideo') myAnswerVideo: any;
  @ViewChild('fileInput') myFileInput: any;

  @ViewChild('messageInput', { read: ElementRef })
  myMessageInput!: ElementRef;
  @ViewChild('messageBox')
  private messageBox!: ElementRef;
  @Input() selected: any;
  @Input() messages: any;
  peer: any;
  anotherid: any;
  myPeerId: any;
  @Input() user: any;
  patients: any;
  signature: any;
  myPeer: any;
  isVideo: any;
  isAudio: any;
  connecting: any;
  localStream: any;
  connection: any;
  connectionMessage: any;
  remotePeerId: any;
  files: any;
  isText: any;
  isCapture: any;
  color: any;
  remoteId: any;
  connected: any;
  message: any;
  @Input() bigScreen: any;
  remoteStream: any;
  gettingNewMessage: any;
  remoteCall: any;
  videoComing: any;
  noAnswer: any;
  fileType: any;
  patient: any;
  temp: any;
  selectedPatient: any;
  file: any;
  summaryObSets: any;
  @Input() language: string;
  labSets: any;
  visits: any;
  loading: any;
  selectedPatients: any;
  articles: any;
  images: any;
  addFiles: any;
  @Input() visit: any;
  forms: any;
  @Input() profile: any;
  consultForm: any;
  chatRoom: any;
  visitPaid: any;
  provider: any;
  receipt: any;
  screenHeight: any;
  screenWidth: any;
  screenSize: any;
  innerHeight: any;
  outerHeight: any;
  showVideo: any;
  tempMessage: any;
  newVisit: any;
  @Output() messageEvent = new EventEmitter<Boolean>();
  @Output() visitEvent = new EventEmitter<String>();
  public uploader: FileUploader = new FileUploader({ url: this.apiUrl.setFormUpload, itemAlias: 'photo' });

  constructor(
    private apiUrl: ApiUrl,
    private allService: AllServices,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private dialogRef: MatDialogRef<ChatComponent>,
    public router: Router,
    public route: ActivatedRoute,
    private dialog: MatDialog,
    private titleService: Title,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.user = this.storage.get('user');

    if (!this.selected) {
      this.selected = data.selected;

    }
    if (!this.user) {
      this.user = data.user;
    }
    if (data) {
      this.visit = data.visit;
      this.profile = data.profile;
    }

    // 是否是pc浏览器访问
    this.isPc = this.storage.get('isPc');
    // 是否是微信app内打开项目
    this.isWeixin = this.storage.get('isWeixin');
    this.bigScreen = this.storage.get('bigScreen')
    this.language = this.storage.get('language')
    this.color = this.storage.get('color');
    this.summaryObSets = [];
    this.labSets = [];
    this.visits = [];
    this.articles = [];
  }

  getScreenSize(event?: any) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    this.screenSize = { height: this.screenHeight, width: this.screenWidth }
    console.log('this.screenWidth. this.screenHeight', this.screenSize.Width, this.screenSize.height)
    if (this.bigScreen == 0) {
      this.outerHeight = this.screenSize.height * 0.9;
      this.innerHeight = this.screenSize.height * 0.8;
    } else if (this.bigScreen == 1) {
      this.outerHeight = this.screenSize.height * 0.8;
      this.innerHeight = this.screenSize.height * 0.7;
    }
  }


  ngOnInit() {
    this.scrollToBottom();
    console.log ('selected=========', this.selected)
    if (this.user.role == 'provider') {
      this.isClosed = true;
    } else {
      this.isClosed = false;
    }
  }

  /**
   * 文档弹框tab切换
   */
  documentTabFn(val:any) {
    console.log('val',val)
    if(val == 'summary') {
      this.summaryShow = true;
      this.labShow = false;
      this.imageShow = false;
      this.reportShow = false;
      this.articleShow = false;
    }else if(val == 'image') {
      this.summaryShow = false;
      this.labShow = false;
      this.imageShow = true;
      this.reportShow = false;
      this.articleShow = false;
      this.getImageSets();
    }else if(val == 'lab') {
      this.summaryShow = false;
      this.labShow = true;
      this.imageShow = false;
      this.reportShow = false;
      this.articleShow = false;
      this.getLabSets();
    }else if(val == 'report') {
      this.summaryShow = false;
      this.labShow = false;
      this.imageShow = false;
      this.reportShow = true;
      this.articleShow = false;
      this.getVisits();
    }else if(val == 'article') {
      this.summaryShow = false;
      this.labShow = false;
      this.imageShow = false;
      this.reportShow = false;
      this.articleShow = true;
      this.getArticles();
    }
  }

  /**
   * 关闭咨询,将咨询状态改成reserved状态
   */
  closeVisit() {
    if (this.visit) {
      let filter = {
        _id: this.visit._id,
        status: 'reserved'
      }
      this.allService.visitsService.updateVisit(filter).then((data) => {
        console.log('visit date updated', this.data);
        this.chatRoom = false;
      })
    }
  }


  ngOnDestroy() {
   
    clearInterval(this.interval);
  }


  ngOnChanges() {
    //debugger;
    //  this.messages=[];
    this.isText = true;
    this.addFiles = false;
    this.myPeerId = this.user._id;
    if (this.selected) {
      if (this.selected.role == 'patient') {
        this.patient = this.selected
        this.provider = this.user;

      } else if (this.selected.role == 'provider') {
        this.patient = this.user;
        this.provider = this.selected;
        this.titleService.setTitle(this.provider.name + '医师咨询室')

      }
      if (!this.visit) {
        this.consultForm = false;
        this.chatRoom = false;
        this.getForm(this.profile);
        // this.payment();
      } else {
        this.consultForm = false;
        this.chatRoom = true;
        if (this.user.role == 'provider') {
          this.isClosed = true;
        } else {
          this.isClosed = false;
        }
      }
      this.anotherid = this.selected._id;
      this.remotePeerId = this.selected._id;
      this.createPeer();
      this.connectMsg();
      this.listenVideo();
      this.reNameFile();
      this.uploadFile();

      this.getMessages(this.selected);
      // this.scrollToBottom();

    }
  }


  getForm(profile: any) {

    if (!this.forms) {
      this.forms = [];

      if (this.visit) {
        var visitID = this.visit._id;
      }
      var storageForms = this.storage.get('forms');
      console.log('storageForms===================', storageForms)
      if (!storageForms) {
        this.loading = true;
        this.allService.categoryService.getForm({
          profileIDs: [profile._id],
          formTypes: ['profile registry'],
          visitID: visitID,
          patientID: this.patient._id
        }).then((data: any) => {
          this.loading = false;
          this.forms = data;
          console.log('forms', this.forms);
          this.getConfig();
        })
      } else {
        this.allService.categoryService.getCategory(profile._id).then((data: any) => {
          this.temp = data;
          if (this.temp) {
            for (let formItem of this.temp.forms) {
              if (storageForms[0]._id == formItem._id) {
                this.forms = storageForms;
              }
            }
            if (this.forms.length == 0) {
              this.loading = true;
              this.allService.categoryService.getForm({
                profileIDs: [profile._id],
                formTypes: ['profile registry'],
                //  visitID:visitID,
                patientID: this.patient._id
              }).then((data: any) => {
                console.log('forms', data)
                this.loading = false;
                this.forms = data;
                this.getConfig();
              })
            } else {
              this.getConfig();
            }
          }
        })
      }
    }
  }


  getMessages(selected: any) {
    // alert('selected._id'+selected._id)
    //  if (!this.messages){
    this.messages = [];
    if (this.user.role == 'provider') {
      this.allService.mailService.getMailByFilter(
        {
          '$or': [{ '$and': [{ 'userID': this.user._id }, { 'patientID': selected._id }] },
          { '$and': [{ 'userID': selected._id }, { 'providerID': this.user._id }] }
          ]
        }
      ).then((data: any) => {
        this.messages = data;
        //  console.log ('this.messages',this.messages)
        if (this.messageBox)
          this.messageBox.nativeElement.scrollTop = this.messageBox.nativeElement.scrollHeight;

      })
    } else if (this.user.role == 'patient') {
      this.allService.mailService.getMailByFilter(
        {
          '$or': [{ '$and': [{ 'userID': this.user._id }, { 'providerID': selected._id }] },
          { '$and': [{ 'userID': selected._id }, { 'patientID': this.user._id }] }
          ]
        }).then((data: any) => {
          this.messages = data;
          console.log('this.messageBox=====', this.messages)
          console.log('this.messageBox=====', this.messageBox)
          // this.scroolToBottom();
          // this.storage.set('messageBox', this.messageBox)
          if (this.messageBox)
            this.messageBox.nativeElement.scrollTop = this.messageBox.nativeElement.scrollHeight;
        })
    }
  }

  scrollToBottom() {
    this.messageBox.nativeElement.scrollTop = this.messageBox.nativeElement.scrollHeight;
  }


  ngAfterViewInit() {
    if (this.myMessageInput)
      setTimeout(() => this.myMessageInput.nativeElement.blur(), 200);
  }


  close() {
    var chatRoom = false
    this.messageEvent.emit(chatRoom);
    this.visitEvent.emit(this.newVisit);
    // this.dialogRef.close({visit:this.visit});
  }


  createPeer() {

    let connOption = {
      //host: "47.101.41.210",
      host: "www.digitalbaseas.com",
      port: 443,
      path: "/ws/",
      debug: 3,
      reliable: true,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:19302" },
          {
            urls: "turn:numb.viagenie.ca",
            credential: "muazkh",
            username: "webrtc@live.com"
          }
        ]

      }
    };
    if (this.myPeer) {
      this.myPeer.destroy();
      this.myPeer = new Peer(this.myPeerId, connOption);

    } else {
      this.myPeer = new Peer(this.myPeerId, connOption);
      console.log(this.myPeer);
    }
  }

  //listen to the other side
  connectMsg() {
    this.isVideo = false;
    this.isAudio = false;
    this.isText = true;
    this.isCapture = false;
    //  this.connect();
    let peerOptions = {};

    this.connection = this.myPeer.connect(this.remotePeerId, peerOptions);
    this.connectMessage();
  }

  connectMessage() {
    this.myPeer.on("connection", (con: any) =>
      this.onIncomingDataConnection(con)
    );
  }

  onConnectedToPeerJS() {

    console.log('this.connection-1', this.connection);
    this.subscribeToDCEvents();
  }

  onIncomingDataConnection(con: any) {
    console.log(`Incoming dc:`, con);
    this.connection = con;
    this.remoteId = con.peer;

    this.subscribeToDCEvents();
  }

  subscribeToDCEvents() {
    this.connection.on("open", () => {
      console.log(`DC opened!`);
      this.connecting = false;
      this.connected = true;
    });
    this.connection.on("close", () => {
      console.log(`DC closed!`);
    });

    this.connection.on("data", (newMessage: any) => {
      this.gettingNewMessage = true;
      this.onReceiveData(newMessage);

    });

    this.connection.on("error", (error: any) => {
      console.error(`DC error:${error}`);
    });
  }


  /* onReceiveData(data: any) {
     console.log("Received data......");
     if (!this.messages)
       this.messages = [];
     this.messages.push(data);
     this.gettingNewMessage = false;
     this.scrollBottom();
   }*/

  onReceiveData(data: any) {
    console.log("Received data......");
    if (!this.messages)
      this.messages = [];
    if (this.user.role == 'patient') {
      this.tempMessage = {
        contentList: [{ message: data }],
        userID: this.user._id,
        providerID: this.selected._id,
        status: 'active'
      }
    }
    else if (this.user.role == 'provider') {
      this.tempMessage = {
        contentList: [{ message: data }],
        userID: this.user._id,
        patientID: this.selected._id,
        status: 'active'
      }
    }

    this.messages.push(this.tempMessage);
    this.gettingNewMessage = false;
    this.scrollBottom();
    /* if (data&&data.filetype) {
       console.log("Received  file......");
       console.log(data);
       var blob = new Blob([data.file], { type: data.filetype });
       var url = URL.createObjectURL(blob);
      if(!this.messages)
      this.messages=[];
       this.messages.push({
         id: this.remotePeerId,
         message: this.messageFile(data, url),
         messageObj:{filename:data.filename, 
           filetype:data.
           filetype, 
           url:this.sanitizer.bypassSecurityTrustUrl(url)}
       });
       this.gettingNewMessage=false;
     
     } 
     else {
       console.log("Received data......");
       this.messages.push(data);
       this.gettingNewMessage=false;
     }*/


  }


  getUrl(image: any) {
    return this.allService.utilService.getHttpUrl(image);
  }

  reNameFile() {
    if (this.user.role == 'patient') {
      this.patient = this.user
    } else if (this.selected.role == 'patient') {
      this.patient = this.selected
    }
    console.log('upload onafteraddingfile-1')
    this.uploader.onAfterAddingFile = (file: any) => {
      //     console.log ('upload onafteraddingfile-2')
      if (this.fileType == 'lab' && file) {
        //      console.log ('upload onafteraddingfile-3')
        this.allService.labsService.create({ patientID: this.patient._id, uploaded: 'true' }).then((data: any) => {
          this.file = data;
          file.file.name = this.file._id + '.png';
          file.withCredentials = false;
          this.uploader.uploadAll();
        })

      } else if (this.fileType == 'image' && file) {
        this.allService.imagesService.create({ patientID: this.patient._id, uploaded: 'true' }).then((data: any) => {
          this.file = data;
          file.file.name = this.file._id + '.png';
          file.withCredentials = false;
          this.uploader.uploadAll();

        })
      } else if (this.fileType == 'medical file' && file) {

        this.allService.imagesService.create({ patientID: this.patient._id, about: 'medical file', uploaded: 'true' }).then((data: any) => {
          this.file = data;

          file.file.name = this.file._id + '.png';
          file.withCredentials = false;
          this.uploader.uploadAll();
        })
      }

    };
  }


  uploadFile() {

    this.uploader.progress = 0;
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log('this.file, this.file')
      if (this.fileType == 'image')
        this.sendImage(this.file);
      else if (this.fileType == 'lab')
        this.sendLabImage(this.file);
      else if (this.fileType == 'medical file')
        this.sendHealthFile(this.file);
      console.log('ImageUpload:uploaded:', item, status, response);

      console.log('photo', response)

      this.allService.alertDialogService.success('文件上传成功');
      this.scrollToBottom();
    }
  }

  addFile(file: any) {
    var file_name = file.name;
    var file_url = file.url;
    var files = this.files;

    files.push({
      id: this.randomId(),
      url: file_url,
      name: file_name
    });
  }
  randomId() {
    return Math.random()
      .toString(36)
      .substring(
        6,
        10
      );
  }
  sendMessage_old() {
    const newMessage = {
      id: this.myPeerId,
      message: this.message
    };


    this.messages.push(newMessage);
    this.message = "";

    this.scrollBottom();
  }


  scrollBottom() {
    var myDiv = document.getElementById("outer");
    if (myDiv) {
      // console.log(myDiv.position());
      //console.log(myDiv.scrollTop);
      //console.log(myDiv.scrollHeight);
      myDiv.scrollTop = myDiv.scrollHeight;
      //myDiv.scrollIntoView(false);
      // window.scrollTo(0, myDiv.innerHeight);
      // myDiv.animate({ scrollTop: myDiv.scrollHeight });
      //console.log(myDiv);
      myDiv.scrollIntoView();
    }
  }


  connectVideo() {
    this.isVideo = true;
    this.isAudio = true;
    //this.isText = false;
    this.isCapture = false;
    if (!this.connected)
      this.connect();
    else {
      this.allService.alertDialogService.alert('no one is on the other side, please try again later')
    }
  }


  connectAudio() {
    this.isVideo = false;
    this.isAudio = true;
    this.isText = false;
    this.isCapture = false;
    if (this.connected)
      this.connect();
    else {
      this.allService.alertDialogService.alert('no one is on the other side, please try again later')
    }
  }

  connectClose() {
    if (this.connection) {
      this.closeConnection();
      this.defaultConnect();
    }
  }


  listenVideo() {
    if (this.myPeer.disconnected) {
      this.myPeer.destroy();
      console.log("peer is destroyed");
      this.myPeer = null;
      this.createPeer();
    }
    this.myPeer.on('call', (remoteCall: any) => {

      if (remoteCall) {
        this.videoComing = true;

        this.isText = false;
        this.remoteCall = remoteCall;

        //if this is the person wheo make the phone call
        console.log(' this.remoteStream==================1', this.remoteCall)
        if (this.remoteStream) {
          this.answerVideo(this.remoteCall);
        }
      }
    })
  }

  answerVideo(remoteCall: any) {

    this.videoComing = false;
    var n = <any>navigator;
    n.getUserMedia = n.getUserMedia
      || n.webkitGetUserMedia
      || n.mozGetUserMedia
      || n.msGetUserMedia;
    //answer
    n.getUserMedia({ audio: this.isAudio, video: this.isVideo },
      (stream: any) => {
        this.remoteStream = stream;
        const answerVideo = this.myAnswerVideo.nativeElement;
        remoteCall.answer(stream); // Answer the call with an A/V stream.
        remoteCall.on('stream', (remoteStream: any) => {
          if (answerVideo) {
            answerVideo.srcObject = remoteStream;
            //video.play();
            console.log("&&&&&&&answering");
          }
        });
      }, (err: any) => {
        console.error('Failed to get local stream', err);
      });


  }


  connect() {
    if (this.myPeer.disconnected) {
      this.myPeer.destroy();
      console.log("peer is destroyed");
      this.myPeer = null;
      this.createPeer();
    }

    if (this.remoteCall) {
      this.answerVideo(this.remoteCall);
    }

    //call
    if (this.connection.open) {
      var n = <any>navigator;
      n.getUserMedia = n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia || n.msGetUserMedia;

      n.getUserMedia(
        { audio: this.isAudio, video: this.isVideo },
        (stream: any) => {
          this.localStream = stream;
          console.log('this.myPeer===========================', this.myPeer)
          if (this.myPeer) {
            const myCall = this.myPeer.call(this.remotePeerId, stream);

            //  this.myCall = myCall;
            myCall.on("stream", (remoteStream: any) => {
              this.remoteStream = remoteStream;
              const myVideo = this.myCallVideo.nativeElement;
              if (myVideo) {
                myVideo.srcObject = this.localStream; //remoteStream;
                console.log("Connected with local Video and Audio");
              }
            });
          }
        },
        (error: any) => {
          console.error(error);
          this.noAnswer = true;
          console.log('no answer!!!')
        }
      );
    }
  }


  connectCamera() {

    this.isCapture = true;
    var n = <any>navigator;

    const getUserMedia = (n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia || n.msGetUserMedia);
    // Grab elements, create settings, etc.
    if (getUserMedia) {
      console.log("Got a UserMedia");
      getUserMedia(
        { video: true, aspectRatio: "3:4" },
        (stream: any) => {

          const myVideo = this.myCallVideo.nativeElement;
          if (myVideo) {
            myVideo.srcObject = stream;
            console.log("Connected with local Video and Audio");
          }
        },
        (error: any) => console.error(error)
      );
    }
  }

  uploadLab() {
    this.fileType = 'lab'
    let fileLoad = this.myFileInput.nativeElement;
    fileLoad.click();
  }


  uploadImage() {
    this.fileType = 'image'
    let fileLoad = this.myFileInput.nativeElement;
    fileLoad.click();
  }


  uploadMedicalFile() {
    this.fileType = 'medical file'
    let fileLoad = this.myFileInput.nativeElement;
    fileLoad.click();
  }


  messageFile(msg: any, url: any) {
    msg.isImg = msg.filetype.match(/(jpg|jpeg|png|gif)$/i);
    var str;
    if (!msg.isImg) {

      str = '<a href="' + url + '" target="_blank">' + msg.filename + "</a>";
    } else {
      str =
        '<a href="' +
        url +
        '" target="_blank">' +
        '<img src="' +
        url +
        '"  alt="untitled" height="42" width="42"><img>' +
        "</a>";
    }
    return str;
  }


  disconnect(id: any, msg: any) {
    this.closeConnection();
    this.messages.push({
      id: id,
      message: msg + ": " + id
    });

    this.defaultConnect();
    console.log("disconnect");
  }


  sendFile(event: any) {
    console.log(event.target.files);
    var file = event.target.files[0];
    var blob = new Blob(event.target.files, { type: file.type });
    var url = URL.createObjectURL(blob);

    if (this.connection) {
      console.log("sending files....");
      console.log(this.connection);
      this.connection.send({
        file: blob,
        filename: file.name,
        filetype: file.type
      });
      if (!this.messages)
        this.messages = [];
      this.messages.push({
        id: this.myPeerId,
        messageObj: {
          filename: file.name,
          filetype: file.type,
          url: this.allService.utilService.getUrl(url)
        },
        message: this.messageFile(
          {
            filename: file.name,
            filetype: file.type,

          },
          url
        )
      });
      console.log('messages', this.messages)
    }
  }

  findMsg(messageObj: any) {
    return messageObj.filetype.match(/(jpg|jpeg|png|gif)$/i);
  }


  closeConnection() {
    //  if (this.isText) {
    if (this.connection) {
      this.connection.close();
      if (this.myPeer) {
        this.myPeer.destroy();
        console.log("peer is destroyed");
        this.myPeer = null;
      }
      if (this.localStream) {
        this.localStream.getVideoTracks()[0].stop();
      }
    }

  }

  defaultConnect() {
    this.isVideo = false;
    this.isAudio = false;
    this.isText = true;
    this.isCapture = false;

    console.log("update UI for disconnection");
  }


  select(item: any) {
    this.anotherid = item._id;
    this.connect();
  }


  videoconnect() {
    let video = this.myCallVideo.nativeElement;
    var localvar = this.peer;
    var fname = this.anotherid;

    //var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    var n = <any>navigator;

    n.getUserMedia = (n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia || n.msGetUserMedia);

    n.getUserMedia({ video: true, audio: true }, function (stream: any) {
      var call = localvar.call(fname, stream);
      call.on('stream', function (remotestream: any) {
        video.src = URL.createObjectURL(remotestream);
        video.play();
      })
    }, function (err: any) {
      console.log('Failed to get stream', err);
    })


  }

  sendMessage() {
    var component = {
      message: this.message
    }
    this.addComponent(component);
  }

  addLab(labSet: any) {
    var component = {
      component: 'lab',
      message: labSet
    }
    this.message = '实验室报告'
    this.addComponent(component);
  }

  addVisit(visit: any) {
    var component = {
      component: 'visit',
      visit: visit
    }
    this.message = '就诊总结'
    this.addComponent(component);
  }


  addSummary(summary: any) {
    var component = {
      component: 'summary',
      message: summary
    }
    this.message = '临床图表'
    this.addComponent(component);
  }


  addImage(image: any) {
    var component = {
      component: 'image',
      message: image
    }
    this.message = '影像报告'
    this.addComponent(component);
  }


  addComponent(component: any) {
    const newMessage = {
      id: this.myPeerId,
      message: component.message
    };
    let mail: any = {
      contentList: [component],
      userID: this.user._id,
      status: 'active'
    }
    if (this.user.role == 'patient') {
      var receiver = this.selected;
      mail.providerID = this.selected._id;
      this.allService.mailService.create(mail).then((data: any) => {
        this.temp = data;
        this.messages.push(this.temp);
        if (this.connection.open) {
          this.connection.send(newMessage);

        }
        else {
          this.sendMail(receiver, this.message);
        }
        this.message = '';
        if (this.addFiles == true) {
          this.addFiles = false;
        }
      })

    } else if (this.user.role == 'provider') {
      var receiver = this.selected;
      mail.patientID = this.patient._id;
      this.allService.mailService.create(mail).then((data: any) => {
        this.temp = data;
        this.messages.push(this.temp);
        console.log('connection.open', this.connection.open)
        if (this.connection.open) {
          this.connection.send(newMessage);

        } else {
          this.sendMail(receiver, this.message);
        }
        this.message = '';
        if (this.addFiles == true) {
          this.addFiles = false;
        }
        console.log('message added', data)
        console.log('this.messageList', this.messages)
      })
    }
  }

  sendImage(image: any) {
    var component = {
      component: 'image',
      message: image
    }
    this.message = '影像报告'
    this.addComponent(component);
  }

  sendLabImage(labImage: any) {
    var component = {
      component: 'labImage',
      message: labImage
    }
    this.message = '实验室报告'
    this.addComponent(component);
  }

  sendHealthFile(medicalFile: any) {
    var component = {
      component: 'medical file',
      message: medicalFile
    }
    this.message = '病历报告'
    this.addComponent(component);
  }

  sendMail(receiver: any, message: any) {
    //debugger;
    console.log(receiver);
    if (receiver && receiver.openID) {// 如果有openid,优先公众号推送
      var image = this.apiUrl.setFormUploadPhoto + String(this.user.photo) + '.png';
      if (this.user.role == 'provider') {
        var receiverRole = 'patient';
        var title = '数基邮箱:' + this.user.name + '医生有一条消息在您的数基健康卡邮箱';
      } else {
        receiverRole = 'provider';
        var title = '数基邮箱:' + this.user.name + '有一条消息在您的数基医生工作室邮箱';
      }
      var filter = {
        openID: receiver.openID,
        message: message,
        title: title,
        url: '/'
          + receiverRole
          + '/'
          + this.user._id,
        picUrl: image
      };
      console.log('mail filter', filter)
      this.allService.mailService.sendMessageLink(filter, 0).then((data: any) => {
        console.log('message sent', message);
      })
    } else if (receiver && receiver.phone) {// 如果没有openid,优先手机短信通知
      var filter1 = {
        mobile: receiver.phone,
        message: message
      }
      this.allService.shortMessageService.sendShortMessageNotification(filter1).then((data: any) => {
        if (data.code == 1) {// 返回code=1则说明发送成功
          console.log('message sent success:', data + message);
        } else {// 如果没有发送成功则返回提示信息即可
          console.log('message sent fail:', data + message);
        }
      });
    }
  }


  getSummaryObSets() {
    var profileIDs = [];
    var formIDs: any[] = [];

    if (this.summaryObSets.length == 0) {
      for (let profile of this.patient.profiles) {
        profileIDs.push(profile._id);
      }
      this.allService.categoryService.getCategoriesByFilter({ _id: { '$in': profileIDs } }).then((data: any) => {
        this.temp = data;

        for (let item of this.temp) {
          for (let form of item.forms) {
            if (form.formType == 'summary') {
              if (formIDs.indexOf(form._id) < 0) {
                formIDs.push(form._id)
              }

            }

          }
        }
        this.allService.categoryService.getCategoriesByFilter({ _id: { '$in': formIDs } }).then((data: any) => {
          this.temp = data;
          for (let item of this.temp) {

            for (let obSet of item.obSets) {
              if (!this.find(obSet, this.summaryObSets))
                this.summaryObSets.push(obSet)
            }
          }
          console.log('this.summaryObSets', this.summaryObSets)
        });
      })
    }
  }


  find(item: any, list: any) {
    for (let i of list) {
      if (i._id == item._id) {
        return true;
      }
    }
    return false;
  }


  getLabSets() {
    console.log('got labs')
    if (this.labSets.length == 0) {
      this.allService.categoryService.getCategoriesByFilter({ 'addLabs': true }).then((data: any) => {
        this.temp = data;
        this.labSets = this.temp;
        console.log('this.LabSets', this.labSets)
      })
    }
  }



  getImageSets() {
    if (this.patient) {
      this.allService.imagesService.getByPatient(this.patient._id).then((data: any) => {
        this.images = data;
        for (let image of this.images) {
          if (image.uploaded) {
            image.url = this.allService.utilService.getImageUrl(String(image._id));
          } else {
            this.allService.datasService.getDatasByFilter2({ patientID: this.patient._id, obID: image.obID, imageID: image._id }).then((data: any) => {
              this.temp = data;
              if (this.temp.length > 0) {
                image.value = this.temp[0].value;
                image.valueList = [];
                image.valueList = this.temp.valueList;
              }

            })
          }
        }
      }, (err: any) => {
        // Check if already authenticated
        console.log("not allowed");
      });
    }
  }


  getVisits() {
    if (this.patient) {
      this.allService.visitsService.getVisitsByPatient(this.patient._id).then((data: any) => {
        this.visits = data;

      }, (err: any) => {
        // Check if already authenticated

        console.log("not allowed");
      });
    }
  }


  getVisit(visit: any) {
    var profileIDs = [];
    var forms: any[] = []
    for (let profile of visit.profiles) {
      profileIDs.push(profile._id)
    }
    this.allService.categoryService.getCategoriesByFilter({ '_id': { '$in': profileIDs } }).then((data: any) => {
      this.temp = data;
      if (this.temp.length > 0) {
        for (let item of this.temp) {
          for (let form of item.forms) {
            if (form.formType == visit.type)
              forms.push(form);
          }
        }
      }
      let dialogConfig = new MatDialogConfig();

      if (this.user.role == 'patient')
        var patient = this.user;
      else
        patient = this.selected;
      //  dialogConfig.disableClose = true;
      // dialogConfig.autoFocus = true;
      console.log('visit', visit)
      dialogConfig = {
        data: {
          'visit': visit,
          'patient': patient,
          'forms': forms,
          'language': this.language,
          'reportFromChat': true
        }
      }

      if (this.bigScreen == 0) {
        dialogConfig.maxWidth = '92vw',
          dialogConfig.maxHeight = '95vh',
          dialogConfig.height = '95%',
          dialogConfig.width = '92%'
      } else if (this.bigScreen == 1) {
        dialogConfig.maxWidth = '70vw',
          dialogConfig.maxHeight = '80vh',
          dialogConfig.height = '80%',
          dialogConfig.width = '70%'
      }

      const dialogRef = this.dialog.open(MessageBoxComponent,
        dialogConfig);
    })
  }


  getArticles() {
    if (this.patient) {
      this.allService.categoryService.getCategoriesByFilter({ 'formType': { '$in': ['education', 'publish'] } }).then((data: any) => {
        this.articles = data;

      }, (err: any) => {
        // Check if already authenticated

        console.log("not allowed");
      });
    }

  }

  addArticle(article: any) {
    //adde from patient
    if (this.user.role == 'provider') {

      var patientID = this.selected._id;
      var providerID = this.provider._id;
      var receiver = this.provider;


    }
    //adde from provider
    var mail = {
      contentList: [{ component: 'article', article: { _id: article._id, label: article.label, image: article.image, formType: article.formType } }],
      userID: this.user._id,
      patientID: patientID,
      providerID: providerID,
      status: 'active'
    }
    this.allService.mailService.create(mail).then((data: any) => {
      this.temp = data;
      var component = {
        component: 'article',
        message: this.temp
      }
      this.message = '患者教育'
      this.addComponent(component);

    })
  }
  getArticle(article: any) {

    // if (visit.type!='followup'){
    let dialogConfig = new MatDialogConfig();
    var param = {
      'form': { _id: article._id, formType: article.formType },

      'language': this.language,
    };
    if (this.bigScreen == 0) {
      dialogConfig = {
        data: param,
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%'
      }
    } else {
      dialogConfig = {
        data: param,
        maxWidth: '80vw',
        maxHeight: '90vh',
        height: '90%',
        width: '80%'
      }
    }
    // update
    // if (article.formType == 'education') {
    //   const dialogRef = this.dialog.open(EducationDetailComponent,
    //     dialogConfig);
    // } else if (article.formType == 'publish') {
    //   const dialogRef = this.dialog.open(PublishComponent,
    //     dialogConfig);
    // }
  }


  closeConsultForm() {
    this.consultForm = false;
    var chatRoom = false
    this.messageEvent.emit(chatRoom);
  }


  getTransfer() {
    var filter = {
      "visitId": this.visit._id,

      //  "provider": "Liang Wu",
      // "popenId": "oN_YY0y3EEXFItLEZ4_ai59104wY",
      "tranferfee": 100,
      "desc": "transfered to doctor",
    }
    this.allService.paymentService.transfer(filter).then((data: any) => {
      this.temp = data;
      console.log('invoice transfer', this.temp)
      if (this.temp.code == 200) {
        this.allService.visitsService.update({ _id: this.visit._id, status: 'completed' }).then((data: any) => {
          this.allService.alertDialogService.alert('trasfer success!');
          var chatRoom = false
          this.messageEvent.emit(chatRoom);
        })
      } else {
        this.allService.alertDialogService.alert('transfer failed')
      }
    })
  }


  //get patient folder
  selectPatient(patient: any) {

    this.loading = true;
    this.selectedPatients = [];
    this.selectedPatients = this.storage.get('selectedPatients');
    this.storage.set('patient', patient)

    this.selectedPatients = this.storage.get('selectedPatients');
    if (!this.selectedPatients)
      this.selectedPatients = [];
    if (!this.find(patient, this.selectedPatients))
      this.selectedPatients.splice(0, 0, patient)
    console.log('this.selectedPatients', this.selectedPatients);
    this.storage.set('selectedPatients', this.selectedPatients);
    this.storage.set('selectedPatient', patient);
    this.loading = false;
    if (this.bigScreen == 1)
      this.router.navigate(['/homepage/home/selected-patients']);
    else if (this.bigScreen == 0) {
      let dialogConfig = new MatDialogConfig();

      //  dialogConfig.disableClose = true;
      // dialogConfig.autoFocus = true;
      dialogConfig = {
        data: {
          'patient': patient,
          'language': this.language,
        },
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%'
      }
      // update
      // const dialogRef = this.dialog.open(PatientStoryComponent,
      //   dialogConfig);
    }
  }


  getConfig() {
    var link = location.href.split('#')[0];
    var jsApiList: string[] = ['chooseWXPay'];
    this.allService.weixinJsapiService.getJsapiConfig(link, jsApiList);
  }

  refund() {

  }
  
}