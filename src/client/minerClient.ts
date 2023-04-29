import axios from "axios";

const BLOCKCHAIN_SERVER = "http://localhost:4000";

async function mine() {
  const { data } = await axios.get(`${BLOCKCHAIN_SERVER}/blocks/next`);

  console.log(data);
}

mine();
