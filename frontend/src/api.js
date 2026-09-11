export const API = "https://5002-kode-ws-70665ef40.hebbale.academy";

export async function api(path, options = {}) {

  try {

    const res = await fetch(
      API + path,
      options
    );

    const data = await res
      .json()
      .catch(() => ({}));

    console.log(
      `${options.method || "GET"} ${path}`,
      res.status,
      data
    );

    if (!res.ok) {

      throw new Error(
        data.error ||
        data.message ||
        `Request failed: ${res.status}`
      );

    }

    return data;

  } catch (error) {

    console.error(
      "API Error:",
      error
    );

    throw error;
  }
}

export const jsonOptions = (
  method,
  body
) => ({
  method,

  headers: {
    "Content-Type": "application/json",
  },

  body: JSON.stringify(body),
});