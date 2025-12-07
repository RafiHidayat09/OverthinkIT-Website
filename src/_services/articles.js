import { API } from "../_api";

// GET ALL
export const getArticles = async () => {
  try {
    const { data } = await API.get("/articles");
    return data.data; 
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// CREATE
export const createArticle = async (data) => {
  try {
    const response = await API.post("/articles", data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// SHOW (DETAIL)
export const showArticle = async (id) => {
  try {
    const { data } = await API.get(`/articles/${id}`);
    return data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// UPDATE
export const updateArticle = async (id, data) => {
  try {
    // Laravel API pakai POST untuk update (mirip books)
    const response = await API.post(`/articles/${id}`, data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// DELETE
export const deleteArticle = async (id) => {
  try {
    await API.delete(`/articles/${id}`);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
