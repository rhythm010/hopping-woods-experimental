import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject, Observable } from 'rxjs';


// firebase imports
import * as firebase from 'firebase';


@Injectable({
  providedIn: 'root'
})
export class LearningService {

  private finishedTreeList = new Subject<any>();

  constructor(private db: AngularFirestore) {
    // this.getData();
  }

  addData() {
    return this.db.collection('trees').add({
      name: 'sample_tree',
      time_stamp: new Date()
    });
  }

  addLeaf(leafObj: object) {
    return this.db.collection('leaves').add(leafObj).then(
      (res) => {
        if (res.id) {
          this.db.collection('leaves').doc(res.id).update({
            leaf_id: String(res.id)
          }).then(response => {
            console.log('the generated leaf with firestore id is');
            console.log(response);
            this.updateTreeWithLeaf(leafObj['tree_id'], res.id);
          }
          );
        }
      }
    );
  }

  updateTreeWithLeaf(treeId: string, leafId: string) {
    this.db.collection('trees').doc(treeId).update({
      leaves: firebase.firestore.FieldValue.arrayUnion(leafId)
    }).then(
      (response) => {
        console.log('the addition of leaf_ref in tree document is success');
      }
    );
  }

  getAllTreesFromSubject(): Observable<any> {
    return this.finishedTreeList.asObservable();
  }


  // this gets all the trees and the leaves and then combines them together to form a good data point
  getAllTrees() {
    const treeList = [];
    const leavesList = [];
    this.db.collection('trees').get().subscribe(
      (trees) => {
        // this will put all the tress in the treeList
        trees.forEach((tree) => {
          if (tree.data()['tree_id'] && tree.data()['time_stamp']) {
            treeList.push(tree.data());
          }
        });
        // this will get all the leaves

        this.db.collection('leaves').get().subscribe(
          (leaves) => {
            leaves.forEach((leaf) => {
              const leafData = leaf.data();
              if (leafData.time_stamp && leafData.leaf_id) {
                leavesList.push(leafData);
              }
            });
            // here the call will be made to combine the trees and leaves 
            this.combineTreesWithLeaves(treeList, leavesList);
          }
        );
      }
    );
  }

  combineTreesWithLeaves(treeList, leavesList) {

    const finalTree = treeList;

    leavesList.forEach((leaf) => {
      treeList.forEach((tree, index) => {
        // checking if the leaf tree id is there is any tree object
        if (tree.tree_id === leaf.tree_id) {
          finalTree[index].leaves.push(leaf);
        }
      });
    });
    this.finishedTreeList.next(finalTree);
  }

  removeLeaf(leafDocId) {
    return this.db.collection('leaves').doc(leafDocId).delete();
  }

  addTree(treeObj: object) {

    return this.db.collection('trees').add(treeObj).then(
      (res) => {
        if (res.id) {
          // for setting generated tree id in the document
          this.db.collection('trees').doc(res.id).update({
            tree_id: String(res.id)
          }).then(response => {
            // for updating the last_updated with the current time_stamp
            console.log('tree with id added');
            console.log(res.id);
            this.db.collection('trees').doc(res.id).update({
              last_updated: new Date()
            }).then(updated => {
              // update is success
              console.log('the key last_updated is added/updated');
            }
            );
          }
          );
        }
      }
    );
  }

  removeTree(treeDocId) {
    return this.db.collection('trees').doc(treeDocId).delete();
  }

  searchLeafs() {
    // to search among the leaves for a filter
  }

  editTreeName(treeDocId, treeTitle) {
    return this.db.collection('trees').doc(treeDocId).update({
      title: treeTitle,
      last_updated: new Date()
    }).then(
      updated => {
        console.log('the key last_updated is added/updated');
      }
    );
  }


  // functions that are not directly related to data

  addIntoFeatureStack(featureObj) {
    return this.db.collection('featureStack').add(featureObj);
  }

  gatAllFeatures() {
    return this.db.collection('featureStack').get();
  }

  updateFeature(featureObjId, status) {
    return this.db.collection('featureStack').doc(featureObjId).update({
      feature_status: status
    });
  }


  moveToTrash(leafObj) {
    return this.db.collection('trash').add(leafObj).then(
      res => {
        console.log('value moved to trash');
      }
    );
  }

}
