import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddTreeComponent } from '../add-tree/add-tree.component';
import { Logs } from 'selenium-webdriver';
import { LearningService } from '../service/learning.service';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {

  dummyArray = [1, 2, 3];
  treeSelected = false;
  @Output() private itemSelect = new EventEmitter<any>();

  showAddLeaf = false;
  canEditTitle = false;
  editedText;

  @Input()
  data: any = {
    title: '',
    tree_id: '1',
    leaves: []
  };


  // used with ref to the html
  hintAnchor = '';
  message = '';
  removeWarningShow = false;


  // data = {

  // };

  // data = {
  // title: 'JS resources',
  // tree_id: '1',
  // leaves: [
  //   {
  //     message: 'http://jsonPlaceholder/t a source of study or an example code where i can get htin',
  //     hint_anchor: 'this is for free rest apis 1',
  //     time_stamp: new Date(),
  //     leaf_id: '1',
  //     location: '',
  //     reference: '0',
  //     ran_key0: '',
  //     ran_key1: ''
  //     // is it a source of study or an example code where i can get htin
  //   },
  //   {
  //     message: 'http://jsonPlaceholder/t a source of study or an example code where i can get htin',
  //     hint_anchor: 'this is for free rest apis 2',
  //     time_stamp: new Date(),
  //     leaf_id: '1',
  //     location: '',
  //     reference: '0',
  //     ran_key0: '',
  //     ran_key1: ''
  //   },
  //   {
  //     message: 'http://jsonPlaceholder/t a source of study or an example code where i can get htin',
  //     hint_anchor: 'this is for free rest apis 3',
  //     time_stamp: new Date(),
  //     leaf_id: '1',
  //     location: '',
  //     reference: '0',
  //     ran_key0: '',
  //     ran_key1: ''
  //   }
  // ]
  // };

  constructor(private dialog: MatDialog, private treeService: LearningService) {
    // this.data = this.treeData;
    // console.log(this.treeData);
  }

  ngOnInit() {
    this.emptyLeavesWithIds(this.data.leaves);
    this.editedText = this.data.title;
  }

  emptyLeavesWithIds(treeLeaves) {
    this.data.leaves = treeLeaves.filter((leaf) => leaf.time_stamp);
  }

  prepareRecord(record) {
    const leafGram: LeafGram = {
      message: record.message,
      hint_anchor: record.hint_anchor,
      time_stamp: new Date(),
      leaf_id: '',
      tree_id: this.data.tree_id,
      // geo_location: record.geo_location
    };

    this.treeService.addLeaf(leafGram).then(
      (response) => {
        console.log('addition of the tree is a success');
        console.log(response);
        this.restoreTreeDefault();
        // this.pushLeaf(leafGram);
      }
    );
  }

  limitDate(timeStamp) {
    // console.log('limit date called');
    let strDate = '';

    // checking if the timestamp is a firestore timestamp or a date object
    if (timeStamp['seconds']) {
      strDate = String(timeStamp.toDate()).slice(0, String(timeStamp.toDate()).indexOf('GMT'));

    } else {
      strDate = String(timeStamp).slice(0, String(timeStamp).indexOf('GMT'));
    }
    return strDate;

  }

  removeLeaf(dataIndex, leafIndex) {

    // moving the leaf to trash before removing the leaf from the database
    this.treeService.moveToTrash(this.data.leaves[dataIndex]).then(
      (res) => {
        this.treeService.removeLeaf(leafIndex).then(
          (res2) => {
            console.log('leaf removal success');
            this.data.leaves.splice(this.data.leaves.length - dataIndex - 1, 1);
          },
          err => {
            console.log('lead removal failure');

          }
        );
      }
    );


  }

  selectTree() {
    console.log('the tree will be selected');
    this.treeSelected = true;
    this.itemSelect.emit({
      tree_name: this.data.title,
      tree_id: this.data.tree_id
    });
  }

  selectLeaf(leafIndex) {
    console.log(leafIndex);
    const realIndx = this.data.leaves.length - 1 - leafIndex;
    this.itemSelect.emit(this.data.leaves[realIndx]);
  }

  pushLeaf(leafGram: LeafGram) {
    this.data.leaves.push(leafGram);
  }

  addLeaf() {
    this.showAddLeaf = !this.showAddLeaf;
  }

  addLeafInfo() {
    if (this.hintAnchor.length > 0 && this.message.length > 0) {
      const record = {
        message: this.message,
        hint_anchor: this.hintAnchor,
        geo_location: this.getGeoLocation()
      };

      this.prepareRecord(record);
      this.restoreTreeDefault();
    }
  }

  cancelLeafAddition() {
    this.showAddLeaf = false;
  }

  // this function will act as the restore-default function for the entire tree component
  restoreTreeDefault() {
    this.showAddLeaf = false;
    this.message = '';
    this.hintAnchor = '';
  }

  getGeoLocation() {
    if (window.navigator && window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('the geo-location is');
          console.log(position);
          return position;
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  activateEditTree() {
    this.canEditTitle = !this.canEditTitle;
  }

  editTree() {
    // service function for the new edit tree activation
    console.log(this.data.title);
    this.canEditTitle = false;
    this.treeService.editTreeName(this.data.tree_id, this.editedText).then(
      (response) => {
        this.data.title = this.editedText;
      },
      (error) => {
        // nothing happens when an error is encountered
      }
    );
  }

}

export interface LeafGram {
  message: string;
  hint_anchor: string;
  time_stamp: Date;
  leaf_id: string;
  tree_id: string;
  location?: string;
  reference?: string;
  ran_key0?: string;
  ran_key1?: string;
  // geo_location: string;
}
