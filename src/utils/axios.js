import axios from "axios";

const Axios = axios.create({
  baseURL: `${window.location.origin}`,
});

export default Axios;
