import { Injectable, Injector } from '@angular/core';
import { Data } from "./data";
import { Category } from "./category";
import { Diagnosis } from "./diagnosis";
import { Followup } from "./followup";
import { Image } from "./image";
import { ImageItem } from "./image-item";
import { Invoice } from "./invoice";
import { Lab } from "./lab";
import { LabItem } from "./lab-item";
import { Mail } from "./mail";
import { Med } from "./med";
import { MedicalHistory } from "./medical-history";
import { Note } from "./note";
import { Order } from "./order";
import { OrderItem } from "./order-item";
import { Pathway } from "./pathway";
import { Problem } from "./problem";
import { Report } from "./report";
import { Request } from "./request";
import { Screening } from "./screening";
import { Todo } from "./todo";
import { Upload } from "./upload";
import { User } from "./user";
import { Visit } from "./visit";
import { ShortMessageModel } from './shortMessage';

@Injectable({
    providedIn: 'root',
})
export class AllModel {

    constructor(private injector: Injector) { }

    get category() { return this.injector.get(Category); }
    get data() { return this.injector.get(Data); }
    get diagnosis() { return this.injector.get(Diagnosis); }
    get followup() { return this.injector.get(Followup); }
    get image() { return this.injector.get(Image); }
    get imageItem() { return this.injector.get(ImageItem); }
    get invoice() { return this.injector.get(Invoice); }
    get lab() { return this.injector.get(Lab); }
    get labItem() { return this.injector.get(LabItem); }
    get mail() { return this.injector.get(Mail); }
    get med() { return this.injector.get(Med); }
    get medicalHistory() { return this.injector.get(MedicalHistory); }
    get note() { return this.injector.get(Note); }
    get order() { return this.injector.get(Order); }
    get orderItem() { return this.injector.get(OrderItem); }
    get pathway() { return this.injector.get(Pathway); }
    get problem() { return this.injector.get(Problem); }
    get report() { return this.injector.get(Report); }
    get request() { return this.injector.get(Request); }
    get screening() { return this.injector.get(Screening); }
    get todo() { return this.injector.get(Todo); }
    get upload() { return this.injector.get(Upload); }
    get user() { return this.injector.get(User); }
    get visit() { return this.injector.get(Visit); }
    get shortMessageModel() { return this.injector.get(ShortMessageModel); }
}
