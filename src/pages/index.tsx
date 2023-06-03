import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import type { Note } from "~/utils/interfaces";

const Home: NextPage = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const utils = api.useContext();
  const { data, isLoading } = api.mynotes.getAllNotes.useQuery();

  const deleteNote = api.mynotes.deleteNote.useMutation({
    onMutate: async (id) => {
      await utils.mynotes.getAllNotes.cancel();

      onSettled: async () => {
        await utils.mynotes.getAllNotes.invalidate();
      };
    },
  });

  // console.log(data);

  useEffect(() => {
    if (data) {
      setNotes(data);
    }
  }, [data]);

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {isLoading ? (
        <div className="flex min-h-screen flex-col items-center justify-center ">
          loading...
        </div>
      ) : (
        <main className="flex min-h-screen flex-col items-center justify-center ">
          {data && data?.length < 1 ? (
            "no notes yet"
          ) : (
            <>
              <div>list of all notes</div>
              <div className="bg-blue-100">
                {notes.map((note) => (
                  // console.log(note.id),
                  <div key={note.id} className="flex flex-row space-x-5">
                    <Link href={`/${note.id ? note.id : ""}`}>
                      {note.title}
                    </Link>
                    <p>{note.description}</p>
                    <button
                      className="text-red-500"
                      onClick={() => {
                        if (!note.id) {
                          console.log("no id");
                          return;
                        }
                        deleteNote.mutate(note.id);
                      }}
                    >
                      Delete
                    </button>
                    <Link
                      href={`/editnote/${note.id as string}`}
                      className="text-red-500"
                    >
                      Edit
                    </Link>
                  </div>
                ))}
              </div>
            </>
          )}
          <Link href={"/newnote"} className="bg-gray-300">
            add a note
          </Link>
        </main>
      )}
    </>
  );
};

export default Home;

// const Home: NextPage = () => {
//   const hello = api.example.hello.useQuery({ text: "from tRPC" });
//   const pleaseSub = api.subscribe.sub.useQuery({
//     text: "for those who code 2",
//   });

//   return (
//     <>
//       <Head>
//         <title>Create T3 App</title>
//         <meta name="description" content="Generated by create-t3-app" />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>
//       <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
//         <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
//           <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
//             Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
//           </h1>
//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
//             <Link
//               className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
//               href="https://create.t3.gg/en/usage/first-steps"
//               target="_blank"
//             >
//               <h3 className="text-2xl font-bold">First Steps →</h3>
//               <div className="text-lg">
//                 Just the basics - Everything you need to know to set up your
//                 database and authentication.
//               </div>
//             </Link>
//             <Link
//               className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
//               href="https://create.t3.gg/en/introduction"
//               target="_blank"
//             >
//               <h3 className="text-2xl font-bold">Documentation →</h3>
//               <div className="text-lg">
//                 Learn more about Create T3 App, the libraries it uses, and how
//                 to deploy it.
//               </div>
//             </Link>
//           </div>
//           <p className="text-2xl text-white">
//             {hello.data ? hello.data.greeting : "Loading tRPC query..."}
//           </p>
//           <p className="text-2xl text-white">
//             {pleaseSub.data
//               ? pleaseSub.data.pleaseSub
//               : "Loading tRPC query..."}
//           </p>
//         </div>
//       </main>
//     </>
//   );
// };
