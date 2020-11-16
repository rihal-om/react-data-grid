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
  col2: string | number;
  col3: string | number;
  col4: string | number;
  col5: string | number;
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
      col1: 0,
      col2: 0,
      col3: 0,
      col4: 0,
      col5: 0,
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
        cellAlignment: "center",
      },
      {
        key: "col2",
        name: "",
        editable: true,
        cellAlignment: "left",
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
    ],
    []
  );
  const fields = [...Array(5).fill(0)];
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
  const allowPercentage = true;
  // Regex for inputs passed in to the sheet.
  const regex = allowPercentage ? /^\d+(\.\d*)?\%?$/ : /^\d+(\.\d*)?$/;
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
      let values = Object.values(updated);
      var flag;
      values.forEach((val) => {
        if (((val as unknown) as string).match(regex) == null) {
          flag = true;
          console.log(val);
          return;
        }
      });

      if (flag == true) {
        setRows(newRows);
        return;
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
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
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
