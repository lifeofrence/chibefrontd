# Room Type Selection Enhancement

## Date: 2025-12-18

## Summary
Enhanced the booking edit form to allow changing the room type, which dynamically updates the available rooms list based on the selected room type.

## Feature Overview

### What Changed
Previously, the booking edit form only allowed:
- Editing guest details
- Changing booking status
- Assigning a room (from the original room type only)

Now, administrators can also:
- **Change the room type** for a booking
- **Automatically see updated room options** when room type changes
- **Assign a room from the new room type**

## Implementation Details

### 1. Frontend Changes (`components/admin/booking-form.tsx`)

#### New State Variables:
```tsx
const [roomTypes, setRoomTypes] = useState<any[]>([])
const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<number>(booking.room_type_id)
```

#### New Functions:
- **`loadRoomTypesAndRooms()`**: Loads all room types and initializes room list
- **`handleRoomTypeChange(value: string)`**: Handles room type selection changes
  - Updates selected room type
  - Clears available rooms (triggers reload via useEffect)

#### Updated Functions:
- **`loadAvailableRooms(roomTypeId: number)`**: Now accepts room type ID parameter
  - Filters rooms by the selected room type
  - Shows available rooms + currently assigned room (if same type)

#### New UI Component:
```tsx
<Select 
    name="room_type_id" 
    value={selectedRoomTypeId.toString()}
    onValueChange={handleRoomTypeChange}
>
    {roomTypes.map((roomType) => (
        <SelectItem key={roomType.id} value={roomType.id.toString()}>
            {roomType.name}
        </SelectItem>
    ))}
</Select>
```

#### User Experience Improvements:
- Room type selector appears before room assignment
- Help text: "Changing room type will reset the assigned room selection"
- Available rooms count displayed: "X available room(s) for selected room type"
- Loading state while fetching rooms

### 2. Backend Changes (`app/admin/bookings/booking-actions.ts`)

#### Updated `updateBooking()` Function:
```typescript
// Add room_type_id if provided
const roomTypeId = formData.get('room_type_id')
if (roomTypeId && roomTypeId !== '') {
    rawFormData.room_type_id = parseInt(roomTypeId as string)
}
```

#### API Payload:
```json
{
  "guest_name": "string",
  "guest_email": "string",
  "guest_phone": "string",
  "status": "string",
  "room_type_id": number,  // NEW
  "room_id": number | null
}
```

## User Workflow

### Changing Room Type for a Booking:

1. **Open Edit Dialog**
   - Navigate to Bookings page
   - Click "..." menu on a booking
   - Select "Edit Details"

2. **Select New Room Type**
   - Find "Room Type" dropdown
   - Select a different room type
   - Notice: Available rooms list updates automatically

3. **Assign New Room**
   - Room dropdown now shows rooms from new room type
   - Select a room or leave as "No Room Assigned"

4. **Save Changes**
   - Click "Save Changes"
   - Booking now has new room type and room assignment

## Technical Behavior

### Room Filtering Logic:
```typescript
const rooms = roomType.rooms.filter((room: any) => 
    room.status === 'Available' || 
    (room.id === booking.room_id && roomTypeId === booking.room_type_id)
)
```

**Rules:**
1. Show all "Available" rooms for selected room type
2. Show currently assigned room ONLY if:
   - It belongs to the currently selected room type
   - (Prevents showing old room when type changes)

### State Management:
- **Two useEffect hooks**:
  1. Loads room types when dialog opens
  2. Loads available rooms when room type changes
  
- **Automatic clearing**:
  - When room type changes, available rooms array is cleared
  - This triggers the second useEffect to reload rooms

## Edge Cases Handled

1. **No Available Rooms**
   - Shows "No Room Assigned" option only
   - Help text shows "0 available rooms"

2. **Changing Room Type**
   - Previously assigned room disappears from list (if different type)
   - Forces user to select new room or "No Room Assigned"

3. **Same Room Type**
   - Currently assigned room remains in list
   - Can keep same room or change to another

4. **Loading States**
   - Shows spinner while fetching room types
   - Shows spinner while fetching rooms after type change

## Benefits

### For Administrators:
✅ Flexibility to move bookings between room types
✅ Handle upgrades/downgrades easily
✅ Fix booking errors (wrong room type selected)
✅ Real-time feedback on available rooms

### For System:
✅ Maintains data integrity
✅ Prevents invalid room assignments
✅ Automatic room list updates
✅ Clear user feedback

## Testing Checklist

- [ ] Change room type to different type
- [ ] Verify room list updates
- [ ] Assign room from new type
- [ ] Save and verify changes persist
- [ ] Change room type back to original
- [ ] Verify original room appears in list
- [ ] Select "No Room Assigned"
- [ ] Change room type with no rooms available
- [ ] Verify help text shows correct count
- [ ] Test with loading states
- [ ] Test form validation
- [ ] Test error handling

## API Requirements

The backend must support:
- `PUT /api/admin/bookings/{id}` with `room_type_id` parameter
- Validation that `room_id` belongs to `room_type_id`
- Proper error messages for invalid combinations

## Notes

- Room type change does NOT automatically unassign the current room
- User must explicitly select "No Room Assigned" or choose a new room
- If backend rejects the combination, form will show error
- Room type selector uses controlled component pattern (value + onValueChange)
- Room assignment uses uncontrolled pattern (defaultValue)
