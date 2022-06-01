import { Router } from 'express';

// @ts-ignore
import twApi from '../apiAxios/apiAxios.ts';
// @ts-ignore
import { Auth } from '../apiAxios/apiAxios.ts';
import axios from 'axios';
// @ts-ignore
// @ts-ignore
import { io } from '../http.ts';

export const router = Router();

router.post('/api/monitor', async (req, res) => {
  const { monitoring, hashtag } = req.body;
  //state.monitoring = monitoring;
  const resetMilliseconds = new Date().setMilliseconds(0);
  const resetSeconds = new Date(resetMilliseconds).setSeconds(0);
  const dateString = new Date(resetSeconds).toISOString();

  console.log(`Monitorando Hashtag #${hashtag} - ${dateString}`);

  const { data } = await twApi.get(
    `/2/tweets/search/recent?start_time=${dateString}&expansions=author_id&user.fields=name,profile_image_url,username,verified&query=%23${hashtag}`
  );
  console.log(data.meta.result_count);

  if (data && data.data && data.data.length > 0) {
    const tweets = data.data;
    const usets = (data.includes && data.includes.users) || [];

    const response = tweets.map((x: any) => {
      const { name, username, profile_image_url, verified } = usets.find((i: any) => i.id === x.author_id) || {};
      return { id: x.id, text: x.text, name, username, profile_image_url, verified };
    });
    await axios.post(`http://localhost:3000/api/monitor/tweets/receive`, { tweets: response });
  }
});
router.post('/api/monitor/tweets/receive', async (req, res) => {
  console.log('Recebendo Tweets');

  try {
    const { tweets } = req.body;
    let state: any = {
      hashtag: '',
      monitoring: true,
      received: [],
      approved: [],
      rejected: [],
    };

    if (state.monitoring) {
      const receivedIds = state.received.map((r: any) => r.id);
      const approvedIds = state.approved.map((r: any) => r.id);
      const rejectedIds = state.rejected.map((r: any) => r.id);
      const newTweets = tweets.filter((x: any) => !receivedIds.includes(x.id) && !approvedIds.includes(x.id) && !rejectedIds.includes(x.id));

      if (newTweets.length > 0) {
        console.log('Tweets: ', newTweets.length);
        state.received = [...state.received, ...newTweets];
        await io.emit('received_request', state.received);
      }
    }

    return res.status(200).json({ success: true, errors: [] });
  } catch (err) {
    //return res.status(500).json({ success: true, errors: [err] });
  }
});
router.post('/api/monitor/tweets/approve', async (req, res) => {
  try {
    let state: any = {
      hashtag: '',
      monitoring: true,
      received: [],
      approved: [],
      rejected: [],
    };

    const twittes = [...state.received, ...state.rejected];
    const twitterApproved = twittes.find((x) => x.id === req.body.id);

    if (twitterApproved) {
      state.approved = [...state.approved, twitterApproved];
      state.rejected = state.rejected.filter((x: any) => x.id !== req.body.id);
      state.received = state.received.filter((x: any) => x.id !== req.body.id);
      await io.emit('reject_request', state.rejected);
      await io.emit('approved_request', state.approved);
      await io.emit('received_request', state.received);

      return res.status(200).json({ success: true, errors: [] });
    }

    return res.status(404).json({ success: true, errors: ['Tweet not found'] });
  } catch (err) {
    return res.status(500).json({ success: true, errors: [err] });
  }
});
router.post('/api/monitor/tweets/reject', async (req, res) => {
  try {
    let state: any = {
      hashtag: '',
      monitoring: true,
      received: [],
      approved: [],
      rejected: [],
    };

    const twittes = [...state.approved, ...state.received];
    const twitterRejected = twittes.find((x) => x.id === req.body.id);

    if (twitterRejected) {
      state.rejected = [...state.rejected, twitterRejected];
      state.approved = state.approved.filter((x: any) => x.id !== req.body.id);
      state.received = state.received.filter((x: any) => x.id !== req.body.id);
      await io.emit('reject_request', state.rejected);
      await io.emit('approved_request', state.approved);
      await io.emit('received_request', state.received);

      return res.status(200).json({ success: true, errors: [] });
    }

    return res.status(404).json({ success: true, errors: ['Tweet not found'] });
  } catch (err) {
    return res.status(500).json({ success: true, errors: [err] });
  }
});
