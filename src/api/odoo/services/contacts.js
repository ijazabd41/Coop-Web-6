import { odooGet } from "../client";
import { mapPartnerToAddress } from "../mappers";
import { getOdooSession } from "../session";
import { fail, isOdooSuccess, odooDataList, ok } from "../utils";

function mapContactAddress(partner, index = 0) {
  const type = Array.isArray(partner.type)
    ? partner.type[0]
    : partner.type || "delivery";
  return {
    ...mapPartnerToAddress(partner, index),
    contact_type: type,
  };
}

/**
 * List contacts (delivery / invoice child addresses) with pagination.
 */
export async function listContacts({
  type,
  contactId,
  limit = 20,
  offset = 0,
} = {}) {
  const session = getOdooSession();
  if (!session?.partnerId) return fail("not_authenticated");
  try {
    const params = {
      limit,
      offset,
    };
    if (contactId) {
      const payload = await odooGet(`/api/contacts/${contactId}`, params);
      if (!isOdooSuccess(payload)) return fail(payload?.message);
      const row = odooDataList(payload)[0];
      return ok(row ? [mapContactAddress(row)] : []);
    }
    let domain = `[('parent_id','=',${session.partnerId})]`;
    if (type === "delivery" || type === "invoice") {
      domain = `[('parent_id','=',${session.partnerId}),('type','=','${type}')]`;
    } else {
      domain = `[('parent_id','=',${session.partnerId}),('type','in',['delivery','invoice','other','contact'])]`;
    }
    params.domain = domain;
    const payload = await odooGet("/api/contacts", params);
    if (!isOdooSuccess(payload)) return fail(payload?.message);
    return ok(
      odooDataList(payload).map((child, idx) => mapContactAddress(child, idx))
    );
  } catch (e) {
    return fail(e?.message);
  }
}

/**
 * Get delivery + invoice addresses for checkout.
 */
export async function getAddress() {
  const session = getOdooSession();
  if (!session?.partnerId) return fail("not_authenticated");
  try {
    const [deliveryRes, invoiceRes] = await Promise.all([
      listContacts({ type: "delivery", limit: 50 }),
      listContacts({ type: "invoice", limit: 50 }),
    ]);

    const addresses = [];
    if (deliveryRes.status === 1) {
      addresses.push(...deliveryRes.data);
    }
    if (invoiceRes.status === 1) {
      for (const inv of invoiceRes.data) {
        if (!addresses.some((a) => a.id === inv.id)) {
          addresses.push(inv);
        }
      }
    }

    if (!addresses.length) {
      const mainPayload = await odooGet(`/api/contacts/${session.partnerId}`);
      const mainPartner = odooDataList(mainPayload)[0];
      if (mainPartner) {
        addresses.push(mapContactAddress(mainPartner, 0));
      }
    }

    return ok(addresses);
  } catch (e) {
    console.error("[Odoo] getAddress", e);
    return fail(e?.message);
  }
}

/**
 * Add delivery or invoice contact via Odoo new_address API.
 */
export async function addAddress({
  name,
  mobile,
  address,
  city,
  state,
  country,
  country_id,
  state_id,
  latitiude,
  longitude,
  pincode,
  contact_type = "delivery",
}) {
  const session = getOdooSession();
  if (!session?.partnerId) return fail("not_authenticated");
  const type =
    contact_type === "invoice" ? "invoice" : "delivery";
  try {
    const payload = await odooGet("/api/contacts/new_address", {
      lang: "en_US",
      tz: "Asia/Dubai",
      tz_offset: "+0400",
      parent_id: session.partnerId,
      name: name || (type === "invoice" ? "Invoice Address" : "Delivery Address"),
      phone: mobile || "",
      street: address || "",
      street2: "",
      city: city || "",
      zip: pincode || "",
      state_id: state_id || "",
      country_id: country_id || 2,
      type,
      email: "",
    });

    let newId =
      payload?.data?.rec_id ||
      payload?.response?.id ||
      odooDataList(payload)[0]?.id;

    if (!newId || !isOdooSuccess(payload)) {
      return fail(payload?.message || "address_create_failed");
    }

    if (latitiude || longitude) {
      await odooGet(`/api/contacts/${newId}/update`, {
        partner_latitude: latitiude || "",
        partner_longitude: longitude || "",
        parent_id: session.partnerId,
        type,
      });
    }

    return ok({ id: newId, contact_type: type }, { message: "address_saved" });
  } catch (e) {
    return fail(e?.message);
  }
}

export async function getContactById(contactId) {
  try {
    const payload = await odooGet(`/api/contacts/${contactId}`);
    if (!isOdooSuccess(payload)) return fail(payload?.message);
    const row = odooDataList(payload)[0];
    if (!row) return fail("contact_not_found");
    return ok(mapContactAddress(row));
  } catch (e) {
    return fail(e?.message);
  }
}

export async function updateAddress({
  id,
  name,
  mobile,
  address,
  city,
  pincode,
  latitiude,
  longitude,
  contact_type,
  state_id,
  country_id,
}) {
  try {
    const contactId = id || getOdooSession()?.partnerId;
    if (!contactId) return fail("not_authenticated");
    const session = getOdooSession();
    const params = {
      name,
      phone: mobile,
      street: address,
      city,
      zip: pincode,
      partner_latitude: latitiude,
      partner_longitude: longitude,
      parent_id: session?.partnerId,
      lang: "en_US",
      tz: "Asia/Dubai",
      tz_offset: "+0400",
    };
    if (contact_type) params.type = contact_type;
    if (state_id) params.state_id = state_id;
    if (country_id) params.country_id = country_id;

    const payload = await odooGet(`/api/contacts/${contactId}/update`, params);
    if (!isOdooSuccess(payload)) return fail(payload?.message);
    return ok(null, { message: "address_updated" });
  } catch (e) {
    return fail(e?.message);
  }
}

export async function deleteAddress({ id }) {
  const session = getOdooSession();
  if (!session?.partnerId) return fail("not_authenticated");
  if (!id || id === session.partnerId) {
    return fail("cannot_delete_primary_address");
  }
  try {
    const payload = await odooGet(`/api/contacts/${id}/update`, {
      active: 0,
      parent_id: session.partnerId,
    });
    if (!isOdooSuccess(payload)) return fail(payload?.message || "delete_failed");
    return ok(null, { message: "address_deleted" });
  } catch (e) {
    return fail(e?.message);
  }
}

/** Resolve shipping + invoice contact ids for order update. */
export function resolveOrderPartnerIds({
  shippingAddressId,
  invoiceAddressId,
  partnerId,
}) {
  const pid = partnerId;
  const shippingId = shippingAddressId || pid;
  let invoiceId = invoiceAddressId || pid;
  if (!invoiceAddressId && shippingAddressId) {
    invoiceId = pid;
  }
  return {
    partner_shipping_id: shippingId,
    partner_invoice_id: invoiceId,
    partner_id: pid,
  };
}
