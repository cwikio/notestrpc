import Link from "next/link";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

export default function NotesDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { data, isLoading } = api.mynotes.getSingleNote.useQuery({
    id: id as string,
  });

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center ">
        <Link href={"/"}>Back</Link>
        <h1>notes detail</h1>
        {isLoading ? (
          <div>loading...</div>
        ) : (
          <>
            <div>ID: {data?.id}</div>
            <div>Title: {data?.title}</div>
            <div>Description: {data?.description}</div>
          </>
        )}
      </main>
    </>
  );
}
