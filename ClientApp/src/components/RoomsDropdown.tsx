export default function RoomsDropdown({
  availableRooms,
}: {
  availableRooms: { name: string; id: number }[];
}) {
  return (
    <div>
      <select
        onChange={(e) => {
          console.log(e.target.value);
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
