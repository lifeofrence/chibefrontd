# Make Status Badge More Clickable - Manual Update

## File: components/admin/booking-list.tsx

### Line 334: Update Button className
**Find (line 334):**
```tsx
className="h-auto p-0 hover:bg-transparent"
```

**Replace with:**
```tsx
className="h-auto p-0 hover:bg-transparent group"
```

### Lines 337-342: Wrap Badge with div and add chevron
**Find (lines 337-342):**
```tsx
                                                    <Badge 
                                                        variant={getBadgeVariant(booking.status)}
                                                        className="cursor-pointer hover:opacity-80"
                                                    >
                                                        {booking.status}
                                                    </Badge>
```

**Replace with:**
```tsx
                                                    <div className="flex items-center gap-1">
                                                        <Badge 
                                                            variant={getBadgeVariant(booking.status)}
                                                            className="cursor-pointer transition-all group-hover:shadow-md group-hover:scale-105"
                                                        >
                                                            {booking.status}
                                                        </Badge>
                                                        <ChevronDown className="h-3 w-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                                                    </div>
```

## What This Does:

1. **Adds "group" class** to the Button - enables group hover effects
2. **Wraps Badge in a div** with flex layout to add the chevron icon
3. **Updates Badge className**:
   - Removes: `hover:opacity-80`
   - Adds: `transition-all group-hover:shadow-md group-hover:scale-105`
   - Effect: Badge gets shadow and slightly scales up on hover
4. **Adds ChevronDown icon** next to the badge
   - Small chevron (h-3 w-3)
   - Changes color on hover from muted to foreground
   - Smooth transition

## Visual Result:

Before hover: `[confirmed] ` 
On hover: `[confirmed] ↓` (with shadow and slight scale)

The chevron icon makes it obvious the status is clickable!
