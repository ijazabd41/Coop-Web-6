import { odooGet, odooGetQuiet } from "../client";
import { ODOO_CLIENT_BASE_URL } from "../config";
import { getOdooSession } from "../session";
import { fail, isOdooSuccess, odooDataList, ok } from "../utils";

function mapInvoice(inv) {
  const accessUrl = inv.access_url || "";
  const accessToken = inv.access_token || "";
  let downloadUrl = null;

  if (accessUrl) {
    const baseUrl = `${ODOO_CLIENT_BASE_URL}${accessUrl}`;
    downloadUrl = accessToken
      ? `${baseUrl}?access_token=${accessToken}&report_type=pdf&download=true`
      : `${baseUrl}?report_type=pdf&download=true`;
  }

  return {
    id: inv.id,
    name: inv.name || inv.display_name,
    amount_total: inv.amount_total,
    state: Array.isArray(inv.state) ? inv.state[0] : inv.state,
    date: inv.invoice_date || inv.date,
    partner_name: Array.isArray(inv.partner_id)
      ? inv.partner_id[1]
      : inv.partner_id?.name,
    download_url: downloadUrl,
    access_url: accessUrl,
    access_token: accessToken,
  };
}

function invoiceIdsFromOrder(order) {
  const raw = order?.invoice_ids;
  if (!Array.isArray(raw) || !raw.length) return [];
  return raw
    .map((row) => (Array.isArray(row) ? row[0] : row?.id ?? row))
    .filter((id) => Number(id) > 0);
}

export async function listInvoices({ domain } = {}) {
  try {
    const params = domain ? { domain } : {};
    const payload = await odooGetQuiet("/api/invoice/", params);
    if (!isOdooSuccess(payload)) return fail(payload?.message || "invoice_list_failed");
    return ok(odooDataList(payload).map(mapInvoice));
  } catch (e) {
    return fail(e?.message);
  }
}

export async function getInvoice(invoiceId) {
  try {
    const payload = await odooGetQuiet(`/api/invoice/${invoiceId}`);
    if (!isOdooSuccess(payload)) return fail(payload?.message);
    const inv = odooDataList(payload)[0];
    return ok(inv ? mapInvoice(inv) : null);
  } catch (e) {
    return fail(e?.message);
  }
}

export async function getMyInvoice(invoiceId) {
  try {
    const payload = await odooGetQuiet(`/my/invoices/${invoiceId}`);
    return ok(payload);
  } catch (e) {
    return fail(e?.message);
  }
}

/**
 * Create invoice for an order and return download URL.
 * Invoice creation often fails for portal users — we still try to find an existing invoice.
 */
export async function downloadInvoice({ orderId, skipCreate }) {
  try {
    if (!skipCreate) {
      await odooGetQuiet(`/api/order/${orderId}/create_invoice`);
    }

    const orderPayload = await odooGetQuiet(`/api/order/${orderId}`);
    const order = isOdooSuccess(orderPayload)
      ? odooDataList(orderPayload)[0]
      : null;
    const linkedIds = invoiceIdsFromOrder(order);

    for (const invoiceId of linkedIds) {
      const detail = await getInvoice(invoiceId);
      if (detail.status === 1 && detail.data) {
        const url =
          detail.data.download_url ||
          `${ODOO_CLIENT_BASE_URL}/my/invoices/${invoiceId}?report_type=pdf&download=true`;
        return ok({
          invoice_id: invoiceId,
          url,
          name: detail.data.name,
        });
      }
    }

    const session = getOdooSession();
    const orderName = order?.name ? String(order.name).replace(/'/g, "\\'") : null;
    const domains = [];
    if (orderName) {
      domains.push(`[('invoice_origin','=','${orderName}')]`);
    }

    for (const domain of domains) {
      const list = await listInvoices({ domain });
      if (list.status === 1 && list.data?.length) {
        const latest = [...list.data].sort((a, b) => b.id - a.id)[0];
        if (latest.download_url) {
          return ok({
            invoice_id: latest.id,
            url: latest.download_url,
            name: latest.name,
          });
        }
        const detail = await getInvoice(latest.id);
        if (detail.status === 1 && detail.data) {
          return ok({
            invoice_id: latest.id,
            url:
              detail.data.download_url ||
              `${ODOO_CLIENT_BASE_URL}/my/invoices/${latest.id}?report_type=pdf&download=true`,
            name: detail.data.name,
          });
        }
      }
    }

    return fail("invoice_not_found");
  } catch (e) {
    return fail(e?.message || "invoice_not_found");
  }
}
