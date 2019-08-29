import axios from 'axios';
import { writeFileSync } from 'fs';
require('dotenv').config();

async function fetch() {
  const result = await axios.get(
    'https://sandbox.estated.com/property/v3?token=RLCystnEGPybBbON1Um84lt8Hg7iLl&conjoined_address=3832+Jason+St,Denver,CO+80211',
  );

  writeFileSync(`./json/${Date.now()}.json`, JSON.stringify(result.data));
}

fetch();
