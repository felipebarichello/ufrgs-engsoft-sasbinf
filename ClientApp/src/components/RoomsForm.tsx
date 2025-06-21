import { ChangeEvent, FormEvent, useState } from "react";
import { Erroralert } from "./ErrorAlert";
import { Epoch, RoomFilters } from "../pages/RoomsPage";
import { useLazyPostAvailableRoomsSearchQuery } from "../api/sasbinfAPI";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";

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
		<div
			className="card shadow-lg"
			style={{
				width: "400px",
				height: "700px",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<RoomsFormInputs
				inputs={filtersState}
				setInputs={setFiltersState}
				available={available}
				setAvailable={setAvailableRooms}
			/>
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
	const [triggerRoomSearch] = useLazyPostAvailableRoomsSearchQuery();
	const [errorState, setErrorState] = useState<{
		isError: boolean;
		error: FetchBaseQueryError | SerializedError | undefined;
	}>({ isError: false, error: undefined });

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
		const availableRoomsState = await triggerRoomSearch(inputs);
		e.preventDefault();
		try {
			if (availableRoomsState.data) {
				setAvailable(availableRoomsState.data);
			}
		} catch {
			console.log(
				availableRoomsState.error,
				availableRoomsState.isLoading,
				availableRoomsState.data
			);
		}
		setErrorState({
			isError: availableRoomsState.isError,
			error: availableRoomsState.error,
		});
	}

	return (
		<div>
			<form
				onSubmit={handleSubmit}
				className="d-flex flex-column h-100 p-4"
				style={{ gap: "1rem" }}
			>
				<div className="text-center fw-bold">Filtrar Salas:</div>

				<div className="d-flex flex-column justify-content-between flex-grow-1">
					<div
						style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
					>
						<div>
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

						<div>
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

						<div>
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

						<div>
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
					</div>

					<div className="d-grid mt-4">
						<button
							className="btn btn-primary btn-lg"
							type="submit"
							disabled={anyInputIsEmpty(inputs)}
						>
							Pesquisar
						</button>
					</div>
				</div>
				{!errorState.isError &&
					available !== null &&
					available.length === 0 && (
						<p className="text-danger text-center">Não há salas disponíveis</p>
					)}
				{errorState.isError && Erroralert({ error: errorState.error! })}
			</form>
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
