const generateAtId = (id: string, endpoint: string): string =>
  `${import.meta.env.VITE_LINKED_EVENTS_URL}/${endpoint}/${id}/`;

export default generateAtId;
