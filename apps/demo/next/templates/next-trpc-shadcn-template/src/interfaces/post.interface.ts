import { Pagination } from "./pagination.interface";

export interface Post {
  body: string;
  id: number;
  reactions: {
    dislikes: number;
    likes: number;
  };
  tags: string[];
  title: string;
  userId: number;
  views: number;
}

export interface PostResponse extends Pagination {
  posts: Post[];
}
