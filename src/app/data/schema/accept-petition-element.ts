export interface AcceptPetitionElement {
  no: number;
  id: string;
  title: string;
  tag: string;
  createDate: string;
  takePlaceAt: string;
  status: string;
}

export interface Comments {
  name: string;
  time: string;
  children?: Comments[];
}
