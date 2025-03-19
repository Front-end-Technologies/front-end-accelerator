"use client";

import {
  ColumnsIcon,
  Eye,
  RotateCwIcon,
  ThumbsDown,
  ThumbsUp,
  User,
} from "lucide-react";
import { useLayoutEffect, useState } from "react";
import { toast } from "sonner";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import useDebounce from "~/hooks/use-debounce";
import { api } from "~/trpc/react";

const initialColumns = ["views", "likes", "dislikes"];

export default function PostsTable() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [order, setOrder] = useState("asc");
  const [columns, setColumns] = useState(initialColumns);

  const utils = api.useUtils();
  const q = useDebounce(searchTerm, 500);

  const { data, isLoading } = api.postRouter.posts.useQuery({
    order,
    page,
    q,
    sortBy,
  });


  const hasMore = data?.hasMore;
  const posts = data?.posts;
  const totalPages = data?.totalPages;

  useLayoutEffect(() => {
    if (!q) return;

    setPage(1);
  }, [q]);

  useLayoutEffect(() => {
    if (!hasMore) return;

    utils.postRouter.posts
      .prefetch({ order, page: page + 1, q, sortBy })
      .catch(() => toast("Error pre-fetching next page"));
  }, [hasMore, order, page, q, sortBy, utils.postRouter.posts]);

  return (
    <div className="flex flex-col space-y-4 rounded-xl border p-4">
      <div className="flex space-x-4">
        <Input
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Debounced async search with TanStack Query"
          type="search"
          value={searchTerm}
        />

        <Select onValueChange={(value) => setSortBy(value)} value={sortBy}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="id">Id</SelectItem>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="views">Views</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => setOrder(value)} value={order}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Asc</SelectItem>
            <SelectItem value="desc">Desc</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger className="aspect-square rounded-md border p-2">
            <ColumnsIcon />
          </PopoverTrigger>
          <PopoverContent className="mr-4 w-36 space-y-4">
            {initialColumns.map((column) => (
              <div className="flex items-center space-x-2" key={column}>
                <Checkbox
                  checked={columns.includes(column)}
                  id={column}
                  onCheckedChange={(checked) => {
                    setColumns((prev) =>
                      checked
                        ? [...prev, column]
                        : prev.filter((col) => col !== column),
                    );
                  }}
                />
                <label htmlFor={column}>
                  {column.charAt(0).toUpperCase() + column.slice(1)}
                </label>
              </div>
            ))}
          </PopoverContent>
        </Popover>

        <Button
          onClick={() => {
            setColumns(initialColumns);
            setOrder("asc");
            setSortBy("id");
            setSearchTerm("");
          }}
        >
          <RotateCwIcon />
        </Button>
      </div>

      <Table>
        <TableCaption>
          {posts?.length === 0 && !isLoading && (
            <p> No results found for "{q}"</p>
          )}
          {!!posts?.length && q.length > 0 && (
            <p>
              Showing {posts.length} result{posts.length > 1 ? "s" : ""} for "
              {q}"
            </p>
          )}
        </TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Select</TableHead>
            <TableHead className="w-full">Title</TableHead>

            {columns.includes("views") && (
              <TableHead className="w-24">Views</TableHead>
            )}
            {columns.includes("likes") && (
              <TableHead className="w-24">Likes</TableHead>
            )}
            {columns.includes("dislikes") && (
              <TableHead className="w-24">Dislikes</TableHead>
            )}
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading && (
            <>
              {Array.from({ length: 10 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="w-16 p-3.5">
                    <Skeleton className="h-6 w-8 rounded-xl" />
                  </TableCell>
                  <TableCell className="flex w-full items-center space-x-2 p-3.5">
                    <Skeleton className="h-6 w-16 rounded-xl" />
                    <Skeleton className="h-6 w-12 rounded-xl" />
                    <Skeleton className="h-6 w-20 rounded-xl" />
                    <Skeleton className="h-6 w-60 rounded-xl" />
                  </TableCell>
                  <TableCell className="p-3.5">
                    <Skeleton className="h-6 w-[42px] rounded-xl" />
                  </TableCell>
                  <TableCell className="p-3.5">
                    <Skeleton className="h-6 w-[42px] rounded-xl" />
                  </TableCell>
                  <TableCell className="p-3.5">
                    <Skeleton className="h-6 w-[42px] rounded-xl" />
                  </TableCell>
                  <TableCell className="p-3.5">
                    <Skeleton className="h-6 w-[42px] rounded-xl" />
                  </TableCell>
                </TableRow>
              ))}
            </>
          )}
          {posts?.map((post) => (
            <TableRow key={post.id}>
              <TableCell className="w-16">{post.id}</TableCell>
              <TableCell>
                {post.tags.map((tag, index) => (
                  <Badge
                    className="mr-2 rounded-xl"
                    key={index}
                    variant="outline"
                  >
                    {tag}
                  </Badge>
                ))}
                {post.title}
              </TableCell>

              {columns.includes("views") && (
                <TableCell className="w-24">
                  <div className="flex items-center space-x-2">
                    <Eye className="pr-2" />
                    {post.views}
                  </div>
                </TableCell>
              )}

              {columns.includes("likes") && (
                <TableCell className="w-24">
                  <div className="flex items-center space-x-2">
                    <ThumbsUp className="pr-2" />
                    {post.reactions.likes}
                  </div>
                </TableCell>
              )}

              {columns.includes("dislikes") && (
                <TableCell className="w-24">
                  <div className="flex items-center space-x-2">
                    <ThumbsDown className="pr-2" />
                    {post.reactions.dislikes}
                  </div>
                </TableCell>
              )}

              {columns.includes("likes") && (
                <TableCell className="w-24">
                  <div className="flex items-center space-x-2">
                    <ThumbsUp className="pr-2" />
                    {post.reactions.likes}
                  </div>
                </TableCell>
              )}

              <TableCell>
                <Button size="icon" variant="ghost">
                  <User />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-end space-x-4">
        <Button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          variant="ghost"
        >
          Previous
        </Button>

        <Select
          disabled={totalPages === 1}
          onValueChange={(value) => setPage(parseInt(value, 10))}
          value={page.toString()}
        >
          <SelectTrigger className="w-16">
            <SelectValue placeholder="Select a page" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Array.from({ length: totalPages ?? 0 }, (_, index) => (
                <SelectItem key={index + 1} value={(index + 1).toString()}>
                  {index + 1}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button
          disabled={!hasMore}
          onClick={() => setPage((prev) => prev + 1)}
          variant="ghost"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
