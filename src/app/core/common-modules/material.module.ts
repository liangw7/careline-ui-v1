import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTreeModule } from '@angular/material/tree';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { LayoutModule } from '@angular/cdk/layout';
import { ScrollingModule, ScrollDispatcher } from '@angular/cdk/scrolling';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatStepperModule } from '@angular/material/stepper';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        MatButtonModule,
        MatCheckboxModule,
        MatTabsModule,
        MatToolbarModule,
        MatIconModule,
        MatMenuModule,
        MatProgressBarModule,
        MatInputModule,
        LayoutModule,
        MatDialogModule,
        MatTreeModule,
        MatListModule,
        MatTableModule,
        MatFormFieldModule,
        MatCardModule,
        MatBadgeModule,
        MatSnackBarModule,
        MatExpansionModule,
        MatBottomSheetModule,
        ScrollingModule,
        MatPaginatorModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatRadioModule,
        MatDatepickerModule,
        MatTooltipModule,
        MatSliderModule,
        NgxMaterialTimepickerModule,
        MatStepperModule,
        MatNativeDateModule,
        MatMomentDateModule
    ],
    providers: [
        {
            provide: MAT_DIALOG_DATA,
            useValue: {},
        },
        {
            provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS,
            useValue: { useUtc: true }
        },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DATE_LOCALE, useValue: 'ja-JP' },
        ScrollDispatcher
    ],
    exports: [
        MatButtonModule,
        MatCheckboxModule,
        MatTabsModule,
        MatToolbarModule,
        MatIconModule,
        MatMenuModule,
        MatProgressBarModule,
        MatInputModule,
        LayoutModule,
        MatDialogModule,
        MatTreeModule,
        MatListModule,
        MatTableModule,
        MatFormFieldModule,
        MatCardModule,
        MatBadgeModule,
        MatSnackBarModule,
        MatExpansionModule,
        MatBottomSheetModule,
        ScrollingModule,
        MatPaginatorModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatRadioModule,
        MatDatepickerModule,
        MatTooltipModule,
        MatSliderModule,
        NgxMaterialTimepickerModule,
        MatStepperModule,
        MatNativeDateModule,
        MatMomentDateModule
    ]
})
export class MaterialModule { }