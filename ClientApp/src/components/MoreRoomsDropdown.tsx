import { ChangeEvent, useState } from "react";

type RoomName = `Sala 104${string}`;

interface HashTable<T> {
  [key: RoomName]: T;
}

export default function MoreRoomsDropdown({
  availableRooms,
}: {
  availableRooms: number[];
}) {
  const options = availableRooms;
  const idToName = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const [myValue, setMyValue] = useState(options[0]);

  function handleDropdownChange(e: ChangeEvent<HTMLSelectElement>) {
    const nameToId: HashTable<number> = {
      "Sala 104A": 1,
      "Sala 104B": 2,
      "Sala 104C": 3,
      "Sala 104D": 4,
      "Sala 104E": 5,
      "Sala 104F": 6,
      "Sala 104G": 7,
      "Sala 104H": 8,
    };

    const value = e.target.value as RoomName;
    if (value.match(/^Sala 104[A-H]$/) === null) {
      throw new Error("Invalid Room Name");
    }

    setMyValue(nameToId[value]);
  }

  return (
    <div>
      <select
        onChange={(e) => {
          handleDropdownChange(e);
        }}
        defaultValue={myValue}
      >
        {options.map((option, idx) => (
          <option key={idx}>{`Sala 104${idToName[option]}`}</option>
        ))}
      </select>
      <h2>
        {" "}
        You selected{" "}
        <span style={{ backgroundColor: "yellow" }}>{myValue}</span>
      </h2>
    </div>
  );
}
