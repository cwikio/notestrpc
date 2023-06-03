import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "../trpc";
import type { Note } from "~/utils/interfaces";
import type { Prisma, PrismaClient } from "@prisma/client";
import { inputFields } from "~/utils/zodSchemas";
import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";

export const getNotes = async (
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >
): Promise<Note[]> => {
  try {
    const notes = await prisma.notes.findMany({
      select: {
        id: true,
        title: true,
        description: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return notes as Note[];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getNote = async (
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >,
  id: string
): Promise<Note | undefined> => {
  try {
    const note = await prisma.notes.findUnique({
      select: {
        id: true,
        title: true,
        description: true,
      },
      where: {
        id,
      },
    });
    return note as Note;
  } catch (error) {
    console.log(error);
  }
};

export const createNote = async (
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >,
  note: Note
): Promise<Note> => {
  let upsertedNote;
  try {
    upsertedNote = await prisma.notes.create({
      data: note,
    });
  } catch (error: any) {
    console.log(error);
    throw new TRPCError({
      code: getHTTPStatusCodeFromError(error),
      message: error.message,
    });
  }
  if (!note) throw new Error("Note not created");
  console.log("from notes.ts", upsertedNote);
  return upsertedNote as Note;
};

export const updateNote = async (
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >,
  note: Note
): Promise<Note> => {
  let upsertedNote;
  console.log("from notes.ts", note);
  try {
    upsertedNote = await prisma.notes.update({
      data: {
        title: note.title,
        description: note.description,
      },
      where: {
        id: note.id,
      },
    });
  } catch (error: any) {
    console.log(error);
    throw new TRPCError({
      code: getHTTPStatusCodeFromError(error),
      message: error.message,
    });
  }
  if (!note) throw new Error("Note not created");
  console.log("from notes.ts", upsertedNote);
  return upsertedNote as Note;
};

export const deleteNote = async (
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >,
  id: string
): Promise<void> => {
  if (!id) throw new Error("No id provided");
  try {
    const note = await prisma.notes
      .delete({
        where: {
          id: id,
        },
      })
      .then((note) => console.log("Note deleted: ", note));
  } catch (error) {
    console.log(error);
  }
};

export const notesRouter = createTRPCRouter({
  getAllNotes: publicProcedure.query(async ({ ctx }) => {
    const notes = await getNotes(ctx.prisma);
    return notes;
  }),

  getSingleNote: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const note = await getNote(ctx.prisma, input.id);
      return note;
    }),

  createNewNote: publicProcedure
    .input(inputFields)
    .mutation(async ({ ctx, input }) => {
      const note = await createNote(ctx.prisma, input);
      return note;
    }),

  updateNote: publicProcedure
    .input(inputFields)
    .mutation(async ({ ctx, input }) => {
      const note = await updateNote(ctx.prisma, input);
      return note;
    }),

  deleteNote: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const note = await deleteNote(ctx.prisma, input);
      return note;
    }),
});
