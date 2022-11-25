'use strict;';
import { insertAdvice } from '../app/advice';
import axios from 'axios';

exports.ADVICE_BASE_ROUTE = '/advice';

const saveToDb = function (id, advice) {
  insertAdvice({
    api_id: id,
    advice: advice,
  });
};

exports.getAdviceAndStore = function (req, res) {
  const word = req.body.query ?? '';

  axios
    .get(`https://api.adviceslip.com/advice/search/${word}`)
    .then((apiResponse) => {
      if (!apiResponse.data?.slips?.[0])
        return res.status(404).json({ advice: 'No Advice!' });

      const { advice, id } = apiResponse.data?.slips?.[0];

      saveToDb(id, advice);

      res.status(200).json({ advice: `${advice}` });
    })
    .catch((e) => {
      return res.status(400).json({ message: `${e}` });
    });
};
