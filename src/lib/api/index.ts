import axios from "axios";

const baseURL = `http://localhost:7777/api/v1/doc/`;

const apiClient = axios.create({
  baseURL,
});

// nothing too complicated for now
export const GET = (path: string, params?: Record<string, any>) => {
  return apiClient.get(path, { params });
};
