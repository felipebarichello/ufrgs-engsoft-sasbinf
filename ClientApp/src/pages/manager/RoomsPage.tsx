import React, { useEffect, useState } from 'react';
import logoImg from '../../assets/logo-sasbinf.png';
import Restricted from '../../components/Restricted';
import {
	useDeleteRoomMutation,
	useLazyGetRoomsHistorySearchQuery,
	usePostCreateRoomMutation,
	usePostRoomActivationMutation,
	usePostRoomsMutation,
} from '../../api/sasbinfAPI';
import { Erroralert } from '../../components/ErrorAlert';
import './ManagerMainPage.css';
import { BookingArray } from '../../schemas/booking';
import { Booking } from '../../components/manager/Booking';

function ManagerRoomsPage() {
	return (
		<Restricted>
			<div className="manager-container">
				<ManagerRoomsPageRestricted />
			</div>
		</Restricted>
	);
}

export default ManagerRoomsPage;

function ManagerRoomsPageRestricted() {
	const [createRoom, createRoomState] = usePostCreateRoomMutation();
	const [searchRooms, searchRoomsState] = usePostRoomsMutation();
	const [roomActivation] = usePostRoomActivationMutation();
	const [deleteRoom] = useDeleteRoomMutation();
	const [getHistory] = useLazyGetRoomsHistorySearchQuery();
	const [formState, setFormState] = useState<{
		roomName: string | null;
		capacity: number | 1;
	}>({ roomName: null, capacity: 1 });
	const [selectedRoom, setSelectedRoom] = useState<null | number>(null);
	const [historyData, setHistoryData] = useState<
		Record<number, BookingArray | null>
	>({});
	const inicialFormState = { roomName: null, capacity: 1 };
	const token = sessionStorage.getItem('authToken')!;

	const fetchRooms = () => {
		searchRooms({ roomName: null, capacity: 1, token });
	};

	useEffect(() => {
		fetchRooms();
	}, []);

	const handleSearchRoom = (e: React.FormEvent) => {
		e.preventDefault();
		if (!formState) return;
		searchRooms({
			roomName: formState.roomName,
			capacity: formState.capacity,
			token,
		});
	};

	const handleCreateRoom = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!formState) return;
		await createRoom({
			name: formState.roomName!,
			capacity: formState.capacity,
			token,
		});
		setFormState(inicialFormState);
		fetchRooms();
	};

	const handleToggleRoomActivation = async (
		roomId: number,
		isActive: boolean
	) => {
		await roomActivation({ roomId, isActive: !isActive, token });
		fetchRooms();
	};

	const handleDeleteRoom = async (roomId: number) => {
		await deleteRoom({ roomId, token });
		setSelectedRoom(null);
		fetchRooms();
	};

	const handleShowHistory = async (roomId: number) => {
		if (historyData[roomId]) {
			setHistoryData((prev) => {
				const newData = { ...prev };
				delete newData[roomId];
				return newData;
			});
		} else {
			const response = await getHistory({
				roomId: roomId,
				numberOfBooks: '5',
				token,
			});
			if ('data' in response) {
				console.log('tenho dados');
				setHistoryData((prev) => ({
					...prev,
					[roomId]: response.data,
				}));
			}
		}
	};

	const toggleSelectedRoom = (roomId: number) => {
		setSelectedRoom((prev) => (prev === roomId ? null : roomId));
	};

	return (
		<div className="manager-card">
			<div className="logo-container">
				<img src={logoImg} alt="SasbINF" className="logo" />
			</div>

			<h2 className="title">Gerenciamento de Salas</h2>

			<form onSubmit={handleCreateRoom} className="form-section">
				<div className="form-fields">
					<label>Nome da sala</label>
					<input
						type="text"
						placeholder="Digite o nome da sala"
						value={formState?.roomName || ''}
						onChange={(e) =>
							setFormState({
								...formState,
								roomName: e.target.value,
							})
						}
					/>

					<label>Capacidade da sala</label>
					<input
						type="number"
						min="1"
						placeholder="Digite a capacidade da sala"
						value={formState?.capacity || 1}
						onChange={(e) =>
							setFormState({
								...formState,
								capacity: Number(e.target.value),
							})
						}
					/>
				</div>

				<div className="form-buttons">
					<button type="submit" disabled={!formState}>
						Criar Sala
					</button>
					<button onClick={handleSearchRoom}>Buscar Salas</button>
				</div>

				{createRoomState.isError && (
					<Erroralert error={createRoomState.error} />
				)}
			</form>

			{searchRoomsState.isSuccess && (
				<>
					<h3 className="room-list-title">Salas</h3>
					<ul className="room-list">
						{searchRoomsState.data?.map((r, index) => (
							<li
								key={index}
								className={
									selectedRoom === r.roomId ? 'selected' : ''
								}
								onClick={() => toggleSelectedRoom(r.roomId)}
							>
								<div className="room-name">{r.name}</div>
								{selectedRoom === r.roomId && (
									<div
										className="room-options"
										onClick={(e) => e.stopPropagation()}
									>
										<p>
											Estado:{' '}
											<strong>
												{r.isActive
													? 'Disponível'
													: 'Indisponível'}
											</strong>
										</p>
										<p>
											Capacidade:{' '}
											<strong>{r.capacity}</strong>
										</p>
										<div className="room-buttons">
											<button
												onClick={() =>
													handleToggleRoomActivation(
														r.roomId,
														r.isActive
													)
												}
											>
												Mudar Disponibilidade
											</button>
											<button
												onClick={() =>
													handleDeleteRoom(r.roomId)
												}
											>
												Deletar
											</button>
											<button
												onClick={() =>
													handleShowHistory(r.roomId)
												}
											>
												{historyData[r.roomId]
													? 'Ocultar Histórico'
													: 'Ver Histórico'}
											</button>
										</div>
										{historyData[r.roomId] && (
											<ul className="history-list">
												{historyData[r.roomId]!.map(
													(b) => (
														<Booking
															booking={b}
															idx={b.bookingId}
															setHistoryData={
																setHistoryData
															}
															useMember={false}
														/>
													)
												)}
											</ul>
										)}
									</div>
								)}
							</li>
						))}
					</ul>
				</>
			)}
		</div>
	);
}
