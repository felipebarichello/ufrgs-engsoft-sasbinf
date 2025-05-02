class Room {
    private int Id;
    int Capacity;
    public Room(int id, int capacity)
    {
        Id = id;
        Capacity = capacity;
    }

    public int GetId()
    {
        return Id;
    }

    public int GetCapacity()
    {
        return Capacity;
    }
}