"use client";
import { routes } from "@/routes";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LoginPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push(routes.dashboard);
    }
  }, [status, router]);

  const handleLogin = () => {
    signIn("nadeo");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        {status === "loading" ? (
          <p>Loading...</p>
        ) : session ? (
          <div>
            <p>Welcome back, {session.user?.displayName}!</p>
            <p>Your roles: {session.user?.roles.join(", ")}</p>
            <button
              onClick={() => router.push("/")} // Redirect to dashboard or other page
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <div>
            <button
              onClick={handleLogin}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Login with Nadeo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
