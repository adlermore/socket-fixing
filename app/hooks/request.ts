import Cookies from 'js-cookie';

interface RequestConfig {
  method: string;
  headers: {
    "Content-type": string;
    Authorization?: string;
  };
  body?: string;
}

interface RequestBody {
  [key: string]: any;
}

async function request(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: RequestBody,
  auth: boolean = false
): Promise<any> {
  let config: RequestConfig = {
    method,
    headers: {
      "Content-type": "application/json",
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  if (auth) {
    config.headers.Authorization = `Bearer ${Cookies.get("token")}`;
  }

  try {
    const response = await fetch(url, config);
    const result = await response.json();
    if (result.error) {
      throw result.error;
    }
    return result;
  } catch (err) {
    throw new Error(String(err));
  }
}

export default request;
