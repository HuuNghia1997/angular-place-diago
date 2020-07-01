import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TodoItemNode } from '../schema/node';

@Injectable({
  providedIn: 'root',
})
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<TodoItemNode[]>([]);

  get data(): TodoItemNode[] { return this.dataChange.value; }

  constructor() {}

  initialize(TREE_DATA) {
    const data = this.buildFileTree(TREE_DATA, 0);
    this.dataChange.next(data);
  }

  buildFileTree(obj: any, level: number): TodoItemNode[] {
    const ret: TodoItemNode[] = [];
    let nodeGrant: any = [];
    nodeGrant = obj.sequenceFlow;
    const size = nodeGrant.length;
    for (let i = 0; i < size; i++){
      const nodeInLevel = nodeGrant[i];
      const node = new TodoItemNode();
      node.id = nodeGrant[i].id;
      node.name = nodeGrant[i].name;
      node.targetName = nodeGrant[i].targetName;
      node.sourceRef = nodeGrant[i].sourceRef;
      node.targetRef = nodeGrant[i].targetRef;
      node.condition = nodeGrant[i].condition;
      node.name = nodeGrant[i].name;
      node.gatewayType = obj.type;
      if (nodeGrant[i].gatewayInfo != null) {
        node.children = this.buildFileTree(nodeGrant[i].gatewayInfo, level + 1);
      }
      ret.push(node);
    }
    return ret;
  }
}
