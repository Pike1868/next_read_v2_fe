export const BookStatuses = {
    PREVIOUSLY_READ: "previously_read",
    CURRENTLY_READING: "currently_reading",
    WANT_TO_READ: "want_to_read",
  } as const;
  
  export type BookStatus = typeof BookStatuses[keyof typeof BookStatuses];
  