"use client"

import { useEffect, useState } from "react"

import { format } from "date-fns"
import {
  MoreHorizontal as MoreHorizontalIcon,
  PauseCircle as PauseCircleIcon,
  PencilIcon,
  PlayCircle as PlayCircleIcon,
  XCircle as XCircleIcon,
} from "lucide-react"
import { useRouter } from "nextjs-toploader/app"
import { parseAsInteger, useQueryState } from "nuqs"


import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { EmptyTable } from "@/components/data-table/empty-table"
import { SearchInput } from "@/components/inputs/search-input"
import { Spinner } from "@/components/spinner"
import { IPolicy } from "@/types/policy.type"
import { useCreatePolicy, useDeletePolicyById, useGetPolicies, useUpdatePolicy } from "@/hooks/policy"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu"

export default function PolicyDataTable() {
  const router = useRouter()
  const { mutate: deletePolicy, isPending } = useDeletePolicyById()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedPolicy, setSelectedPolicy] = useState<IPolicy | null>(
    null
  )

  const [header, setHeader] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    if (selectedPolicy) {
      setHeader(selectedPolicy.header);
      setDescription(selectedPolicy.description);
    }
  }, [selectedPolicy]);

  const [currentPage, setCurrentPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1)
  )
  const [pageSize, setPageSize] = useQueryState(
    "pageSize",
    parseAsInteger.withDefault(10)
  )

  const { data, isLoading, isError, refetch } = useGetPolicies(
    currentPage,
    pageSize
  )

  // Extract data from the response
  const policies = data?.value?.data || []
  const paginationInfo = {
    from: (currentPage - 1) * pageSize + 1,
    to: Math.min(currentPage * pageSize, data?.value?.totalRecords || 0),
    total: data?.value?.totalRecords || 0,
    last_page: data?.value?.totalPages || 1,
  }
  const isDataEmpty = !policies || policies.length === 0

  // Handle next page navigation - increment by 1
  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(paginationInfo.last_page, prev + 1))
  }

  // Handle previous page navigation - decrement by 1
  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1))
  }

  // Handler for refresh button click
  const handleRefresh = () => {
    refetch()
  }

  const handleDeleteSubmit = () => {
    if (!selectedPolicy) return
    deletePolicy({ id: selectedPolicy.id })
    setIsDeleteDialogOpen(false)
    setSelectedPolicy(null)
    refetch()
  }

  const {onUpdatePolicy} = useUpdatePolicy(selectedPolicy?.id.toString() || "")

  const handleUpdate = async () => {
    if (!selectedPolicy) return;
    await onUpdatePolicy({
      header: header,
      description: description
    });
    handleRefresh()
    setSelectedPolicy(null)
    setIsUpdateDialogOpen(false);
  };

  const {onCreatePolicy} = useCreatePolicy()

  const handleCreate = async () => {
    await onCreatePolicy({
      header: header,
      description: description
    });
    handleRefresh()
    setSelectedPolicy(null)
    setIsCreateDialogOpen(false);
  }

  return (
    <div className="flex min-h-[calc(100vh-200px)] flex-col">
      {/* Filters Section */}
      <div className="space-y-6">
        <SearchInput
          className="w-[500px] transition-all focus-within:ring-2 focus-within:ring-ring"
          placeholder="Find campaign by name..."
        />
        <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
            >
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        className={buttonVariants({
                            variant: "default",
                        })}
                        >
                            Create Policy
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Update Policy</DialogTitle>
                        <div className="mt-4 space-y-4">
                        <div>
                            <p className="mb-1 text-sm text-muted-foreground">Header</p>
                            <Input value={header} onChange={(e) => setHeader(e.target.value)} />
                        </div>
                        <div>
                            <p className="mb-1 text-sm text-muted-foreground">Description</p>
                            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>
                        </div>
                </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() =>
                                setIsUpdateDialogOpen(false)
                                }
                            >
                                Cancel
                        </Button>
                        <Button
                        variant="outline"
                            onClick={handleCreate}
                            disabled={isPending}
                            className="border-green-600 text-green-600 hover:bg-green-50"
                        >
                            Create
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        {/* Results Table or Empty State */}
        <div className="mt-4 grow">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Spinner />
              </div>
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <p className="text-sm text-destructive">Error loading data</p>
                <Button
                  onClick={handleRefresh}
                  variant="outline"
                  className="mt-4"
                >
                  Retry
                </Button>
              </div>
            </div>
          ) : isDataEmpty ? (
            <EmptyTable onRefresh={handleRefresh} />
          ) : (
            <div className="flex flex-col">
              {/* Data Table Section */}
              <div className="relative w-full">
                <Table className="w-full">
                  <TableHeader className="sticky top-0 z-10 bg-white">
                    <TableRow className="border-b border-gray-200 hover:bg-white">
                      <TableHead className="w-[200px] py-3 font-medium text-gray-700">
                        ID
                      </TableHead>
                      <TableHead className="w-[300px] py-3 font-medium text-gray-700">
                        Header
                      </TableHead>
                      <TableHead className="w-[500px] py-3 font-medium text-gray-700">
                        Description
                      </TableHead>
                      <TableHead className="w-[200px] py-3 font-medium text-gray-700">
                        Create At
                      </TableHead>
                      <TableHead className="py-3 text-right font-medium text-gray-700">
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {policies.map((policy: IPolicy) => (
                      <TableRow
                        key={policy.id}
                        className="cursor-pointer border-b border-gray-200 hover:bg-gray-50"
                      >
                        <TableCell className="py-3 text-sm font-medium text-muted-foreground"
                            onClick={() =>
                                router.push(`/admin/policies/${policy.id}`)
                            }
                          >
                          {policy.id}
                        </TableCell>
                        <TableCell className="py-3 text-sm text-muted-foreground"
                            onClick={() =>
                                router.push(`/admin/policies/${policy.id}`)
                            }
                          >
                          {policy.header}
                        </TableCell>
                        <TableCell className="py-3 text-muted-foreground"
                            onClick={() =>
                                router.push(`/admin/policies/${policy.id}`)
                            }
                          >
                          {policy.description}
                        </TableCell>
                        <TableCell className="py-3 text-muted-foreground"
                            onClick={() =>
                                router.push(`/admin/policies/${policy.id}`)
                            }
                          >
                          {format(new Date(policy.createdAt), "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="flex size-8 p-0 data-[state=open]:bg-muted"
                                disabled={isPending}
                              >
                                <MoreHorizontalIcon className="size-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-[160px]"
                            >
                              <Dialog
                                open={isUpdateDialogOpen}
                                onOpenChange={setIsUpdateDialogOpen}
                              >
                                <DialogTrigger asChild>
                                  <DropdownMenuItem
                                    onSelect={(e) => {
                                      e.preventDefault()
                                      setSelectedPolicy(policy)
                                    }}
                                  >
                                    <PencilIcon className="mr-2 size-4 text-yellow-400" />
                                    update
                                  </DropdownMenuItem>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Update Policy</DialogTitle>
                                    <div className="mt-4 space-y-4">
                                        <div>
                                            <p className="mb-1 text-sm text-muted-foreground">Header</p>
                                            <Input value={header} onChange={(e) => setHeader(e.target.value)} />
                                        </div>
                                        <div>
                                            <p className="mb-1 text-sm text-muted-foreground">Description</p>
                                            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                                        </div>
                                    </div>
                                  </DialogHeader>
                                  <DialogFooter>
                                    <Button
                                      variant="outline"
                                      onClick={() =>
                                        setIsUpdateDialogOpen(false)
                                      }
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      variant="outline"
                                      onClick={handleUpdate}
                                      disabled={isPending}
                                      className="border-green-600 text-green-600 hover:bg-green-50"
                                    >
                                      Update
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              <DropdownMenuSeparator />
                              <Dialog
                                open={isDeleteDialogOpen}
                                onOpenChange={setIsDeleteDialogOpen}
                              >
                                <DialogTrigger asChild>
                                  <DropdownMenuItem
                                    onSelect={(e) => {
                                      e.preventDefault()
                                      setSelectedPolicy(policy)
                                    }}
                                  >
                                    <XCircleIcon className="mr-2 size-4 text-red-600" />
                                    Delete
                                  </DropdownMenuItem>
                                </DialogTrigger>
                                <DialogContent className="w-[400px]">
                                  <DialogHeader>
                                    <DialogTitle>Delete Policy</DialogTitle>
                                    <DialogDescription>
                                        Are you sure you want to delete this policy?
                                        This action cannot be undone.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter>
                                    <Button
                                      variant="outline"
                                      onClick={() =>
                                        setIsDeleteDialogOpen(false)
                                      }
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      onClick={handleDeleteSubmit}
                                      disabled={isPending}
                                    >
                                      Delete
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Section - Fixed at bottom when scrolling */}
              <div className="sticky bottom-0 mt-auto border-t border-gray-200 bg-white">
                {/* Main pagination controls */}
                <div className="flex items-center justify-between px-4 py-2">
                  {/* Results per page */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Rows per page</span>
                    <Select
                      value={pageSize.toString()}
                      onValueChange={(value) => setPageSize(Number(value))}
                    >
                      <SelectTrigger className="h-8 w-14 border-gray-200 text-sm">
                        <SelectValue placeholder="10" />
                      </SelectTrigger>
                      <SelectContent className="text-sm">
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Pagination controls */}
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 border-gray-200 px-4 text-sm font-medium text-gray-700"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 border-gray-200 px-4 text-sm font-medium text-gray-700"
                      onClick={handleNextPage}
                      disabled={currentPage === paginationInfo.last_page}
                    >
                      Next
                    </Button>
                  </div>
                </div>

                {/* Bottom status line */}
                <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-4 py-2 text-xs text-gray-500">
                  <div>
                    Viewing {paginationInfo.from || 1}-
                    {paginationInfo.to ||
                      Math.min(pageSize, paginationInfo.total || 0)}{" "}
                    of {paginationInfo.total || 0} results
                  </div>
                  <div>
                    Page {currentPage} of {paginationInfo.last_page || 1}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
