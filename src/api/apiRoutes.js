'use client'
import api from "./axiosMiddleware"
import * as apiEndPoints from "./apiEndpoints"

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