import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// importing the material things that i need for my project
// import {MatTabsModule} from '@angular/material/tabs';


import {
  MatButtonModule,
  MatMenuModule,
  MatToolbarModule,
  MatIconModule,
  MatCardModule,
  MatDialogModule,
  MatInputModule,
  MatTabsModule
} from '@angular/material';

@NgModule({
  declarations: [],
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    CommonModule,
    MatDialogModule,
    MatInputModule,
    MatTabsModule
  ], exports: [
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    CommonModule,
    MatDialogModule,
    MatInputModule,
    MatTabsModule
  ]
})
export class MaterialModule { }
