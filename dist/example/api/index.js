"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const baseURL = `http://localhost:7777/api/v1/docs/`;
const apiClient = axios_1.default.create({
    baseURL,
});
exports.GET = (path, params) => {
    return apiClient.get(path, { params });
};
//# sourceMappingURL=index.js.map