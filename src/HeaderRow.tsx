import React, { useCallback, memo } from "react";

import HeaderCell from "./HeaderCell";
import { CalculatedColumn, SuperHeader } from "./types";
import { assertIsValidKey } from "./utils";
import { DataGridProps } from "./DataGrid";
import SuperHeaderCell from "./SuperHeaderCell";
type SharedDataGridProps<R, K extends keyof R, SR> = Pick<
  DataGridProps<R, K, SR>,
  | "rows"
  | "onSelectedRowsChange"
  | "sortColumn"
  | "sortDirection"
  | "onSort"
  | "rowKey"
>;

export interface HeaderRowProps<R, K extends keyof R, SR>
  extends SharedDataGridProps<R, K, SR> {
  columns: readonly CalculatedColumn<R, SR>[];
  superHeader: SuperHeader[][] | undefined;
  allRowsSelected: boolean;
  onColumnResize: (column: CalculatedColumn<R, SR>, width: number) => void;
}

function HeaderRow<R, K extends keyof R, SR>({
  columns,
  superHeader,
  rows,
  rowKey,
  onSelectedRowsChange,
  allRowsSelected,
  onColumnResize,
  sortColumn,
  sortDirection,
  onSort,
}: HeaderRowProps<R, K, SR>) {
  const handleAllRowsSelectionChange = useCallback(
    (checked: boolean) => {
      if (!onSelectedRowsChange) return;

      assertIsValidKey(rowKey);

      const newSelectedRows = new Set<R[K]>();
      if (checked) {
        for (const row of rows) {
          newSelectedRows.add(row[rowKey]);
        }
      }

      onSelectedRowsChange(newSelectedRows);
    },
    [onSelectedRowsChange, rows, rowKey]
  );
  if (superHeader == undefined || superHeader.length == 0) {
    return (
      <div
        role="row"
        aria-rowindex={1} // aria-rowindex is 1 based
        className="rdg-header-row"
      >
        {columns.map((column) => {
          return (
            <HeaderCell<R, SR>
              key={column.key}
              column={column}
              onResize={onColumnResize}
              allRowsSelected={allRowsSelected}
              onAllRowsSelectionChange={handleAllRowsSelectionChange}
              onSort={onSort}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
            />
          );
        })}
      </div>
    );
  } else {
    return (
      <div
        role="superHeaderWrapper"
        aria-rowindex={1} // aria-rowindex is 1 based
      >
        {superHeader.map((header, i) => {
          var leftSum = 0; // this variable is only to get the sum of left for the positioning of the grid elements
          return (
            <div
              role="superHeader"
              aria-rowindex={i + 1} // aria-rowindex is 1 based
              className="rdg-header-row"
            >
              {header.map((subHeader, i, arr) => {
                var left;
                if (i == 0) {
                  left = 0;
                } else if (i == 1) {
                  left = arr[i - 1].span * columns[0].width;
                } else {
                  left = arr[i - 1].span * columns[1].width;
                }
                if (i == 0) {
                  leftSum += left;
                  return (
                    <SuperHeaderCell<R, SR>
                      key={subHeader.name}
                      left={leftSum}
                      column={columns[0]}
                      index={i}
                      superSpecs={subHeader}
                      onResize={onColumnResize}
                      allRowsSelected={allRowsSelected}
                      onAllRowsSelectionChange={handleAllRowsSelectionChange}
                      onSort={onSort}
                      sortColumn={sortColumn}
                      sortDirection={sortDirection}
                    />
                  );
                } else {
                  leftSum += left;
                  return (
                    <SuperHeaderCell<R, SR>
                      key={subHeader.name}
                      left={leftSum}
                      column={columns[1]}
                      index={i}
                      superSpecs={subHeader}
                      onResize={onColumnResize}
                      allRowsSelected={allRowsSelected}
                      onAllRowsSelectionChange={handleAllRowsSelectionChange}
                      onSort={onSort}
                      sortColumn={sortColumn}
                      sortDirection={sortDirection}
                    />
                  );
                }
              })}
            </div>
          );
        })}
      </div>
    );
  }
}

export default memo(HeaderRow) as <R, K extends keyof R, SR>(
  props: HeaderRowProps<R, K, SR>
) => JSX.Element;
