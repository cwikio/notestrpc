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
  const { id } = router.query;

  const { data, isLoading } = api.mynotes.getSingleNote.useQuery({
    id: id as string,
  });

  const updateNote = api.mynotes.updateNote.useMutation({
    onSuccess: async (note) => {
      await utils.mynotes.getSingleNote.invalidate({ id: note.id });
      await utils.mynotes.getAllNotes.invalidate();
      await router.push("/");
    },

    //   await api.mynotes.getSingleNote.cancel();
    //   const optimisticUpdate = utils.mynotes.getSingleNote.getData();

    //   if (optimisticUpdate) {
    //     utils.mynotes.getSingleNote.setFormData(optimisticUpdate);
    //   }
    // },
    onError: (err) => {
      console.log(err);
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateNote.mutate(formData);
    setFormData({ title: "", description: "", id: "" });
  };

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  // console.log(formData);
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {isLoading ? (
        <div>loading...</div>
      ) : (
        <main className="flex min-h-screen flex-col items-center justify-center space-y-3 ">
          <Link href={"/"}>Back</Link>
          <h1>Update the note</h1>
          <p>ID: {data?.id}</p>
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
      )}
    </>
  );
};

export default EditNote;
