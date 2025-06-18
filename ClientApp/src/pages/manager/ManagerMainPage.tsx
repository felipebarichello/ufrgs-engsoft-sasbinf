import React, { useState } from 'react';
import logoImg from '../../assets/logo-sasbinf.png';
import Restricted from '../../components/Restricted';
import {
	useDeleteRoomMutation,
	useLazyGetRoomsHistorySearchQuery,
	usePostCreateRoomMutation,
	usePostRoomActivationMutation,
} from '../../api/sasbinfAPI';
import { Erroralert } from '../../components/ErrorAlert';
import './ManagerMainPage.css';

function ManagerMainPage() {
	return (
		<Restricted>
			<div className="manager-container">
				<ManagerMainPageRestricted />
			</div>
		</Restricted>
	);
}

export default ManagerMainPage;

function ManagerMainPageRestricted() {
	const [createRoom, createRoomState] = usePostCreateRoomMutation();
	const [roomActivation, roomActivationState] =
		usePostRoomActivationMutation();
	const [deleteRoom, deleteRoomState] = useDeleteRoomMutation();
	const [getHistory, getHistoryState] = useLazyGetRoomsHistorySearchQuery();
	const [formState, setFormState] = useState<string | null>();
	const [roomId, setRoomId] = useState<string | null>();

	const token = sessionStorage.getItem('authToken')!;

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!formState) return;
		createRoom({ name: formState, capacity: 8, token });
	};

	const handleDelete = (e: React.FormEvent) => {
		e.preventDefault();
		if (!roomId) return;
		deleteRoom({ roomId, token });
	};

	const handleHistory = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!roomId) return;
		const history = await getHistory({ roomId, numberOfBooks: '5', token });
		console.log('Histórico:', history.data);
	};

	const handleAvailable = async (e: React.FormEvent) => {
		e.preventDefault();
		const result = await roomActivation({
			roomId: roomId || '0',
			isActive: false,
			token,
		});
		console.log('Ativação:', result.data);
	};

	return (
		<div className="manager-card">
			<div className="logo-container">
				<img src={logoImg} alt="SasbINF" className="logo" />
			</div>

			<h2 className="title">Gerenciamento de Salas</h2>

			{/* Criar Sala */}
			<form onSubmit={handleSubmit} className="form-section">
				<label>Nome da sala</label>
				<input
					type="text"
					placeholder="Digite o nome da sala"
					value={formState || ''}
					onChange={(e) => setFormState(e.target.value)}
				/>
				<button type="submit" disabled={!formState}>
					Criar Sala
				</button>
				{createRoomState.isError && (
					<Erroralert error={createRoomState.error} />
				)}
			</form>

			{/* Deletar Sala */}
			<form onSubmit={handleDelete} className="form-section">
				<label>ID da sala</label>
				<input
					type="text"
					placeholder="Digite o ID da sala"
					value={roomId || ''}
					onChange={(e) => setRoomId(e.target.value)}
				/>
				<button type="submit" disabled={!roomId}>
					Deletar Sala
				</button>
				{deleteRoomState.isError && (
					<Erroralert error={deleteRoomState.error} />
				)}
			</form>

			{/* Histórico */}
			<form onSubmit={handleHistory} className="form-section">
				<button type="submit" disabled={!roomId}>
					Ver Histórico da Sala
				</button>
				{getHistoryState.isError && (
					<Erroralert error={getHistoryState.error} />
				)}
			</form>

			{/* Ativação */}
			<form onSubmit={handleAvailable} className="form-section">
				<button type="submit">
					Alterar Acessibilidade da Sala para Falso{' '}
				</button>
				{roomActivationState.isError && (
					<Erroralert error={roomActivationState.error} />
				)}
			</form>
		</div>
	);
}
