import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import "./App.css";

const App = () => {
  const [columns, setColumns] = useState([
    { id: "name", title: "Name" },
    { id: "status", title: "Status" },
    { id: "date", title: "Date" },
    { id: "places", title: "Places" },
    { id: "people", title: "People" },
  ]);

  const [rows, setRows] = useState([
    {
      name: "Trip 2",
      status: "Idea",
      date: new Date("2024-07-11"),
      places: "India",
      people: "",
      checked: false,
    },
    {
      name: "Europe and f",
      status: "Booked",
      date: [new Date("2018-04-10"), new Date("2018-04-12")],
      places: "Spain, Portugal, and Italy",
      people: "Sasha & Bill",
      checked: false,
    },
  ]);

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const handleStatusChange = (index, newStatus) => {
    const updatedRows = [...rows];
    updatedRows[index].status = newStatus;
    setRows(updatedRows);
  };

  const handleCheckboxChange = (index) => {
    const updatedRows = [...rows];
    updatedRows[index].checked = !updatedRows[index].checked;
    setRows(updatedRows);
  };

  const addNewRow = (index) => {
    const updatedRows = [
      ...rows.slice(0, index + 1),
      {
        name: "",
        status: "Idea",
        date: null,
        places: "",
        people: "",
        checked: false,
      },
      ...rows.slice(index + 1),
    ];
    setRows(updatedRows);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      source.droppableId === "columns" &&
      destination.droppableId === "columns"
    ) {
      // Reorder columns
      const reorderedColumns = Array.from(columns);
      const [movedColumn] = reorderedColumns.splice(source.index, 1);
      reorderedColumns.splice(destination.index, 0, movedColumn);

      setColumns(reorderedColumns);
    } else if (source.droppableId === "columns") {
      // Create a new column when dragging ends
      const newColumn = {
        id: `new-${Date.now()}`,
        title: `New Column ${columns.length + 1}`,
      };

      const updatedColumns = [
        ...columns.slice(0, destination.index + 1),
        newColumn,
        ...columns.slice(destination.index + 1),
      ];

      setColumns(updatedColumns);
    }
  };

  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',width:'100vw',marginTop:'2vw'}}>
     <DragDropContext onDragEnd={onDragEnd}> 
      <Droppable droppableId="columns" direction="horizontal"   style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="overflow-x-auto ml-[3vw]"
          >
            <table className="min-w-full   border-none">
              <thead className="bg-card">
                <tr>
                  <th className="  border-none p-2 text-left pl-[2vw]">
                    {" "}
                    {"     "}
                  </th>
                  {columns.map((column, index) => (
                    <Draggable
                      key={column.id}
                      draggableId={column.id}
                      index={index}
                    >
                      {(provided) => (
                        <th
                          className="  border-none p-2 text-left"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {column.title}
                        </th>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr className="table-row bg-muted-foreground" key={rowIndex}>
                    <td className="  border-none p-2">
                      {/* "+" button */}
                      <button
                        className="plus-button"
                        onClick={() => addNewRow(rowIndex)}
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                    </td>
                    {columns.map((column) => (
                      <td key={column.id} className="  border-none p-2">
                        {column.id === "name" && (
                          <div className="flex items-center flex-row " style={{display:'flex',alignItems:'center'}}>
                            <input
                              type="checkbox"
                              className="mx-2 "
                              checked={row.checked}
                              onChange={() => handleCheckboxChange(rowIndex)}
                            />
                            <input
                              type="text"
                              value={row.name}
                              onChange={(e) =>
                                handleInputChange(
                                  rowIndex,
                                  "name",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        )}
                        {column.id === "status" && (
                          <select
                            value={row.status}
                            onChange={(e) =>
                              handleStatusChange(rowIndex, e.target.value)
                            }
                          >
                            <option value="Idea">Idea</option>
                            <option value="Booked">Booked</option>
                            <option value="Completed">Completed</option>
                          </select>
                        )}
                        {column.id === "date" && (
                          <DatePicker
                            selected={
                              Array.isArray(row.date) ? row.date[0] : row.date
                            }
                            onChange={(date) =>
                              handleInputChange(rowIndex, "date", date)
                            }
                            startDate={
                              Array.isArray(row.date) ? row.date[0] : null
                            }
                            endDate={
                              Array.isArray(row.date) ? row.date[1] : null
                            }
                            selectsRange={Array.isArray(row.date)}
                            dateFormat="MMMM d, yyyy"
                          />
                        )}
                        {column.id === "places" && (
                          <input
                            type="text"
                            value={row.places}
                            onChange={(e) =>
                              handleInputChange(
                                rowIndex,
                                "places",
                                e.target.value
                              )
                            }
                          />
                        )}
                        {column.id === "people" && (
                          <input
                            type="text"
                            value={row.people}
                            onChange={(e) =>
                              handleInputChange(
                                rowIndex,
                                "people",
                                e.target.value
                              )
                            }
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 mr-4"  style={{marginRight:'2vw'}}>
              <button
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded"
                onClick={() => addNewRow(rows.length - 1)}
              style={{marginRight:'2vw'}}>
                New
              </button>
            </div>
            <div className="  text-muted-foreground"  >
              COUNT {rows.length}
            </div>
          </div>
        )}
      </Droppable>
    </DragDropContext>
    </div>
   );
};

export default App;
