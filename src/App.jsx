import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./routers";

function App() {
  return (
    <main className="App relative">
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-500 border-t-transparent" />
          </div>
        }
      >
        <RouterProvider router={router} />
      </Suspense>
    </main>
  );
}

export default App;
