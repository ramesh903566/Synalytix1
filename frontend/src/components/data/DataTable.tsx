"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, Search } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Skeleton } from "../ui/skeleton"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  loading?: boolean
  emptyState?: React.ReactNode
  onRowClick?: (row: TData) => void
  searchKey?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  loading = false,
  emptyState,
  onRowClick,
  searchKey,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        {searchKey ? (
          <div className="w-full max-w-sm">
            <Input
              placeholder="Search..."
              value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn(searchKey)?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
              prefixIcon={<Search className="h-4 w-4" />}
            />
          </div>
        ) : (
          <div /> // Spacer
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b border-border bg-muted/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  {headerGroup.headers.map((header) => {
                    return (
                      <th
                        key={header.id}
                        className="h-10 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 whitespace-nowrap"
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            className={
                              header.column.getCanSort()
                                ? "cursor-pointer select-none flex items-center gap-1 hover:text-foreground transition-colors"
                                : ""
                            }
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getCanSort() && (
                              <ArrowUpDown className="ml-1 h-3 w-3" />
                            )}
                          </div>
                        )}
                      </th>
                    )
                  })}
                </tr>
              ))}
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={`loading-${idx}`} className="border-b border-border transition-colors hover:bg-muted/50">
                    {columns.map((_, colIdx) => (
                      <td key={`loading-${idx}-${colIdx}`} className="p-4 align-middle">
                        <Skeleton className="h-5 w-full max-w-[200px]" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => onRowClick?.(row.original)}
                    className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${
                      onRowClick ? "cursor-pointer" : ""
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="h-24 text-center align-middle"
                  >
                    {emptyState || "No results found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <>
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </>
          )}
        </div>
        <div className="space-x-2 flex items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount() || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
