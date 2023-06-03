import { use, useEffect, useState } from "react";
import type { Note } from "../newnote";
import { api } from "~/utils/api";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";

const EditNote: NextPage = () => {
  const router = useRouter();
  const utils = api.useContext();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    id: "",
  });
  const notesId = router.query.id as string;

  const { data, isLoading } = api.mynotes.getSingleNote.useQuery(notesId);

  const updateNote = api.mynotes.updateNote.useMutation({
    onMutate: async () => {
      await utils.mynotes.getAllNotes.cancel();
      const optimisticUpdate = utils.mynotes.getAllNotes.getData();

      if (optimisticUpdate) {
        utils.mynotes.getAllNotes.setFormData(optimisticUpdate);
      }
      onSettled: async () => {
        await utils.mynotes.getAllNotes.invalidate();
        await utils.mynotes.getSingleNote.invalidate();
      };
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addNewNote.mutate(formData);
    setFormData({ title: "", description: "" });
  };

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  console.log(formData);
  if (isLoading) return <div>loading...</div>;

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
              onChange={(e) => handleChange(e)}
              className="rounded-lg bg-gray-100 p-4 shadow-md focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <textarea
              placeholder="content"
              required
              name="description"
              value={formData.description}
              onChange={(e) => handleChange(e)}
              className="rounded-lg bg-gray-100 p-4 shadow-md focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <button type="submit">submit</button>
          </div>
        </form>
      </main>
    </>
  );
};

export default EditNote;
