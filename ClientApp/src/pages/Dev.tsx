export default function Dev() {
  return (
    <>
      <RoomsDropdown availableRooms={rooms} />
    </>
  );
}

const rooms: { name: `Sala 104${string}`; id: number }[] = [
  { name: "Sala 104A", id: 0 },
  { name: "Sala 104B", id: 1 },
  { name: "Sala 104C", id: 2 },
];

function RoomsDropdown({
  availableRooms,
}: {
  availableRooms: { name: `Sala 104${string}`; id: number }[];
}) {
  return (
    <select
      onChange={(e) => {
        console.log(e.target.value);
      }}
    >
        <option value={-1}>Selecione uma sala</option>
      {availableRooms.map((r) => (
        <option value={r.id}>{r.name}</option>
      ))}
    </select>
  );
}
