type Board = {
  columns: Map<TypedColumn, Column>;
};

type TypedColumn = "todo" | "inprogress" | "done";

type Column = {
  id: TypedColumn;
  todos: Todo[];
};

type Todo = {
  $id: string;
  $createdAt: string;
  title: string;
  status: TypedColumn;
  image?: Image;
};

type Image = {
  bucketId: string;
  fileId: string;
};
