'use strict;';
import { insertAdvice, deleteAdvice } from '../app/advice';
import axios from 'axios';

exports.ADVICE_BASE_ROUTE = '/advice';

const saveToDb = async function (arrOfElems) {
  for (const elem of arrOfElems) {
    if (!elem?.adv) return;
    await insertAdvice({
      advice: elem.adv,
      api_id: elem.id,
    }).catch((e) => console.error(`Error! ${e}`));
  }
};

const deleteFromDb = async function (id) {
  try {
    await deleteAdvice(id);
  } catch (e) {
    console.error(`${e}`);
  }
};

exports.getAdviceAndStore = async function (req, res) {
  try {
    // Extract info from query
    const words =
      typeof req.body.query === 'object' ? req.body.query : [req.body.query];

    // Bulk-Promise
    const promiseFromWords = words.map((elem) =>
      axios.get(`https://api.adviceslip.com/advice/search/${elem}`),
    );

    // Resolve all promises
    const resFromPromises = await Promise.all(promiseFromWords);

    // "Filter" the results
    const resToOutput = resFromPromises.map((elem) => {
      if (!elem.data?.slips?.[0]) return { message: 'No advice for that word' };
      const { advice, id } = elem.data?.slips?.[0];

      return { adv: advice, id: id };
    });

    // If the data is well-composed, must be saved.
    await saveToDb(resToOutput);

    return res.status(200).json(resToOutput);
  } catch (e) {
    return res.status(400).json(`Error! ${e}`);
  }
};

exports.removeAdviceFromStore = async function (req, res) {
  try {
    // Get the data from the structure / param
    const receivedId = req.body.query ?? false;
    // Verrify the data.

    if (receivedId === false)
      return res.status(400).json({ info: `ID not valid` });

    // Query to DB to delete by "ID"
    deleteFromDb(receivedId);

    return res.status(200).json({ info: `Deleted ID: ${receivedId}` });
  } catch (e) {
    console.error(`Error! ${e}`);
  }
};
