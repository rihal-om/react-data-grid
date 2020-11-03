import React, { createElement } from "react";
import clsx from "clsx";

import { CalculatedColumn, SuperHeader } from "./types";
import { HeaderRowProps } from "./HeaderRow";
import SortableHeaderCell from "./headerCells/SortableHeaderCell";
import ResizableHeaderCell from "./headerCells/ResizableHeaderCell";
import { SortDirection } from "./enums";

function getAriaSort(sortDirection?: SortDirection) {
  switch (sortDirection) {
    case "ASC":
      return "ascending";
    case "DESC":
      return "descending";
    default:
      return "none";
  }
}

type SharedHeaderRowProps<R, SR> = Pick<
  HeaderRowProps<R, never, SR>,
  "sortColumn" | "sortDirection" | "onSort" | "allRowsSelected"
>;

export interface superHeaderCellProps<R, SR>
  extends SharedHeaderRowProps<R, SR> {
  column: CalculatedColumn<R, SR>;
  superSpecs: SuperHeader;
  index: number;
  left: number;
  onResize: (column: CalculatedColumn<R, SR>, width: number) => void;
  onAllRowsSelectionChange: (checked: boolean) => void;
}

export default function SuperHeaderCell<R, SR>({
  column,
  onResize,
  index,
  left,
  superSpecs: superSpecs,
  allRowsSelected,
  onAllRowsSelectionChange,
  sortColumn,
  sortDirection,
  onSort,
}: superHeaderCellProps<R, SR>) {
  function getCell() {
    if (!column.headerRenderer) return superSpecs.name;

    return createElement(column.headerRenderer, {
      column,
      allRowsSelected,
      onAllRowsSelectionChange,
    });
  }

  let cell = getCell();

  if (column.sortable) {
    cell = (
      <SortableHeaderCell
        column={column}
        onSort={onSort}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
      >
        {cell}
      </SortableHeaderCell>
    );
  }

  const className = clsx("rdg-cell", column.headerCellClass, {
    "rdg-cell-frozen": column.frozen,
    "rdg-cell-frozen-last": column.isLastFrozenColumn,
  });

  const style: React.CSSProperties = {
    width: column.width * superSpecs.span,
    left: left,
    textAlign: superSpecs.textPlace,
  };

  cell = (
    <div
      role="column-header"
      aria-colindex={index + 1}
      aria-sort={
        sortColumn === superSpecs.name ? getAriaSort(sortDirection) : undefined
      }
      className={className}
      style={style}
    >
      {cell}
    </div>
  );
  if (column.resizable) {
    cell = (
      <ResizableHeaderCell column={column} onResize={onResize}>
        {cell as React.ReactElement<React.ComponentProps<"div">>}
      </ResizableHeaderCell>
    );
  }

  return cell;
}
