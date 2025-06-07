export default function RoomsDropdown({
  availableRooms,
  setSelected,
}: {
  availableRooms: { name: string; id: number }[];
  setSelected: (a: { id: number; name: string } | null) => void;
}) {
  return (
    <div>
      <select
        onChange={(e) => {
          const roomId = parseInt(e.target.value);
          console.log(roomId);
          const room = availableRooms.find((r) => r.id === roomId);
          setSelected(room !== undefined ? room : null);
        }}
      >
        <option value={-1}>Selecione uma sala</option>
        {availableRooms.map((r) => (
          <option value={r.id}>{`${r.name}`}</option>
        ))}
      </select>
    </div>
  );
}
