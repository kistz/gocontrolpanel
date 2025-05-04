"use client";

export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Error</h1>
      <p className="mt-4 text-lg">An error occurred while loading the page.</p>
      <p className="mt-2 text-sm text-gray-500">
        Please try again later or contact support.
      </p>
    </div>
  );
}