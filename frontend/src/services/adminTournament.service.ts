import axios from "axios";

const API_URL =
  "http://localhost:8080/api/tournaments";

export const getTournaments =
  async () => {
    const response =
      await axios.get(API_URL);

    return response.data;
  };

export const createTournament =
  async (data: any) => {
    const response =
      await axios.post(
        API_URL,
        data
      );

    return response.data;
  };

export const updateTournament =
  async (
    id: number,
    data: any
  ) => {
    const response =
      await axios.put(
        `${API_URL}/${id}`,
        data
      );

    return response.data;
  };

export const deleteTournament =
  async (id: number) => {
    const response =
      await axios.delete(
        `${API_URL}/${id}`
      );

    return response.data;
  };