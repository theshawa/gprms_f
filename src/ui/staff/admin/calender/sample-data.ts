export interface CalendarReservation {
  id: number;
  customerName: string;
  customerPhone: string;
  tableNumber: string;
  diningAreaName: string;
  guestCount: number;
  reservationTime: string;
  buffetType: "Brunch" | "Lunch" | "High Tea" | "Dinner";
  status: "Confirmed" | "Pending" | "Cancelled" | "Completed";
  specialRequests?: string;
  occasionType?: string;
  preferredSeating?: string;
  createdAt: string;
}

export interface RestaurantClosure {
  id: number;
  date: string;
  startTime?: string; // For partial closures
  endTime?: string;   // For partial closures
  isFullDay: boolean;
  reason: string;
  description?: string;
  createdAt: string;
}

export const sampleReservations: CalendarReservation[] = [
  {
    id: 1,
    customerName: "John Doe",
    customerPhone: "+94 77 123 4567",
    tableNumber: "T05",
    diningAreaName: "Main Hall",
    guestCount: 4,
    reservationTime: "2025-01-17T19:00:00Z",
    buffetType: "Dinner",
    status: "Confirmed",
    specialRequests: "Birthday celebration",
    occasionType: "Birthday",
    preferredSeating: "Window seat",
    createdAt: "2025-01-15T10:30:00Z",
  },
  {
    id: 2,
    customerName: "Sarah Wilson",
    customerPhone: "+94 71 987 6543",
    tableNumber: "T12",
    diningAreaName: "Terrace",
    guestCount: 2,
    reservationTime: "2025-01-17T12:30:00Z",
    buffetType: "Lunch",
    status: "Confirmed",
    specialRequests: "Vegetarian options",
    occasionType: "Anniversary",
    preferredSeating: "Outdoor",
    createdAt: "2025-01-16T08:15:00Z",
  },
  {
    id: 3,
    customerName: "Michael Chen",
    customerPhone: "+94 76 555 0123",
    tableNumber: "T08",
    diningAreaName: "Garden Area",
    guestCount: 6,
    reservationTime: "2025-01-18T10:00:00Z",
    buffetType: "Brunch",
    status: "Pending",
    specialRequests: "High chairs needed for children",
    occasionType: "Family gathering",
    preferredSeating: "Large table",
    createdAt: "2025-01-16T14:20:00Z",
  },
  {
    id: 4,
    customerName: "Emily Rodriguez",
    customerPhone: "+94 75 888 9999",
    tableNumber: "T03",
    diningAreaName: "Private Dining",
    guestCount: 8,
    reservationTime: "2025-01-18T20:00:00Z",
    buffetType: "Dinner",
    status: "Confirmed",
    specialRequests: "Corporate dinner, need quiet space",
    occasionType: "Business meeting",
    preferredSeating: "Private room",
    createdAt: "2025-01-14T16:45:00Z",
  },
  {
    id: 5,
    customerName: "David Kumar",
    customerPhone: "+94 77 222 3333",
    tableNumber: "T15",
    diningAreaName: "Rooftop",
    guestCount: 3,
    reservationTime: "2025-01-19T15:30:00Z",
    buffetType: "High Tea",
    status: "Confirmed",
    specialRequests: "Celebrating promotion",
    occasionType: "Celebration",
    preferredSeating: "Corner table",
    createdAt: "2025-01-17T11:00:00Z",
  },
  {
    id: 6,
    customerName: "Lisa Thompson",
    customerPhone: "+94 70 444 5555",
    tableNumber: "T20",
    diningAreaName: "Main Hall",
    guestCount: 5,
    reservationTime: "2025-01-19T18:30:00Z",
    buffetType: "Dinner",
    status: "Cancelled",
    specialRequests: "No seafood allergies",
    occasionType: "Friend's gathering",
    preferredSeating: "Central table",
    createdAt: "2025-01-16T09:30:00Z",
  },
  {
    id: 7,
    customerName: "Robert Singh",
    customerPhone: "+94 78 666 7777",
    tableNumber: "T07",
    diningAreaName: "Terrace",
    guestCount: 2,
    reservationTime: "2025-01-20T13:00:00Z",
    buffetType: "Lunch",
    status: "Confirmed",
    specialRequests: "Quiet atmosphere for proposal",
    occasionType: "Proposal",
    preferredSeating: "Romantic setup",
    createdAt: "2025-01-18T13:15:00Z",
  },
  {
    id: 8,
    customerName: "Anna Perera",
    customerPhone: "+94 71 333 4444",
    tableNumber: "T11",
    diningAreaName: "Garden Area",
    guestCount: 12,
    reservationTime: "2025-01-21T11:00:00Z",
    buffetType: "Brunch",
    status: "Pending",
    specialRequests: "Large group, need connecting tables",
    occasionType: "Reunion",
    preferredSeating: "Large arrangement",
    createdAt: "2025-01-19T10:45:00Z",
  },
];

export const sampleClosures: RestaurantClosure[] = [
  {
    id: 1,
    date: "2025-01-22",
    startTime: "14:00",
    endTime: "16:00",
    isFullDay: false,
    reason: "Staff Training",
    description: "Mandatory customer service training for all staff",
    createdAt: "2025-01-15T09:00:00Z",
  },
  {
    id: 2,
    date: "2025-01-25",
    isFullDay: true,
    reason: "Deep Cleaning",
    description: "Annual deep cleaning and maintenance of kitchen equipment",
    createdAt: "2025-01-10T14:30:00Z",
  },
  {
    id: 3,
    date: "2025-01-30",
    startTime: "09:00",
    endTime: "12:00",
    isFullDay: false,
    reason: "Equipment Maintenance",
    description: "HVAC system maintenance and inspection",
    createdAt: "2025-01-20T11:20:00Z",
  },
  {
    id: 4,
    date: "2025-02-14",
    isFullDay: true,
    reason: "Public Holiday",
    description: "Valentine's Day - Restaurant closed for special private events only",
    createdAt: "2025-01-05T08:00:00Z",
  },
];
