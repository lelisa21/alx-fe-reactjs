import React from "react";
import { useQuery } from "react-query";
import axios from "axios";

const fetchPosts = async () => {
  const { data } = await axios.get("https://jsonplaceholder.typicode.com/posts");
  return data;
};

function PostsComponent() {
  const { data, error, isLoading, refetch } = useQuery("posts", fetchPosts, {
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  if (isLoading) return <p>Loading posts...</p>;
  if (error) return <p>Error fetching posts</p>;

  return (
    <div className="p-4">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={refetch}
      >
        Refetch Posts
      </button>
      {data.map((post) => (
        <div key={post.id} className="border p-2 mb-2 rounded shadow">
          <h2 className="font-bold">{post.title}</h2>
          <p>{post.body}</p>
        </div>
      ))}
    </div>
  );
}

export default PostsComponent;
