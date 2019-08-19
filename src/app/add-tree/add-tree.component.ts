import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { TreeComponent } from '../tree/tree.component';

@Component({
  selector: 'app-add-tree',
  templateUrl: './add-tree.component.html',
  styleUrls: ['./add-tree.component.scss']
})
export class AddTreeComponent implements OnInit {

  headerName = '';

  data = {
    tree_name: '',
    hint_anchor: ''
  };

  constructor(private dialogRef: MatDialogRef<AddTreeComponent>,
    @Inject(MAT_DIALOG_DATA) public use: any) {

    console.log(use);


    if (use.use === 'add_leaf') {
      this.headerName = 'Add new Leaf';
    } else if (use.use === 'add_tree') {
      this.headerName = 'Add a new Tree';
    } else if (use.use === 'add_feature') {
      this.headerName = 'Add a new feature';
    }
  }

  ngOnInit() {

  }

  Add() {
    if (this.data.hint_anchor && this.data.tree_name) {
      this.dialogRef.close(this.data);
    } else if (this.data.tree_name && this.headerName.toLowerCase().indexOf('tree') > 0) {
      this.dialogRef.close(this.data.tree_name);
    } else {
      this.dialogRef.close(this.data.hint_anchor);
    }
  }

  close() {
    this.dialogRef.close();
  }

}
