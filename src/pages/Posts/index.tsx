// pages/Posts.tsx
import { useQuery } from '@tanstack/react-query';
import { PostsContainer } from './styles';

const fetchPosts = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  return response.json();
};

const Posts = () => {
  const {
    data: posts,
    error,
    isLoading,
  } = useQuery({ queryKey: ['posts'], queryFn: fetchPosts });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading posts.</p>;

  return (
    <PostsContainer>
      <h2>Posts</h2>
      <ul>
        {posts.slice(0, 10).map((post: any) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </PostsContainer>
  );
};

export default Posts;
