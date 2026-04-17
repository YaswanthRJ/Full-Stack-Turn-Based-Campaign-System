import { useState, useEffect } from 'react';
import type { TableProps, TableColumn, TableAction } from './Table.types';

// --- helpers ---
function renderCell<T>(row: T, col: TableColumn<T>) {
  const value = row[col.key];

  if (col.formatter) return col.formatter(value, row);
  if (col.type === 'date') return new Date(value as any).toLocaleString();

  return value as any;
}

function getActionClass(variant?: string) {
  switch (variant) {
    case 'primary':
      return 'bg-blue-500 text-white';
    case 'danger':
      return 'bg-red-500 text-white';
    default:
      return 'bg-gray-200';
  }
}

function renderActions<T>(row: T, actions: TableAction<T>[]) {
  if (!actions.length) return null;

  return (
    <td className="px-4 py-2">
      <div className="flex gap-2">
        {actions.map((action, i) => (
          <button
            key={i}
            onClick={() => action.onClick(row)}
            className={`px-2 py-1 rounded ${getActionClass(action.variant)}`}
          >
            {action.label}
          </button>
        ))}
      </div>
    </td>
  );
}

// --- main component ---
export function Table<T extends Record<string, any>>({
  columns,
  data,
  actions = [],
}: TableProps<T>) {
  const PAGE_SIZE = 20;

  const [page, setPage] = useState(1);

  const hasActions = actions.length > 0;

  // pagination calculations
  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const paginatedData = data.slice(start, start + PAGE_SIZE);

  // reset page if data shrinks
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [data.length, totalPages, page]);

  return (
    <div>
      <div className="overflow-x-auto shadow-md rounded-lg border border-purple-100">
        <table className="min-w-full text-sm">
          <thead className="bg-purple-50 border-b-2 border-purple-200">
            <tr>
              {columns.map((col) => (
                <th key={String(col.key)} className="px-6 py-3 text-left text-xs font-semibold text-purple-900 uppercase tracking-wider">
                  {col.label}
                </th>
              ))}
              {hasActions && (
                <th className="px-6 py-3 text-left text-xs font-semibold text-purple-900 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((row, index) => {
              const globalIndex = start + index;
              return (
                <tr
                  key={globalIndex}
                  className="odd:bg-white even:bg-gray-50 hover:bg-purple-50 transition-colors duration-150"
                >
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-6 py-3 text-gray-700">
                      {renderCell(row, col)}
                    </td>
                  ))}
                  {renderActions(row, actions)}
                </tr>
              );
            })}
            
            {/* Empty state */}
            {paginatedData.length === 0 && (
              <tr>
                <td 
                  colSpan={columns.length + (hasActions ? 1 : 0)} 
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* pagination controls */}
      {totalPages > 0 && (
        <div className="flex items-center justify-between mt-6 gap-4 text-sm">
          <div className="text-gray-600">
            Showing {start + 1} to {Math.min(start + PAGE_SIZE, data.length)} of {data.length} entries
          </div>

          <div className="flex items-center gap-2">
            {/* Prev */}
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex gap-1">
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let pageNum: number;
                
                // Smart pagination: show first, last, current, and neighbors
                if (totalPages <= 7) {
                  pageNum = i + 1;
                } else if (page <= 4) {
                  pageNum = i + 1;
                  if (i === 6) pageNum = totalPages;
                } else if (page >= totalPages - 3) {
                  pageNum = totalPages - 6 + i;
                } else {
                  pageNum = page - 3 + i;
                  if (i === 0) pageNum = 1;
                  if (i === 1) pageNum = page - 2;
                  if (i === 5) pageNum = page + 2;
                  if (i === 6) pageNum = totalPages;
                }
                
                // Show ellipsis for gaps
                if (i === 2 && page > 5 && totalPages > 7) {
                  return <span key="ellipsis1" className="px-2 py-1">...</span>;
                }
                if (i === 4 && page < totalPages - 4 && totalPages > 7) {
                  return <span key="ellipsis2" className="px-2 py-1">...</span>;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-3 py-1.5 rounded-md transition-colors ${
                      pageNum === page
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'border border-gray-300 text-gray-700 hover:bg-purple-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Next */}
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages || totalPages === 0}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}