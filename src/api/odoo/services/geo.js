import { odooGet } from "../client";
import { fail, odooDataList, ok } from "../utils";

export async function getCountries() {
  try {
    const payload = await odooGet("/api/country");
    const restrictedCountries = [
      "iran", "cuba", "north korea", "sudan", "south sudan", 
      "ukraine", "syria", "russian federation", "russia", "myanmar", "yemen"
    ];

    const countries = odooDataList(payload)
      .map((c) => ({
        id: c.id,
        name: c.name || c.display_name,
        code: c.code,
      }))
      .filter((c) => {
        const countryName = (c.name || "").toLowerCase();
        return !restrictedCountries.some(restricted => countryName.includes(restricted));
      });

    return ok(countries);
  } catch (e) {
    return fail(e?.message);
  }
}

export async function getCountryStates({ countryId } = {}) {
  try {
    const params = countryId
      ? { domain: `[('country_id','=',${countryId})]` }
      : {};
    const payload = await odooGet("/api/country-state", params);
    return ok(
      odooDataList(payload).map((s) => ({
        id: s.id,
        name: s.name || s.display_name,
        country_id: Array.isArray(s.country_id) ? s.country_id[0] : s.country_id,
      }))
    );
  } catch (e) {
    return fail(e?.message);
  }
}
