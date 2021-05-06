import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, Inject, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { AllServices } from '../../core/common-services';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'allergy',
  templateUrl: './allergy.component.html',
  styleUrls: ['./allergy.component.scss']
})
export class AllergyComponent implements OnInit {
  allergyList: any;
  selectedAllergyList: any;
  reaction: any;
  filter: any;
  loading: any;
  temp: any;


  constructor(
    public allServices: AllServices,
    public dialogRef: MatDialogRef<AllergyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    if (data.allergyList)
      this.selectedAllergyList = data.allergyList;
    else
      this.selectedAllergyList = [];
  }


  ngOnInit() {
    this.filter = '';
    this.allServices.categoryService.getCategoriesByFilter({ 'label.en': 'allergy reaction' }).then((data) => {
      this.temp = data;
      if (this.temp.length > 0)
        this.reaction = this.temp[0];
      console.log('reaction', this.reaction)
    });
  }

  /* searchMeds(){
     this.allergyList=[]
     this.loading=true;
         this.orderItemService.getByFilter(
           {$or:[{name: {"$regex": this.filter}},
                {internalName:{"$regex": this.filter}}],
             orderType:'medication'}).then((data) => {
                 
             this.allergyList=data;
             console.log ('this.allergyList',this.allergyList)
           this.loading=false;
         })
      }*/
  searchMeds() {
    this.loading = true;
    this.allergyList = [];
    this.allServices.orderItemsService.getMedications().then((data) => {
      this.temp = data;
      for (let item of this.temp) {
        this.allergyList.push(item.medicationName)
      }
      console.log('this.allergyList', this.allergyList)
      this.loading = false;
    })
  }


  searchOther() {
    this.allergyList = [];
    this.loading = true;
    this.allServices.categoryService.getCategoriesByFilter(
      {
        $or: [{ name: { "$regex": this.filter } },
        { internalName: { "$regex": this.filter } }],
        field: 'allergy'
      }).then((data) => {
        this.temp = data;
        if (this.temp.length > 0) {
          this.allergyList = []
          for (let item of this.temp) {
            this.allergyList.push(item.label.ch)
          }
        }
        console.log('this.allergyList', this.allergyList)
        this.loading = false;
      })
  }


  select(allergy: any) {
    //  alert('selected')
    if (!this.findAllergy(allergy))
      this.selectedAllergyList.push({ allergy: allergy, reactions: [] })
    else {
      var item = this.findAllergy(allergy);
      this.selectedAllergyList.splice(this.selectedAllergyList.indexOf(item), 1)
    }
  }

  findAllergy(allergy: any) {
    for (let item of this.selectedAllergyList) {
      if (allergy == item.allergy)
        return item;
    }
  }


  findReaction(allergy: any, option: any) {
    for (let item of this.selectedAllergyList) {
      if (item.reactions.indexOf(option.text) > -1 && allergy == item.allergy)
        return option;
    }
  }


  selectReaction(allergy: any, option: any) {
    option.selected = true;
    for (let item of this.selectedAllergyList) {
      if (allergy == item.allergy) {
        if (item.reactions.indexOf(option.text) < 0)
          item.reactions.push(option.text);
        else {
          item.reactions.splice(item.reactions.indexOf(option.text), 1);
        }
      }
    }
  }


  save() {
    console.log('this.selectedAllergyList', this.selectedAllergyList)
    this.dialogRef.close(this.selectedAllergyList);
  }


  close() {
    this.dialogRef.close();
  }
}
