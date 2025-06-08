import { ChangeEvent, FormEvent } from "react";
import { useLazyPostAvailableRoomsSearchQuery } from "../api/sasbinfAPI";
import { Erroralert } from "./ErrorAlert";
import { Epoch, RoomFilters } from "../pages/RoomsPage";

export default function RoomsForm({
  available,
  setAvailableRooms,
  filtersState,
  setFiltersState,
}: {
  available: { name: string; id: number }[] | null;
  setAvailableRooms: (a: { name: string; id: number }[]) => void;
  filtersState: RoomFilters;
  setFiltersState: (a: RoomFilters) => void;
}) {
  return (
    <div>
      <h2>Filtrar Sala</h2>
      <div className="d-flex">
        <RoomsFormInputs
          inputs={filtersState}
          setInputs={setFiltersState}
          available={available}
          setAvailable={setAvailableRooms}
        />
      </div>
    </div>
  );
}

function RoomsFormInputs({
  inputs,
  setInputs,
  available,
  setAvailable,
}: {
  inputs: RoomFilters;
  setInputs: (a: RoomFilters) => void;
  available: { name: string; id: number }[] | null;
  setAvailable: (a: { name: string; id: number }[]) => void;
}) {
  const [triggerAvailableRoomsQuery, availableRoomsState] =
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
    try {
      const newAvailableState = await triggerAvailableRoomsQuery(
        inputs
      ).unwrap();

      setAvailable(newAvailableState);
    } catch {
      console.log(
        availableRoomsState.error,
        availableRoomsState.isLoading,
        availableRoomsState.data
      );
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
    <div>
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
            disabled={anyInputIsEmpty(inputs)}
          >
            Pesquisar
          </button>
        </div>
      </form>

      {!availableRoomsState.isLoading &&
        !availableRoomsState.isError &&
        available !== null &&
        available.length === 0 && (
          <p style={{ color: "red", marginTop: "10px" }}>
            {" "}
            Não há salas disponíveis
          </p>
        )}

      {availableRoomsState.isError &&
        Erroralert({ error: availableRoomsState.error })}
    </div>
  );
}

export type RoomFiltersDTO = {
  day: Date;
  startTime: Date;
  endTime: Date;
  capacity: number;
};

function anyInputIsEmpty({
  capacity,
  day,
  endTime,
  startTime,
}: RoomFilters): boolean {
  return (
    capacity < 1 ||
    day === "" ||
    day === Epoch.toLocaleDateString() ||
    startTime === Epoch.toLocaleDateString() ||
    endTime === Epoch.toLocaleTimeString()
  );
}
