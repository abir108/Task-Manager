export type BoardMember = {
  id: string;
  name: string;
  email: string;
};

export type BoardColumn = {
  id: string;
  name: string;
  type: string;
  position: number;
  options: string | null;
};

export type BoardColumnValue = {
  id: string;
  itemId: string;
  columnId: string;
  value: string | null;
};

export type BoardSubItem = {
  id: string;
  name: string;
  position: number;
  groupId: string;
  columnValues: BoardColumnValue[];
};

export type BoardItem = BoardSubItem & {
  subItems: BoardSubItem[];
};

export type BoardGroup = {
  id: string;
  name: string;
  color: string;
  position: number;
  items: BoardItem[];
};

export type BoardData = {
  id: string;
  name: string;
  columns: BoardColumn[];
  groups: BoardGroup[];
};
