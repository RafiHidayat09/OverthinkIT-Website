import { API } from '../_api';

const MIDTRANS_CLIENT_KEY = 'Mid-client-YBAqCnPwE2TFi81Y';

export const getBalance = async () => {
  try {
    const { data } = await API.get('/wallet/balance');
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const topUp = async (amount) => {
  try {
    const { data } = await API.post('/wallet/topup', { amount });
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// export const getHistory = async () => {
//   try {
//     const { data } = await API.get('/wallet/history');
//     return data;
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// }

// Midtrans Snap integration
export const loadMidtransSnap = () => {
  return new Promise((resolve, reject) => {
    if (window.snap) {
      resolve(window.snap);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', MIDTRANS_CLIENT_KEY);
    script.onload = () => resolve(window.snap);
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

export const openMidtransPopup = (snapToken) => {
  window.snap.pay(snapToken, {
    onSuccess: function(result) {
      console.log('Payment success:', result);
      window.location.href = '/payment-success';
    },
    onPending: function(result) {
      console.log('Payment pending:', result);
      window.location.href = '/payment-pending';
    },
    onError: function(result) {
      console.log('Payment error:', result);
      window.location.href = '/payment-error';
    },
    onClose: function() {
      console.log('Payment popup closed');
    }
  });
};