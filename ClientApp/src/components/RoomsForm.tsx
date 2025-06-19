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
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Filtrar Salas Disponíveis</h2>
      <div className="d-flex justify-content-center">
        <div className="card shadow-lg p-4 w-100" style={{ maxWidth: "600px" }}>
          <RoomsFormInputs
            inputs={filtersState}
            setInputs={setFiltersState}
            available={available}
            setAvailable={setAvailableRooms}
          />
        </div>
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
          <div className="mb-3">
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
          <div className="mb-3">
            <label htmlFor="startTime" className="form-label">
              Horário de Entrada
            </label>
            <input
              className="form-control"
              name="startTime"
              id="startTime"
              type="time"
              value={inputs.startTime}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="endTime" className="form-label">
              Horário de Saída
            </label>
            <input
              className="form-control"
              name="endTime"
              id="endTime"
              type="time"
              value={inputs.endTime}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="capacity" className="form-label">
              Capacidade Requerida
            </label>
            <input
              className="form-control"
              name="capacity"
              id="capacity"
              type="number"
              value={inputs.capacity}
              onChange={handleChange}
              min={1}
            />
          </div>

          <div className="d-grid">
            <button
              className="btn btn-primary btn-lg"
              type="submit"
              disabled={anyInputIsEmpty(inputs)}
            >
              🔎 Pesquisar
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
