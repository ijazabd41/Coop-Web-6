import { odooGet } from "../client";
import { ODOO_BASE_URL, ODOO_CLIENT_BASE_URL } from "../config";
import { getOdooSession } from "../session";
import { fail, isOdooSuccess, odooDataList, ok } from "../utils";

function mapInvoice(inv) {
  const accessUrl = inv.access_url || "";
  const accessToken = inv.access_token || "";
  let downloadUrl = null;

  if (accessUrl) {
    // Build PDF download URL with access token through the proxy
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

export async function listInvoices({ domain } = {}) {
  try {
    const params = domain ? { domain } : {};
    const payload = await odooGet("/api/invoice/", params);
    if (!isOdooSuccess(payload)) return fail(payload?.message);
    return ok(odooDataList(payload).map(mapInvoice));
  } catch (e) {
    return fail(e?.message);
  }
}

export async function getInvoice(invoiceId) {
  try {
    const payload = await odooGet(`/api/invoice/${invoiceId}`);
    if (!isOdooSuccess(payload)) return fail(payload?.message);
    const inv = odooDataList(payload)[0];
    return ok(inv ? mapInvoice(inv) : null);
  } catch (e) {
    return fail(e?.message);
  }
}

export async function getMyInvoice(invoiceId) {
  try {
    const payload = await odooGet(`/my/invoices/${invoiceId}`);
    return ok(payload);
  } catch (e) {
    return fail(e?.message);
  }
}

/**
 * Create invoice for an order and return download URL.
 * Flow: create_invoice -> list invoices -> find latest -> return PDF URL
 */
export async function downloadInvoice({ orderId, skipCreate }) {
  try {
    if (!skipCreate) {
      try {
        // Step 1: Create invoice for the order
        await odooGet(`/api/order/${orderId}/create_invoice`);
      } catch (e) {
        // Invoice might already exist, continue to find it
      }
    }

    // Step 2: Find the invoice
    const session = getOdooSession();
    const domain = session?.partnerId
      ? `[('partner_id','=',${session.partnerId})]`
      : undefined;
    const list = await listInvoices({ domain });
    if (list.status !== 1 || !list.data?.length) {
      return fail("invoice_not_found");
    }

    // Step 3: Get the latest invoice (highest ID)
    const latest = list.data.sort((a, b) => b.id - a.id)[0];

    // Step 4: If we don't have a download URL from the list, build one using /my/invoices/
    if (!latest.download_url && latest.id) {
      // Try to get the invoice detail which may include access_token
      const detail = await getInvoice(latest.id);
      if (detail.status === 1 && detail.data?.download_url) {
        return ok({
          invoice_id: latest.id,
          url: detail.data.download_url,
          name: detail.data.name,
        });
      }
      // Fallback: use /my/invoices/ endpoint through the proxy
      return ok({
        invoice_id: latest.id,
        url: `${ODOO_CLIENT_BASE_URL}/my/invoices/${latest.id}?report_type=pdf&download=true`,
        name: latest.name,
      });
    }

    return ok({
      invoice_id: latest.id,
      url: latest.download_url,
      name: latest.name,
    });
  } catch (e) {
    return fail(e?.message);
  }
}
