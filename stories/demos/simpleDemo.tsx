import DataGrid, {
  Column,
  DataGridHandle,
  RowsUpdateEvent,
  SuperHeader,
} from "../../src";

import React, { useState, useRef, useCallback, useMemo } from "react";

interface Row {
  Date: string;
  title: string | number;
  what: string;
  title3: string;
  title1: string | number;
  complete: string;
}

//dummy function just to make a radom date
function randomDate(start: any, end: any, startHour: any, endHour: any) {
  var date = new Date(+start + Math.random() * (end - start));
  var hour = (startHour + Math.random() * (endHour - startHour)) | 0;
  date.setHours(hour);
  return date;
}

function createRows(numberOfRows: number): Row[] {
  const rows: Row[] = [];

  for (let i = 0; i < numberOfRows; i++) {
    rows[i] = {
      Date: randomDate(i, i + 2, i + 4, i + 8).toLocaleString(),
      title: `Task ${i}`,
      what: "why",
      title3: "hacks",
      title1: `Task ${i + 1}`,
      complete: (i + 10).toString(),
    };
  }

  return rows;
}

export default function ReactDataGridSheet() {
  const [rows, setRows] = useState(() => createRows(100));
  const [selectedRows, setSelectedRows] = useState(
    () => new Set<string | number>()
  );
  const gridRef = useRef<DataGridHandle>(null);
  const columns = useMemo(
    (): Column<Row>[] => [
      {
        key: "Date",
        name: "",
      },
      {
        key: "gas-surface-scheduled",
        name: "",
        editable: true,
      },
      {
        key: "gas-surface-unscheduled",
        name: "",
        editable: true,
      },
      {
        key: "gas-subsurface-unscheduled",
        name: "",
        editable: true,
      },
      {
        key: "gas-subsurface-unscheduled",
        name: "",
        editable: true,
      },
    ],
    []
  );

  const superHeader: SuperHeader[][] = [
    [
      {
        name: "",
        span: 1,
      },
      {
        name: "Gas Surface Deferments (MM m³/d)",
        span: 2,
      },
      {
        name: "Gas Surface Deferments (MM m³/d)",
        span: 2,
        textPlace: "center",
      },
    ],
    [
      {
        name: "",
        span: 1,
      },
      {
        name: "Scheduled",
        span: 1,
      },
      {
        name: "Unscheduled",
        span: 1,
      },
      {
        name: "Scheduled",
        span: 1,
      },
      {
        name: "Unscheduled",
        span: 1,
      },
    ],
  ];
  const handleRowUpdate = useCallback(
    ({
      fromRow,
      toRow,
      updated,
      action,
    }: RowsUpdateEvent<Partial<Row>>): void => {
      const newRows = [...rows];
      let start: number;
      let end: number;

      if (action === "COPY_PASTE") {
        start = toRow;
        end = toRow;
      } else {
        start = Math.min(fromRow, toRow);
        end = Math.max(fromRow, toRow);
      }

      for (let i = start; i <= end; i++) {
        newRows[i] = { ...newRows[i], ...updated };
      }

      setRows(newRows);
    },
    [rows]
  );

  return (
    <DataGrid
      columns={columns}
      superHeader={superHeader}
      rows={rows}
      ref={gridRef}
      onRowsUpdate={handleRowUpdate}
      selectedRows={selectedRows}
      onSelectedRowsChange={setSelectedRows}
    />
  );
}
