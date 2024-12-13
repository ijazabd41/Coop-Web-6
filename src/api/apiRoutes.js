'use client'
import api from "./axiosMiddleware"
import * as apiEndPoints from "./apiEndpoints"


export const registerUser = async ({ name, email, mobile, type, fcm, country_code, password }) => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email)
    formData.append("country_code", country_code)
    formData.append("mobile", mobile)
    formData.append("type", type)
    formData.append("fcm_token", fcm);
    formData.append("platform", "web");
    if (type == "email") {
        formData.append("password", password);
    }
    const response = await api.post(apiEndPoints.register, formData)
    return response.data
}
export const login = async ({ id, fcm, type, password }) => {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("fcm_token", fcm);
    formData.append("type", type);
    formData.append("platform", "web");
    if (type == "email") {
        formData.append("password", password);
    }
    const response = await api.post(apiEndPoints.login, formData)
    return response.data
}
export const getUser = async () => {
    const response = await api.get(apiEndPoints.getUser)
    return response.data
}
export const getCity = async ({ latitude, longitude }) => {
    let params = { latitude: latitude, longitude: longitude };
    const response = await api.get(apiEndPoints.getCity, { params })
    return response.data;
}
export const getShop = async ({ latitude, longitude }) => {
    let params = { latitude: latitude, longitude: longitude };
    const response = await api.get(apiEndPoints.getShop, { params })
    return response.data
}

export const getCategories = async () => {
    const response = await api.get(apiEndPoints.getCategory)
    return response.data;
}

export const getProductByFilter = async ({ latitude, longitude, filters = undefined, tag_names = "", slug = "" }) => {
    const formData = new FormData();
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    if (tag_names !== "") {
        formData.append("tag_names", tag_names)
    }
    if (slug !== "") {
        formData.append("slug", slug)
    }
    if (filters !== undefined) {
        for (const filter in filters) {
            if ((filters[filter] !== null && filters[filter] !== undefined && filters[filter] !== "") || filters[filter]?.length > 0) {
                formData.append(filter, filters[filter]);
            }
            if (filters[filter] === "sizes") {
                formData.append(filter, filters[filter]);
            }
        }
    }
    const response = await api.post(apiEndPoints.getProducts, formData)
    return response.data
}

export const getBrands = async ({ limit, offset }) => {
    let params = {
        limit: limit,
        offset: offset
    };
    const response = await api.get(apiEndPoints.getBrands, { params })
    return response.data
}

export const getSetting = async () => {
    const params = {
        is_web_setting: 1
    }
    const response = await api.get(apiEndPoints.getSettings, { params })
    return response.data
}

export const getProductById = async ({ latitude, longitude, slug, id }) => {
    const formData = new FormData();
    formData.append("latitude", latitude)
    formData.append("longitude", longitude)
    if (id !== -1) {
        formData.append("id", id);
    }
    if (slug) { formData.append("slug", slug) }
    const response = await api.post(apiEndPoints.getProductById, formData)
    return response.data
}

export const getProductRatings = async ({ id, limit, offset }) => {
    const params = {
        product_id: id,
        limit: limit,
        offset: offset
    }
    const response = await api.get(`${apiEndPoints.getProducts}/${apiEndPoints.getProductRatings}`, { params });

    return response.data;
}