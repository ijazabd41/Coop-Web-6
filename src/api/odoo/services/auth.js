import { ODOO_DB } from "../config";
import { odooAuthenticate, odooGet, odooGetQuiet } from "../client";
import {
  getOdooSession,
  clearOdooSession,
  setOdooSession,
  setDraftOrderId,
} from "../session";
import { store } from "@/redux/store";
import { mapPartnerToUser } from "../mappers";
import { fail, ok, isOdooSuccess, odooDataList } from "../utils";

/** Mark partner as a storefront customer so they appear in admin customer list. */
async function ensureWebsiteCustomer(partnerId) {
  if (!partnerId) return;
  try {
    await odooGetQuiet(`/api/contacts/${partnerId}/update`, {
      customer_rank: 1,
    });
  } catch {
    /* Odoo may ignore unknown fields; registration still succeeds */
  }
}

export async function login({ id, password, type, country_code }) {
  try {
    let loginId = id;
    if (type === "phone" && country_code && id && !String(id).startsWith("+")) {
      loginId = `${country_code}${id}`.replace(/\++/g, "");
    }

    const prevPartnerId = getOdooSession()?.partnerId;

    const auth = await odooAuthenticate({
      login: loginId,
      password,
      db: ODOO_DB,
    });

    if (!auth.ok) {
      const msg = String(auth.error || "").toLowerCase();
      if (msg.includes("invalid") || auth.error === "invalid_credentials") {
        return fail("invalid_password");
      }
      if (msg.includes("exist") || msg.includes("duplicate")) {
        return fail("user_exist_with_email");
      }
      return fail("user_not_exist");
    }

    const session = getOdooSession();
    if (
      prevPartnerId &&
      session?.partnerId &&
      prevPartnerId !== session.partnerId
    ) {
      setDraftOrderId(null);
    }
    await ensureWebsiteCustomer(session.partnerId);
    const partnerPayload = await odooGet(`/api/contacts/${session.partnerId}`);
    const partner = odooDataList(partnerPayload)[0] || {
      id: session.partnerId,
      name: auth.result.name,
      email: auth.result.username,
    };

    const user = mapPartnerToUser(partner, {
      uid: auth.result.uid,
      username: auth.result.username,
    });

    // Match reference behavior: update contact with device and geo info
    const devId = typeof window !== "undefined" && window.navigator ? 
      ('web-' + (window.navigator.platform || 'browser').replace(/[^a-zA-Z0-9]/g, '').substring(0, 20)) : 
      'web';
      
    odooGetQuiet(`/api/contacts/${session.partnerId}/update`, {
      name: auth.result.name || '',
      email: auth.result.username?.includes('@') ? auth.result.username : '',
      phone: auth.result.username?.includes('@') ? '' : auth.result.username,
      deviceid: devId,
      firebase: '',
      latitude: process.env.NEXT_PUBLIC_DEFAULT_LATITUDE || '25.2048',
      longitude: process.env.NEXT_PUBLIC_DEFAULT_LONGITUDE || '55.2708'
    }).catch(() => {});

    return ok(
      {
        access_token: auth.sessionId,
        user,
      },
      { message: "" }
    );
  } catch (e) {
    console.error("[Odoo] login", e);
    return fail(e?.message || "login_failed");
  }
}

export async function register({
  name,
  email,
  mobile,
  password,
  fcm,
  type,
  country_code,
}) {
  try {
    const params = {
      name,
      deviceid: "web",
      firebase: fcm || "",
      latitude: process.env.NEXT_PUBLIC_DEFAULT_LATITUDE || "25.2048",
      longitude: process.env.NEXT_PUBLIC_DEFAULT_LONGITUDE || "55.2708",
      password,
    };
    if (email) params.email = email;
    if (mobile) {
      params.phone =
        type === "phone" && country_code
          ? `${country_code}${mobile}`.replace(/\++/g, "")
          : mobile;
    }

    const payload = await odooGet("/api/contacts/new_registration", params);
    if (!isOdooSuccess(payload)) {
      const msg = String(payload?.message || "registration_failed").toLowerCase();
      if (msg.includes("exist") || msg.includes("duplicate")) {
        return fail("user_exist_with_email");
      }
      return fail(payload?.message || "registration_failed");
    }

    return ok(null, { message: "succesfull_register_message" });
  } catch (e) {
    console.error("[Odoo] register", e);

    if (e?.response?.status === 422) {
      const respData = String(e.response.data || "").toLowerCase();
      if (respData.includes("two users with the same login") || respData.includes("duplicate") || respData.includes("exist")) {
        return fail("user_exist_with_email");
      }
    }

    return fail(e?.message || "registration_failed");
  }
}

export async function getUser() {
  const session = getOdooSession();
  if (!session?.sessionId) {
    return { user: null };
  }

  let partnerId = session.partnerId;
  if (!partnerId) {
    const reduxUser = store.getState()?.User?.user;
    partnerId = Number(reduxUser?.partner_id || reduxUser?.id) || null;
    if (partnerId) {
      setOdooSession({ partnerId, uid: session.uid || reduxUser?.uid });
    }
  }

  if (!partnerId) {
    return { user: null };
  }
  try {
    const payload = await odooGet(`/api/contacts/${partnerId}`);
    const partner = odooDataList(payload)[0];
    if (!partner) return { user: null };
    return {
      user: mapPartnerToUser(partner, { uid: session.uid }),
    };
  } catch (e) {
    console.error("[Odoo] getUser", e);
    return { user: null };
  }
}

export async function logout() {
  clearOdooSession();
  return ok(null);
}

export async function updateProfile({ name, email, mobileNumber, country_code }) {
  const session = getOdooSession();
  if (!session?.partnerId) return fail("not_authenticated");
  try {
    const cc = country_code ? String(country_code).replace(/\++/g, "") : "";
    let phone = mobileNumber;
    if (cc && phone && !String(phone).startsWith(cc)) {
      phone = `${cc}${phone}`;
    }
    const params = { name, email, phone };
    const payload = await odooGet(
      `/api/contacts/${session.partnerId}/update`,
      params
    );
    if (!isOdooSuccess(payload)) return fail(payload?.message || "update_failed");
    return ok(null, { message: "profile_updated" });
  } catch (e) {
    return fail(e?.message);
  }
}

export async function resetPassword({ password, newPassword }) {
  const session = getOdooSession();
  if (!session?.uid) return fail("not_authenticated");
  try {
    const payload = await odooGet(`/api/user/${session.uid}/update`, {
      password: newPassword || password,
    });
    if (!isOdooSuccess(payload)) return fail(payload?.message || "reset_failed");
    return ok(null);
  } catch (e) {
    return fail(e?.message);
  }
}

/** OTP flows are not exposed on Odoo — use email/password login instead. */
export async function sendSms() {
  return fail("otp_not_supported");
}

export async function verifyOTP() {
  return fail("otp_not_supported");
}

export async function verifyEmail() {
  return ok(null);
}

export async function forgotPasswordOTP() {
  return fail("use_odoo_portal_reset");
}

export async function forgotPassword() {
  return fail("use_odoo_portal_reset");
}

export async function deleteAccount() {
  return fail("contact_support");
}

export async function verifyUserByPhoneNum() {
  return ok({ exists: false });
}
