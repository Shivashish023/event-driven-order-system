import axios from "axios";
import { SERVICES } from "../config/services.js";

export const proxyRequest = async (req, res, service) => {
  try {
    const { url, method, body, headers } = req.body;
    const serviceUrl = SERVICES[service];

    if (!serviceUrl) {
      return res.status(500).json({ message: `Unknown service key: ${service}` });
    }

    const response = await axios({
      url: `${serviceUrl}${url}`,
      method,
      data: body,
      headers,
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response?.status || 502;
    const message =
      error.response?.data?.message ||
      error.message ||
      "Upstream service error";
    res.status(status).json({ message });
  }
};