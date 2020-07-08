import { Component, OnInit, Inject } from '@angular/core';
import { PetitionService } from 'src/app/data/service/petition.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { KeycloakService } from 'keycloak-angular';
import { FormGroup, FormControl } from '@angular/forms';
import { UserService } from 'src/app/data/service/user.service';
import { reloadTimeout } from 'src/app/data/service/config.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { TodoItemFlatNode, TodoItemNode } from 'src/app/data/schema/node';
import { ChecklistDatabase } from 'src/app/data/service/checklist-database.service';


@Component({
  selector: 'app-confirmation-completed',
  templateUrl: './confirmation-completed.component.html',
  styleUrls: ['./confirmation-completed.component.scss']
})
export class ConfirmationCompletedComponent implements OnInit {

  isLinear = true;
  checkedStep1: string;
  checkedStep2 = false;
  submit = 2;
  petitionId: string;
  exclusive: boolean;
  outGoingFlow = [];
  requestBody = [];
  body = new FormGroup({
    variables: new FormGroup({}),
    payloadType: new FormControl('')
  });

  variables = new FormGroup({});

  select: string;
  commonArray = [];
  fullname: string;
  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();
  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();
  selectedParent: TodoItemFlatNode | null = null;
  newItemName = '';
  treeControl: FlatTreeControl<TodoItemFlatNode>;
  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;
  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true);
  TREE_DATA: any;

  constructor(private service: PetitionService,
              public dialogRef: MatDialogRef<ConfirmationCompletedComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ConfirmationCompletedPetitionDialogModel,
              public keycloak: KeycloakService,
              private userService: UserService,
              // tslint:disable-next-line: variable-name
              private database: ChecklistDatabase) {
    this.petitionId = data.id;

    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    database.dataChange.subscribe(dataTree => {
      this.dataSource.data = dataTree;
    });

  }

  getLevel = (node: TodoItemFlatNode) => node.level;

  isExpandable = (node: TodoItemFlatNode) => node.expandable;

  getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

  // tslint:disable-next-line: variable-name
  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

  // tslint:disable-next-line: variable-name
  hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.name === '';

  transformer = (node: TodoItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.name === node.name
        ? existingNode
        : new TodoItemFlatNode();
    flatNode.id = node.id;
    flatNode.name = node.name;
    flatNode.targetName = node.targetName;
    flatNode.sourceRef = node.sourceRef;
    flatNode.targetRef = node.targetRef;
    flatNode.gatewayType = node.gatewayType;
    flatNode.condition = node.condition;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  descendantsAllSelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    return descAllSelected;
  }

  descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  todoLeafSelectionToggle(node: TodoItemFlatNode): void {
    const currentState = this.checklistSelection.isSelected(node);
    if (node.gatewayType === 1) {
      const parallel = this.getParallelNode(node);
      const sizeI = parallel.length;
      for (let i = 0; i < sizeI; i++) {
        if (currentState === false){
          const descendants = this.treeControl.getDescendants(parallel[i]);
          const sizeJ = descendants.length;
          for (let j = 0; j < sizeJ; j++) {
            this.checklistSelection.deselect(descendants[j]);
          }
          this.checklistSelection.deselect(parallel[i]);
        }
      }
    }
    if (currentState) {
      const descendants = this.treeControl.getDescendants(node);
      const size = descendants.length;
      for (let j = 0; j < size; j++) {
        this.checklistSelection.deselect(descendants[j]);
      }
      this.checklistSelection.deselect(node);
    } else{
      this.checklistSelection.select(node);
    }
    this.checkAllParentsSelectionWithState(node, currentState);
  }

  checkAllParentsSelectionWithState(node: TodoItemFlatNode, state: boolean): void {
    let parent: TodoItemFlatNode | null = this.getParentNode(node);
    while (parent) {
      if (parent.gatewayType === 1) {
        const parallel = this.getParallelNode(parent);
        const size = parallel.length;
        for (let i = 0; i < size; i++) {
          if (!state) {
            this.checklistSelection.deselect(parallel[i]);
          }
          const descendants = this.treeControl.getDescendants(parallel[i]);
          const sizeJ = descendants.length;
          for (let j = 0; j < sizeJ; j++) {
            if (!state) {
              this.checklistSelection.deselect(descendants[j]);
            }
          }
        }
      } else {
        this.checklistSelection.toggle(parent);
      }
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  checkRootNodeSelection(node: TodoItemFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  getParallelNode(node: TodoItemFlatNode): TodoItemFlatNode[]{
    const ret: TodoItemFlatNode[] = [];
    const currentLevel = this.getLevel(node);
    let startIndex = 0;
    if (currentLevel !== 0) {
      const parent = this.getParentNode(node);
      if (parent != null) {
        startIndex = this.treeControl.dataNodes.indexOf(parent) + 1;
      }
    }
    let i = startIndex;
    let currentNode = this.treeControl.dataNodes[i];
    while (currentNode.level >= currentLevel) {
      if (currentNode.level === node.level && currentNode !== node) {
        ret.push(currentNode);
      }
      i++;
      if (i >= this.treeControl.dataNodes.length) {
        break;
      }
      currentNode = this.treeControl.dataNodes[i];
    }
    return ret;
  }

  itemClick(){
    const condition = [];
    const selectedItem = this.checklistSelection.selected;
    const size = selectedItem.length;
    for (let i = 0; i < size; i++) {
      if (!(condition.indexOf(selectedItem[i]) > -1 )){
        condition.push(selectedItem[i]);
      }
      let parent: TodoItemFlatNode | null = this.getParentNode(selectedItem[i]);
      while (parent) {
        if (!(condition.indexOf(parent) > -1 )) {
          condition.push(parent);
        }
        parent = this.getParentNode(parent);
      }
    }
    let variable: any = {};
    condition.forEach(e => {
      if (e.condition !== undefined) {
        const key = this.splitString(e.condition);
        const value = this.splitValue(e.condition);
        variable[key] = new FormControl(value);
      }
    });
    variable = new FormGroup(variable);
    const formObj = variable.getRawValue();
    const formBody = this.body.getRawValue();
    formBody.variables = formObj;
    formBody.payloadType = 'SetProcessVariablesPayload';
    const resultJson = JSON.stringify(formBody, null, 2);
    console.log(resultJson);
    this.postVariable(resultJson);
    this.completeJSON();
  }

  splitString(str) {
    const a = str.split('${', 2)[1];
    const b = a.split('==', 2)[0];
    return b;
  }

  splitValue(str) {
    const a = str.split('==', 2)[1];
    const b = a.split('}', 2)[0];
    let c: any;

    if (isNaN(b) === false) {
      // tslint:disable-next-line: no-construct
      c = new Number(b);
    } else {
      if (b === 'false') {
        c = false;
      } else {
        if (b === 'true') {
          c = true;
        } else {
          c = b;
        }
      }
    }

    return c;
  }

  ngOnInit(): void {
    this.getNextFlow();
  }

  getNextFlow() {
    this.service.getDetailPetition(this.petitionId).subscribe(data => {
      const taskId = data.list.entries[0].entry.id;
      this.service.getNextFlow(taskId).subscribe(res => {
        this.TREE_DATA = res;
        if (this.TREE_DATA !== null) {
          this.database.initialize(this.TREE_DATA);
        }
      }, err => {
        if (err.status === 401) {
          this.keycloak.login();
        }
      });
    }, err => {
      if (err.status === 401) {
        this.keycloak.login();
      }
    });
  }

  postVariable(requestBody) {
    this.service.getDetailPetition(this.petitionId).subscribe(data => {
      console.log(data.list.entries[0].entry.processInstanceId);
      this.service.postVariable(data.list.entries[0].entry.processInstanceId, requestBody).subscribe(res => {
        this.dialogRef.close(true);
      }, err => {
        this.dialogRef.close(false);
        console.error(err);
      });
    }, err => {
      if (err.status === 401) {
        this.keycloak.login();
      }
    });

  }

  completeJSON() {
    this.service.getDetailPetition(this.petitionId).subscribe(data => {
      this.keycloak.loadUserProfile().then(user => {
        // tslint:disable-next-line: no-string-literal
        this.userService.getUserInfo(user['attributes'].user_id).subscribe(info => {
          // tslint:disable-next-line: no-string-literal
          this.fullname = info['fullname'];

          const complete = new FormGroup({
            payloadType: new FormControl('CompleteTaskPayload'),
            taskId: new FormControl(data.list.entries[0].entry.id),
            variables: new FormGroup({
              // tslint:disable-next-line: no-string-literal
              userId: new FormControl(user['attributes'].user_id[0]),
              fullname: new FormControl(this.fullname)
            })
          });

          const formObj = complete.getRawValue();
          const resultJson = JSON.stringify(formObj, null, 2);
          this.completeTask(data.list.entries[0].entry.id, resultJson);
        });
      }, error => {
        console.error(error);
      });
    });
  }

  completeTask(id, requestBody) {
    this.service.completeTask(id, requestBody).subscribe(res => {
      this.dialogRef.close(true);
      // tslint:disable-next-line: only-arrow-functions
      setTimeout(function() {
        window.location.reload();
      }, reloadTimeout);
    }, err => {
      this.dialogRef.close(false);
      console.error(err);
    });
  }

  onDismiss(): void {
    // Đóng dialog, trả kết quả là false
    this.dialogRef.close();
  }



}

export class ConfirmationCompletedPetitionDialogModel {
  constructor(public title: string,
              public id: string) { }
}
