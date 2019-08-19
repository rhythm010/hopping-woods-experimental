import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material/material.module';
import { FormsModule } from '@angular/forms';


import { FlexLayoutModule } from '@angular/flex-layout';
import { HomeComponent } from './home/home.component';
import { TreeComponent } from './tree/tree.component';
import { AddTreeComponent } from './add-tree/add-tree.component';

// firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

const firebaseConfig = {

  apiKey: 'AIzaSyBKuxwHgiLsmZrcPv9fx6Kcme04Uy9cmkw',
  authDomain: 'learning-path-2.firebaseapp.com',
  databaseURL: 'https://learning-path-2.firebaseio.com',
  projectId: 'learning-path-2',
  storageBucket: '',
  messagingSenderId: '373846099068',
  appId: '1:373846099068:web:dde7c8a27ad421f5'

};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TreeComponent,
    AddTreeComponent
  ],
  imports: [
    FlexLayoutModule,
    MaterialModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule
  ],

  providers: [],
  bootstrap: [AppComponent],
  exports: [MaterialModule],
  entryComponents: [AddTreeComponent]
})
export class AppModule { }
