import { databases, storage } from "@/appwrite";
import { getTodosGroupedByColumn } from "@/lib/getTodosGroupedByColumn";
import { create } from "zustand";

type BoardState = {
  board: Board;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  updateTodoInDB: (
    todo: Todo,
    columnId: TypedColumn
  ) => void;
  searchString: string;
  newTaskInput: string;
  newTaskType: TypedColumn;
  setNewTaskInput: (input: string) => void;
  setSearchString: (searchString: string) => void;
  setNewTaskType: (columnId: TypedColumn) => void;
  deleteTask: (
    taskIndex: number,
    todo: Todo,
    id: TypedColumn
  ) => void;
};

export const useBoardStore = create<BoardState>(
  (set, get) => ({
    board: {
      columns: new Map<TypedColumn, Column>(),
    },
    searchString: "",
    newTaskInput: "",
    newTaskType: "todo",
    setSearchString: (searchString) =>
      set({ searchString }),
    getBoard: async () => {
      const board = await getTodosGroupedByColumn();
      set({ board });
    },
    setBoardState: (board) => set({ board }),
    deleteTask: async (taskIndex, todo, id) => {
      const newColumns = new Map(get().board.columns);

      newColumns.get(id)?.todos.splice(taskIndex, 1);

      set({ board: { columns: newColumns } });

      if (todo.image) {
        await storage.deleteFile(
          todo.image.bucketId,
          todo.image.fileId
        );
      }

      await databases.deleteDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID!,
        process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
        todo.$id
      );
    },
    setNewTaskType: (columnId) =>
      set({ newTaskType: columnId }),

    setNewTaskInput: (input: string) =>
      set({ newTaskInput: input }),
    updateTodoInDB: async (todo, columnId) => {
      await databases.updateDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID!,
        process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
        todo.$id,
        { title: todo.title, status: columnId }
      );
    },
  })
);
