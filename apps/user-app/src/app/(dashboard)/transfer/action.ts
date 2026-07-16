import axios from 'axios';

export const getBalance = async () => {
  try {
    const { data } = await axios.get('http://localhost:3001/balance', {
      withCredentials: true
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
