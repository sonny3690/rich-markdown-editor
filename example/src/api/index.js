import axios from "axios";

const baseURL = `http://localhost:7777/api/v1/docs/`;

const apiClient = axios.create({
  baseURL,
});

// nothing too complicated for now
export const GET = (path, params) => {
  return apiClient.get(path, { params });
};
