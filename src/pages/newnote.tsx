import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { api } from "~/utils/api";
import type { Note } from "~/utils/interfaces";

const NewNote: NextPage = () => {
  const utils = api.useContext();

  const [formData, setFormData] = useState<Note>({
    title: "",
    description: "",
  });

  const addNewNote = api.mynotes.createNewNote.useMutation({
    onMutate: async () => {
      await utils.mynotes.getAllNotes.cancel();
      const optimisticUpdate = utils.mynotes.getAllNotes.getData();

      if (optimisticUpdate) {
        utils.mynotes.getAllNotes.setFormData(optimisticUpdate);
      }
      onSettled: async () => {
        await utils.mynotes.getAllNotes.invalidate();
      };
    },
  });

  const handleTitleEvent = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addNewNote.mutate(formData);
    setFormData({ title: "", description: "" });
  };

  console.log(formData);
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center ">
        <Link href={"/"}>Back</Link>
        <h1>add new notes</h1>

        <form onSubmit={onSubmit}>
          <div className="flex flex-col space-y-6">
            <input
              type="text"
              placeholder="title"
              name="title"
              required
              value={formData.title}
              onChange={(e) => handleTitleEvent(e)}
              className="rounded-lg bg-gray-100 p-4 shadow-md focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <textarea
              placeholder="content"
              required
              name="description"
              value={formData.description}
              onChange={(e) => handleTitleEvent(e)}
              className="rounded-lg bg-gray-100 p-4 shadow-md focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <button type="submit">submit</button>
          </div>
        </form>
      </main>
    </>
  );
};

export default NewNote;