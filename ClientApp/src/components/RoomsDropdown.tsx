export default function RoomsDropdown({
  availableRooms,
  selected,
  setSelected,
}: {
  availableRooms: { name: string; id: number }[];
  selected: { id: number; name: string } | null;
  setSelected: (a: { id: number; name: string } | null) => void;
}) {
  return (
    <div>
      <select
        className="rooms-dropdown"
        value={selected?.id ?? -1}
        onChange={(e) => {
          const roomId = parseInt(e.target.value);
          console.log(roomId);
          const room = availableRooms.find((r) => r.id === roomId);
          setSelected(room !== undefined ? room : null);
        }}
      >
        <option value={-1}>Selecione uma sala</option>
        {availableRooms.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name}
          </option>
        ))}
      </select>
    </div>
  );
}
