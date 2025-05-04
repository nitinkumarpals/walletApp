import axios from 'axios';

export const getBalance = async () => {
  try {
    const { data } = await axios.get('/api/balance');
    return data;
  } catch (error) {
    console.log(error);
  }
};
