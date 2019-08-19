import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddTreeComponent } from '../add-tree/add-tree.component';
import { LearningService } from '../service/learning.service';
import { log } from 'util';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  lastIdx: any = 0;

  selectedItem = {
  };
  treeList: any = [];
  startIdx = 1;
  featureListSelected = false;
  featureList: any = [];

  constructor(private dialog: MatDialog, private treeService: LearningService) { }

  ngOnInit() {
    if (localStorage.getItem('lastIdx')) {
      this.lastIdx = Number(localStorage.getItem('lastIdx'));
    }
    this.getAllTrees();
    this.getAllFeatures();
  }

  addTree() {

    const dialogRef = this.dialog.open(AddTreeComponent, {
      width: '300px',
      data: { use: 'add_tree' }
    });

    dialogRef.afterClosed().subscribe(

      data => {
        if (data) {
          // data will be added to the document
          this.prepareTreeData(data);
        }
      }
    );

  }

  prepareTreeData(data) {
    const treeData = {
      title: data,
      tree_id: '',
      time_stamp: new Date(),
      leaves: []
    };
    this.treeService.addTree(treeData).then(
      (res) => {
        console.log('the add tree then part in the component is');
        console.log(res);
        this.treeList.push(treeData);
      }
    );
  }

  itemSelected(event) {
    // console.log('the selected tree is');
    // console.log(event);
    this.selectedItem = event;
  }


  addFeature() {

    const dialogRef = this.dialog.open(AddTreeComponent, {
      width: '400px',
      data: { use: 'add_feature' }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log(result);
      if (result) {
        this.addFeatureToStack(result);
      }
    });

  }


  // this function will add the feature to the temp feature stack and we can take a look at the features
  addFeatureToStack(feature: string) {
    const featurePayload = {
      feature,
      time_stamp: new Date(),
      status: false
    };
    this.treeService.addIntoFeatureStack(featurePayload).then(
      (response) => {
        console.log('the data added to the collection feature is ');
        console.log(response);
      }
    );
  }

  getAllFeatures() {
    this.treeService.gatAllFeatures().subscribe(
      (data) => {
        const dataArray = [];
        data.forEach((datasnapShot) => {
          dataArray.push(datasnapShot.data());
        });
        this.arrangeFeatureList(dataArray);
      },
      (err) => {
        console.log('error in getting all the features');
      }
    );
  }

  arrangeFeatureList(featureList) {
    this.featureList = featureList;
    this.featureList.forEach((feature, index) => {
      if (feature.time_stamp['seconds']) {
        // this is the firestore time stamp
        this.featureList[index].time_stamp = new Date(feature.time_stamp.toDate()).getTime();
      } else {
        // this is the js timestamp
        this.featureList[index].time_stamp = new Date(feature.time_stamp).getTime();
      }
    });

    this.featureList.sort((a, b) => {
      if (a.time_stamp > b.time_stamp) {
        return -1;
      } else if (a.time_stamp < b.time_stamp) {
        return 1;
      } else {
        return 0;
      }
    });

  }

  removeTree(treeDocId) {
    this.treeService.removeTree(treeDocId).then(
      response => {
        console.log('the tree has been removed successfully');
        let treeIdx = 0;

        this.treeList.forEach((tree, index) => {
          if (tree.tree_id === treeDocId) {
            treeIdx = index;
          }
        });

        // this.treeList = this.treeList.splice(treeIdx, 1);
        this.restoreDefaults();
      }
    );
  }

  getAllTrees() {
    this.treeService.getAllTrees();
    this.treeService.getAllTreesFromSubject().subscribe(
      (list) => {
        this.treeList = list;
        console.log('the list has arrived');
        console.log(this.treeList);
        this.arrangeTreeList(this.treeList);
      }
    );
    // .subscribe(
    //   res => {
    //     console.log('data in tree collection is');
    //     res.forEach((treeObj) => {
    //       this.treeList.push(treeObj.data());
    //     });
    //     this.arrangeTreeList(this.treeList);
    //   }, err => {
    //     console.log('error in fetching all trees');
    //   }
    // );
  }

  arrangeTreeList(treeList: Array<object>) {
    this.treeList = this.treeList.filter(tree => (tree.time_stamp && tree.leaves));

    this.treeList.forEach((tree, index) => {
      if (tree.time_stamp['seconds']) {
        // this is the firestore time stamp
        this.treeList[index].time_stamp = new Date(tree.time_stamp.toDate()).getTime();
      } else {
        // this is the js timestamp
        this.treeList[index].time_stamp = new Date(tree.time_stamp).getTime();
      }
    });

    this.treeList.sort((a, b) => {
      if (a.time_stamp > b.time_stamp) {
        return -1;
      } else if (a.time_stamp < b.time_stamp) {
        return 1;
      } else {
        return 0;
      }
    });

    console.log('the rearranged treeList is');
    console.log(this.treeList);

  }

  limitDate(timeStamp) {
    // console.log(timeStamp.toDateString());
    const strDate = String(timeStamp.toDate()).slice(0, String(timeStamp.toDate()).indexOf('GMT'));
    return strDate;
  }

  restoreDefaults() {
    this.getAllTrees();
  }

}
