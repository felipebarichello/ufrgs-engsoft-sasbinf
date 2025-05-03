internal class Room {
    private readonly int Id;
    private readonly int Capacity;
    public Room(int id, int capacity) {
        Id = id;
        Capacity = capacity;
    }

    public int GetId() {
        return Id;
    }

    public int GetCapacity() {
        return Capacity;
    }
}
