import { j } from "../jstack";
import { z } from "zod";

const listUpdateIngoingValidator = z.object({
  titleChange: z.object({
    listId: z.string(),
    title: z.string(),
  }),
});
const listUpdateOutgoingValidator = z.object({
  titleChange: z.object({
    title: z.string(),
  }),
});

export const todoListRouter = j.router({
  todoList: j.procedure
    .incoming(listUpdateIngoingValidator)
    .outgoing(listUpdateOutgoingValidator)
    .ws(({ c, io, ctx }) => ({
      async onConnect({ socket }) {
        socket.on("titleChange", async (titleChange) => {
          await io.to(titleChange.listId).emit("titleChange", titleChange);
        });
      },
    })),
});
