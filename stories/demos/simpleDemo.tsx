import DataGrid, {
  Column,
  DataGridHandle,
  RowsUpdateEvent,
  SuperHeader,
} from "../../src";

import React, { useState, useRef, useCallback, useMemo } from "react";

interface Row {
  Date: string;
  col1: string | number;
  col2: string;
  col3: string;
  col4: string | number;
  col5: string;
}

//dummy function just to make a radom date
function randomDate(start: any, end: any) {
  var date = new Date(+start + Math.random() * (end - start));
  return date;
}

function createRows(numberOfRows: number): Row[] {
  const rows: Row[] = [];

  for (let i = 0; i < numberOfRows; i++) {
    rows[i] = {
      Date: randomDate(i, i + 2).toLocaleString(),
      col1: `Task ${i}`,
      col2: "why",
      col3: "hacks",
      col4: `Task ${i + 1}`,
      col5: (i + 10).toString(),
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
        key: "col1",
        name: "",
        editable: true,
      },
      {
        key: "col2",
        name: "",
        editable: true,
      },
      {
        key: "col3",
        name: "",
        editable: true,
      },
      {
        key: "col4",
        name: "",
        editable: true,
      },
      {
        key: "col1",
        name: "",
        editable: true,
      },
      {
        key: "col2",
        name: "",
        editable: true,
      },
      {
        key: "col3",
        name: "",
        editable: true,
      },
      {
        key: "col4",
        name: "",
        editable: true,
      },
      {
        key: "col1",
        name: "",
        editable: true,
      },
      {
        key: "col2",
        name: "",
        editable: true,
      },
      {
        key: "col3",
        name: "",
        editable: true,
      },
    ],
    []
  );
  const fields = [...Array(12).fill(0)];

  const superHeader: SuperHeader[][] = [
    [
      { name: "", span: 1 },
      {
        name: "we are trying some of the functions here",
        span: fields.length * 2,
        textPlace: "center",
      },
    ],
    [
      { name: "Field", span: 1, textPlace: "center" },
      ...fields.map((f) => ({
        name: f.id,
        span: 2,
        textPlace: "center" as "center",
      })),
    ],
    [
      { name: "", span: 1 },
      ...Array(fields.length * 2)
        .fill("")
        .map((_, i) => ({
          name: i % 2 == 0 ? `Sch${i}` : `UnSch${i}`,
          value: i % 2 == 0 ? "Sch" : "UnSch",
          span: 1,
          textPlace: "center" as "center",
        })),
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
      headerRowHeight={30}
      onRowsUpdate={handleRowUpdate}
      selectedRows={selectedRows}
      onSelectedRowsChange={setSelectedRows}
    />
  );
}
