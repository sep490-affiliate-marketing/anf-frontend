"use client"

import { useState } from "react"

import { useAuth } from "@/providers/auth-provider"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"
import {
  ArrowLeftToLineIcon,
  ArrowRightToLineIcon,
  ChevronDownIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  EllipsisIcon,
  MoreHorizontalIcon,
  PinOffIcon,
} from "lucide-react"

import { ICampaign } from "@/types/campaign.type"

import { cn } from "@/lib/utils"

import { useGetCampaignsByAdvertiser } from "@/hooks/campaign"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
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

import { getPinningStyles } from "@/components/data-table/pinning-style"

const columns: ColumnDef<ICampaign>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
    enablePinning: false,
    enableResizing: false,
  },
  {
    header: "Campaign Name",
    accessorKey: "name",
    cell: ({ row }) => (
      <div className="truncate font-medium">{row.getValue("name")}</div>
    ),
    size: 250,
  },
  {
    header: "Start Date",
    accessorKey: "startDate",
    cell: ({ row }) => (
      <div className="truncate">{row.getValue("startDate")}</div>
    ),
  },
  {
    header: "End Date",
    accessorKey: "endDate",
    cell: ({ row }) => (
      <div className="truncate">{row.getValue("endDate")}</div>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <div
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
            status === "Started"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          )}
        >
          {status}
        </div>
      )
    },
  },
  {
    header: "Balance",
    accessorKey: "balance",
    cell: ({ row }) => (
      <div className="truncate">
        {new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(row.getValue("balance"))}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex size-8 p-0 data-[state=open]:bg-muted"
              >
                <MoreHorizontalIcon className="size-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
    enablePinning: false,
    enableResizing: false,
    size: 80,
  },
]

export default function CampaignDataTable() {
  const [pageSize, setPageSize] = useState(10)
  const [pageNumber, setPageNumber] = useState(1)
  const [sorting, setSorting] = useState<SortingState>([])
  const { user } = useAuth()
  const { data, isLoading } = useGetCampaignsByAdvertiser(
    {
      pageNumber,
      pageSize,
    },
    user?.userCode || ""
  )

  const table = useReactTable({
    data: data?.value?.data || [],
    columns,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
      pagination: {
        pageIndex: (data?.value?.pageNumber || 1) - 1,
        pageSize: data?.value?.pageSize || 10,
      },
    },
    pageCount: data?.value?.totalPages || 1,
    manualPagination: true,
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newState = updater({
          pageIndex: (data?.value?.pageNumber || 1) - 1,
          pageSize: data?.value?.pageSize || 10,
        })
        setPageNumber(newState.pageIndex + 1)
        setPageSize(newState.pageSize)
      }
    },
    enableSortingRemoval: false,
  })

  return (
    <>
      <div className="w-full">
        <Table className="w-full table-fixed border-separate border-spacing-0 [&_td]:border-border [&_tfoot_td]:border-t [&_th]:border-b [&_th]:border-border [&_tr:not(:last-child)_td]:border-b [&_tr]:border-none">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/50">
                {headerGroup.headers.map((header) => {
                  const { column } = header
                  const isPinned = column.getIsPinned()
                  const isLastLeftPinned =
                    isPinned === "left" && column.getIsLastColumn("left")
                  const isFirstRightPinned =
                    isPinned === "right" && column.getIsFirstColumn("right")

                  return (
                    <TableHead
                      key={header.id}
                      className="data-pinned:bg-muted/90 data-pinned:backdrop-blur-xs relative h-10 truncate border-t [&:not([data-pinned]):has(+[data-pinned])_div.cursor-col-resize:last-child]:opacity-0 [&[data-last-col=left]_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=left][data-last-col=left]]:border-r [&[data-pinned=right]:last-child_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=right][data-last-col=right]]:border-l [&[data-pinned][data-last-col]]:border-border"
                      colSpan={header.colSpan}
                      style={{
                        ...getPinningStyles(column),
                      }}
                      data-pinned={isPinned || undefined}
                      data-last-col={
                        isLastLeftPinned
                          ? "left"
                          : isFirstRightPinned
                            ? "right"
                            : undefined
                      }
                      aria-sort={
                        header.column.getIsSorted() === "asc"
                          ? "ascending"
                          : header.column.getIsSorted() === "desc"
                            ? "descending"
                            : "none"
                      }
                    >
                      <div
                        className={cn(
                          "flex items-center justify-between gap-2",
                          header.column.getCanSort() &&
                            "cursor-pointer select-none"
                        )}
                        onClick={
                          header.column.getCanSort()
                            ? header.column.getToggleSortingHandler()
                            : undefined
                        }
                        onKeyDown={(e) => {
                          if (
                            header.column.getCanSort() &&
                            (e.key === "Enter" || e.key === " ")
                          ) {
                            e.preventDefault()
                            header.column.getToggleSortingHandler()?.(e)
                          }
                        }}
                        tabIndex={header.column.getCanSort() ? 0 : undefined}
                      >
                        <div className="flex items-center gap-1">
                          <span className="truncate">
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </span>
                          {header.column.getCanSort() && (
                            <div className="flex items-center">
                              {header.column.getIsSorted() === "asc" ? (
                                <ChevronUpIcon className="size-4 shrink-0 opacity-60" />
                              ) : header.column.getIsSorted() === "desc" ? (
                                <ChevronDownIcon className="size-4 shrink-0 opacity-60" />
                              ) : null}
                            </div>
                          )}
                        </div>
                        {/* Pin/Unpin column controls with enhanced accessibility */}
                        {!header.isPlaceholder &&
                          header.column.getCanPin() &&
                          (header.column.getIsPinned() ? (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="-mr-1 size-7 shadow-none"
                              onClick={() => header.column.pin(false)}
                              title={`Unpin ${
                                header.column.columnDef.header as string
                              } column`}
                            >
                              <PinOffIcon
                                className="opacity-60"
                                size={16}
                                aria-hidden="true"
                              />
                            </Button>
                          ) : (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="-mr-1 size-7 shadow-none"
                                >
                                  <EllipsisIcon
                                    className="opacity-60"
                                    size={16}
                                    aria-hidden="true"
                                  />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => header.column.pin("left")}
                                >
                                  <ArrowLeftToLineIcon
                                    size={16}
                                    className="opacity-60"
                                    aria-hidden="true"
                                  />
                                  Stick to left
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => header.column.pin("right")}
                                >
                                  <ArrowRightToLineIcon
                                    size={16}
                                    className="opacity-60"
                                    aria-hidden="true"
                                  />
                                  Stick to right
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          ))}
                        {header.column.getCanResize() && (
                          <div
                            {...{
                              onDoubleClick: () => header.column.resetSize(),
                              onMouseDown: header.getResizeHandler(),
                              onTouchStart: header.getResizeHandler(),
                              className:
                                "absolute top-0 h-full w-4 cursor-col-resize user-select-none touch-none -right-2 z-10 flex justify-center before:absolute before:w-px before:inset-y-0 before:bg-border before:-translate-x-px",
                            }}
                          />
                        )}
                      </div>
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => {
                    const { column } = cell
                    const isPinned = column.getIsPinned()
                    const isLastLeftPinned =
                      isPinned === "left" && column.getIsLastColumn("left")
                    const isFirstRightPinned =
                      isPinned === "right" && column.getIsFirstColumn("right")

                    return (
                      <TableCell
                        key={cell.id}
                        className="data-pinned:bg-background/90 data-pinned:backdrop-blur-xs truncate [&[data-pinned=left][data-last-col=left]]:border-r [&[data-pinned=right][data-last-col=right]]:border-l [&[data-pinned][data-last-col]]:border-border"
                        style={{
                          ...getPinningStyles(column),
                        }}
                        data-pinned={isPinned || undefined}
                        data-last-col={
                          isLastLeftPinned
                            ? "left"
                            : isFirstRightPinned
                              ? "right"
                              : undefined
                        }
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between gap-8">
        {/* Results per page */}
        <div className="flex items-center gap-3">
          <Label htmlFor="rows-per-page" className="max-sm:sr-only">
            Rows per page
          </Label>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              setPageSize(Number(value))
              setPageNumber(1)
            }}
          >
            <SelectTrigger
              id="rows-per-page"
              className="w-fit whitespace-nowrap"
            >
              <SelectValue placeholder="Select number of results" />
            </SelectTrigger>
            <SelectContent className="[&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2">
              {[5, 10, 25, 50].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Page number information */}
        <div className="flex grow justify-end whitespace-nowrap text-sm text-muted-foreground">
          <p
            className="whitespace-nowrap text-sm text-muted-foreground"
            aria-live="polite"
          >
            <span className="text-foreground">
              {data?.value ? (pageNumber - 1) * pageSize + 1 : 0}-
              {data?.value
                ? Math.min(pageNumber * pageSize, data.value.totalRecords)
                : 0}
            </span>{" "}
            of{" "}
            <span className="text-foreground">
              {data?.value?.totalRecords || 0}
            </span>
          </p>
        </div>

        {/* Pagination buttons */}
        <div>
          <Pagination>
            <PaginationContent>
              {/* First page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => setPageNumber(1)}
                  disabled={pageNumber === 1 || isLoading}
                  aria-label="Go to first page"
                >
                  <ChevronFirstIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Previous page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => setPageNumber(pageNumber - 1)}
                  disabled={pageNumber === 1 || isLoading}
                  aria-label="Go to previous page"
                >
                  <ChevronLeftIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Next page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => setPageNumber(pageNumber + 1)}
                  disabled={!data?.value?.hasNextPage || isLoading}
                  aria-label="Go to next page"
                >
                  <ChevronRightIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Last page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => setPageNumber(data?.value?.totalPages || 1)}
                  disabled={!data?.value?.hasNextPage || isLoading}
                  aria-label="Go to last page"
                >
                  <ChevronLastIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </>
  )
}
