/**
 * Server-side proxy to Odoo backend — avoids browser CORS and blocked Cookie header.
 * Browser calls `/api/odoo/...` with `X-Odoo-Session`; this route forwards as `session_id` cookie.
 */
const ODOO_BASE = (
  process.env.ODOO_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://cooperp.freeddns.org:8076"
).replace(/\/$/, "");

function buildTargetUrl(pathSegments, query) {
  const pathname = "/" + pathSegments.join("/");
  const url = new URL(pathname, `${ODOO_BASE}/`);

  Object.entries(query).forEach(([key, value]) => {
    if (key === "path" || value === undefined || value === null) return;
    if (Array.isArray(value)) {
      value.forEach((v) => url.searchParams.append(key, String(v)));
    } else {
      url.searchParams.append(key, String(value));
    }
  });

  return url.toString();
}

function extractSessionId(setCookieHeader) {
  if (!setCookieHeader) return null;
  const joined = Array.isArray(setCookieHeader)
    ? setCookieHeader.join(";")
    : String(setCookieHeader);
  const match = joined.match(/session_id=([^;]+)/);
  return match?.[1] ?? null;
}

export default async function handler(req, res) {
  const pathParam = req.query.path;
  const segments = Array.isArray(pathParam)
    ? pathParam
    : pathParam
      ? [pathParam]
      : [];

  if (!segments.length) {
    return res.status(400).json({ success: 0, message: "missing_path" });
  }

  const targetUrl = buildTargetUrl(segments, req.query);
  const sessionId = req.headers["x-odoo-session"];
  const pathname = "/" + segments.join("/");
  const isImagePath = pathname.startsWith("/web/image/");

  const headers = {
    Accept: isImagePath ? "image/*,*/*;q=0.8" : "application/json",
  };

  if (req.headers["content-type"]) {
    headers["Content-Type"] = req.headers["content-type"];
  } else if (req.method !== "GET" && req.method !== "HEAD") {
    headers["Content-Type"] = "application/json";
  }

  if (sessionId) {
    headers.Cookie = `session_id=${sessionId}`;
  }

  const init = {
    method: req.method,
    headers,
  };

  if (req.method !== "GET" && req.method !== "HEAD" && req.body !== undefined) {
    init.body =
      typeof req.body === "string" ? req.body : JSON.stringify(req.body);
  }

  try {
    const upstream = await fetch(targetUrl, init);
    const contentType =
      upstream.headers.get("content-type") || "application/json; charset=utf-8";
    const isBinary =
      pathname.startsWith("/web/image/") ||
      contentType.startsWith("image/") ||
      contentType.startsWith("application/octet-stream") ||
      contentType.startsWith("application/pdf");

    const newSession = extractSessionId(upstream.headers.get("set-cookie"));
    if (newSession) {
      res.setHeader("X-Odoo-Session", newSession);
    }

    res.setHeader("Content-Type", contentType);
    res.status(upstream.status);

    if (isBinary) {
      const buffer = Buffer.from(await upstream.arrayBuffer());
      res.send(buffer);
    } else {
      const text = await upstream.text();
      if (pathname.includes("api/contacts") && contentType.includes("application/json")) {
        require("fs").writeFileSync("d:/Egrocer/Egrocer/debug_proxy_contacts.json", JSON.stringify({ url: targetUrl, data: JSON.parse(text) }, null, 2));
      }
      res.send(text);
    }
  } catch (error) {
    console.error("[Odoo proxy]", targetUrl, error?.message || error);
    res.status(502).json({
      success: 0,
      message: error?.message || "odoo_proxy_failed",
    });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};
