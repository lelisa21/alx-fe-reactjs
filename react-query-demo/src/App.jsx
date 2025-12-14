import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import PostsComponent from "./PostsComponent";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <h1 className="text-2xl font-bold text-center my-4">React Query Demo</h1>
        <PostsComponent />
      </div>
    </QueryClientProvider>
  );
}

export default App;
