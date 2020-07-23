export class TodoItemNode {
  id: string;
  name: string;
  targetName: string;
  sourceRef: string;
  targetRef: string;
  gatewayType: number;
  condition: string;
  children: TodoItemNode[];
}

export class TodoItemFlatNode {
  id: string;
  name: string;
  targetName: string;
  sourceRef: string;
  targetRef: string;
  gatewayType: number;
  condition: string;
  level: number;
  expandable: boolean;
}
