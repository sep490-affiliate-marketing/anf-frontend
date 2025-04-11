"use client"

import { useState } from "react"

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"
import { Edit2, MoreHorizontal, Trash2 } from "lucide-react"

import {
  TrafficSource,
  useDeleteTrafficSources,
  useGetPublisherTrafficSources,
} from "@/hooks/traffic-source"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import EditTrafficSourceModal from "./modals/edit-traffic-source-modal"

export default function TrafficSourceDataTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [editingSource, setEditingSource] = useState<TrafficSource | null>(null)

  const { data: trafficSources = [], isLoading } =
    useGetPublisherTrafficSources()
  const { mutate: deleteTrafficSources } = useDeleteTrafficSources()

  const handleEdit = (source: TrafficSource) => {
    setEditingSource(source)
  }

  const handleDelete = async (id: number) => {
    if (
      window.confirm("Are you sure you want to delete this traffic source?")
    ) {
      deleteTrafficSources([id])
    }
  }

  const columns: ColumnDef<TrafficSource>[] = [
    {
      accessorKey: "provider",
      header: "Provider",
    },
    {
      accessorKey: "sourceUrl",
      header: "Source URL",
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        return <Badge variant="outline">{row.getValue("type")}</Badge>
      },
    },
    // {
    //   accessorKey: "status",
    //   header: "Status",
    //   cell: ({ row }) => {
    //     const status = row.getValue("status") as string
    //     return (
    //       <Badge
    //         variant="outline"
    //         className={
    //           status === "Active"
    //             ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    //             : status === "Inactive"
    //               ? "border-red-200 bg-red-50 text-red-700"
    //               : "border-yellow-200 bg-yellow-50 text-yellow-700"
    //         }
    //       >
    //         {status}
    //       </Badge>
    //     )
    //   },
    // },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        return new Date(row.getValue("createdAt")).toLocaleDateString()
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const source = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleEdit(source)}
                className="cursor-pointer"
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(source.id)}
                className="cursor-pointer text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: trafficSources,
    columns: columns as ColumnDef<TrafficSource, any>[],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter sources..."
          value={
            (table.getColumn("provider")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("provider")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No traffic sources found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {editingSource && (
        <EditTrafficSourceModal
          trafficSource={editingSource}
          open={!!editingSource}
          onOpenChange={(open) => !open && setEditingSource(null)}
        />
      )}
    </div>
  )
}

