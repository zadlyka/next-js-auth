"use client";
import { signOut, useSession } from "next-auth/react";

const ClientProtectPage = () => {
  const { data: session, status } = useSession();

  return (
    <section className="container">
      <h1 className="text-2xl font-bold">
        This is a <span className="text-emerald-500">client-side</span>{" "}
        protected page
      </h1>
      <h2 className="mt-4 font-medium">You are logged in as:</h2>

      <button
        onClick={() => signOut()}
        className="bg-red-700 text-white px-4 py-1.5"
      >
        Sign Out
      </button>
      {JSON.stringify(session)}
    </section>
  );
};

export default ClientProtectPage;
