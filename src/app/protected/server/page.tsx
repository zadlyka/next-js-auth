import { redirect } from "next/navigation";
import { getServerSession } from 'next-auth'
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const ServerProtectedPage = async () => {
  const session = await getServerSession(authOptions)
  if(!session) {
    redirect('/')
  }

  console.log(session)
  
  return (
    <section className="py-24">
      <div className="container">
        <h1 className="text-2xl font-bold">
          This is a <span className="text-emerald-500">server-side</span>{" "}
          protected page
        </h1>
        <h2 className="mt-4 font-medium">You are logged in as:</h2>
      </div>
    </section>
  );
};

export default ServerProtectedPage;
