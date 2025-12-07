import { API } from "../_api";

// GET LIST PSIKIATER (PUBLIC)
export const getAllPsikiater = async () => {
  try {
    const { data } = await API.get("/psikiater");
    return data; 
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// GET DETAIL PSIKIATER (PUBLIC)
export const showPsikiater = async (id) => {
  try {
    const { data } = await API.get(`/psikiater/${id}`);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
