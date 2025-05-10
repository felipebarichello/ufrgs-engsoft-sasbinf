import { ChangeEvent, FormEvent, useState } from "react";
import { useLazyPostAvailableRoomsSearchQuery } from "../api/sasbinfAPI";

const Epoch = Object.freeze(new Date(0, 0, 0, 0, 0, 0));

const initialState: RoomFilters = {
  day: Epoch.toLocaleDateString(),
  startTime: Epoch.toLocaleTimeString(),
  endTime: Epoch.toLocaleTimeString(),
  capacity: 1,
};

export default function RoomsForm({
  setAvailableRooms,
}: {
  setAvailableRooms: (a: number[]) => void;
}) {
  const [filtersState, setFiltersState] = useState<RoomFilters>(initialState);

  return (
    <div>
      <h2>Filtrar Sala</h2>
      <div className="d-flex">
        <RoomsFormInputs
          inputs={filtersState}
          setInputs={setFiltersState}
          setAvailable={setAvailableRooms}
        />
      </div>
    </div>
  );
}

function RoomsFormInputs({
  inputs,
  setInputs,
  setAvailable,
}: {
  inputs: RoomFilters;
  setInputs: React.Dispatch<React.SetStateAction<RoomFilters>>;
  setAvailable: (a: number[]) => void;
}) {
  const [triggerAvailableRoomsQuery, { error, isLoading, data }] =
    useLazyPostAvailableRoomsSearchQuery();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const label = event.target.name;
    const value = event.target.value;
    console.log(label, value);
    setInputs({
      ...inputs,
      [label]: value,
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    setAvailable([]);
    e.preventDefault();
    if (anyInputIsEmpty(inputs)) return;
    try {
      const newAvailableState = await triggerAvailableRoomsQuery(
        inputs
      ).unwrap();

      setAvailable(newAvailableState);
    } catch {
      console.log(error, isLoading, data);
    }
  }

  const inputDivStyle = {
    marginBottom: "10px",
    padding: "10px",
    border: "1px solid gray",
    backgroundColor: "#D9D9D9",
    width: "100%",
    height: "25%",
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        className="d-flex flex-column justify-content-between align-items-end"
        style={{ height: "100%" }}
      >
        <div className="mb-3" style={inputDivStyle}>
          <label htmlFor="day" className="form-label">
            Dia
          </label>
          <input
            className="form-control"
            name="day"
            id="day"
            type="date"
            onChange={handleChange}
            value={inputs.day}
          />
        </div>
        <br />
        <div style={inputDivStyle}>
          <label htmlFor="startTime" className="form-label">
            Horário de Entrada
          </label>

          <input
            className="form-control"
            name="startTime"
            id="startTime"
            type="time"
            defaultValue="00:00"
            onChange={handleChange}
            value={inputs.startTime}
          />
        </div>

        <br />
        <div style={inputDivStyle}>
          <label htmlFor="endTime" className="form-label">
            Horário de Saída
          </label>
          <input
            className="form-control"
            name="endTime"
            id="endTime"
            type="time"
            defaultValue="00:00"
            onChange={handleChange}
            value={inputs.endTime}
          />
        </div>

        <br />
        <div style={inputDivStyle}>
          <label htmlFor="capacity" className="form-label">
            Capacidade requerida
          </label>
          <input
            className="form-control"
            name="capacity"
            id="capacity"
            onChange={handleChange}
            value={inputs.capacity}
          />
        </div>
      </div>

      <br />
      <div className="d-grid gap-2">
        <button
          className="btn btn-danger"
          type="submit"
          disabled={inputs.capacity < 1}
        >
          Pesquisar
        </button>
      </div>
    </form>
  );
}

export type RoomFilters = {
  day: string;
  startTime: string;
  endTime: string;
  capacity: number;
};

export type RoomFiltersDTO = {
  day: Date;
  startTime: Date;
  endTime: Date;
  capacity: number;
};

// TODO: Show error to the user
function anyInputIsEmpty({
  capacity,
  day,
  endTime,
  startTime,
}: RoomFilters): boolean {
  return capacity < 1 || day === "" || endTime === "" || startTime === "";
}
