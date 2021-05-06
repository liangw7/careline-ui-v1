import { Component, OnInit, Inject, ComponentFactoryResolver } from '@angular/core';
import { AllServices } from '../../core/common-services';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'add-labs',
  templateUrl: './add-lab.component.html',
  styleUrls: ['./add-lab.component.scss']
})
export class AddLabsComponent implements OnInit {
  data: any;
  categories: any;
  field: any;
  newCategory: any;
  selectedItems: any;
  option: any;
  ob: any;
  obSet: any;
  form: any;
  interventionProfile: any;
  activity: any;
  activityType: any;
  selectedActivityItems: any;
  type: any;
  showSave: any;
  profile: any;
  calculationObs: any;
  calculationOb: any;
  lab: any;
  image: any;
  orderMaster: any;
  fields: any;
  resource: any;
  patientListOb: any;
  patientListOptions: any;
  temp: any;
  options: any;
  singleSelection: any;
  report: any;
  medsClass: any;


  constructor(
    public allServices: AllServices,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<AddLabsComponent>,
    @Inject(MAT_DIALOG_DATA) public param: any
  ) {
    
    this.data = param;
    this.type = this.data.type;
    this.medsClass = this.data.medsClass;
    this.selectedItems = this.data.selectedItems;
    if (!this.selectedItems)
      this.selectedItems = [];
  }

  ngOnInit() {
  }


  search(value: any) {
    this.allServices.categoryService.getCategoriesByFilter({ $or: [{ name: { "$regex": value } }, { internalName: { "$regex": value } }], addLabs: true }).then((data) => {
      this.categories = data;
    })
  }


  find(item: any, list: any) {
    if (list.length > 0) {
      for (let i of list) {
        if (i._id == item._id)
          return true;
      }
    }
    return false;
  }


  select(item: any) {
    console.log('item', item)
    if (!this.find(item, this.selectedItems)) {
      this.selectedItems.push({ _id: item._id, name: item.name, label: item.label, formType: item.formType });
    }
  }


  deselect(item: any) {
    this.selectedItems.splice(this.selectedItems.indexOf(item), 1)
  }


  cancel() {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close(this.selectedItems);
  }

}
