import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "../trpc";
import type { Note } from "~/utils/interfaces";
import type { Prisma, PrismaClient } from "@prisma/client";
import { inputFields } from "~/utils/zodSchemas";

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

export const upsertNote = async (
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >,
  note: Note
): Promise<Note> => {
  try {
    note = await prisma.notes.upsert({
      select: {
        id: true,
        title: true,
        description: true,
      },
      where: {
        id: note.id,
      },
      update: {
        title: note.title,
        description: note.description,
      },
      create: {
        title: note.title,
        description: note.description,
      },
    });
  } catch (error) {
    console.log(error);
  }
  if (!note) throw new Error("Note not created");
  return note;
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
      .then((note) => console.log("Note deleted"));
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
      const note = await upsertNote(ctx.prisma, input);
      return note;
    }),

  //TO BE DELETED?
  // updateNote: publicProcedure
  //   .input(
  //     z.object({
  //       title: z
  //         .string()
  //         .min(5, { message: "min 5 characters" })
  //         .max(50, { message: "max 50 characters" })
  //         .trim(),
  //       description: z
  //         .string()
  //         .min(5, { message: "min 5 characters" })
  //         .max(500, { message: "max 500 characters" })
  //         .trim(),
  //     })
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     try {
  //       const data = await ctx.prisma.notes.update({
  //         where: {
  //           id,
  //         },
  //         data: {
  //           title: input.title,
  //           description: input.description,
  //         },
  //       });
  //       console.log(data);
  //       return data;
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }),

  deleteNote: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const note = await deleteNote(ctx.prisma, input);
      return note;
    }),
});
