// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getFirestore, initializeFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBfFLNJlU3haJIBszdwbgwz3t5ZrJ-K5cA',
  authDomain: 'tac-fea47.firebaseapp.com',
  projectId: 'tac-fea47',
  storageBucket: 'tac-fea47.firebasestorage.app',
  messagingSenderId: '433413678709',
  appId: '1:433413678709:web:bdea6c277884409aaafa3c',
  measurementId: 'G-N9G1K0SJES',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const db = getFirestore(app);
// ✅ Use initializeFirestore to set settings like experimentalForceLongPolling
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false, // optionally disable fetch streams for RN
});

export {db};
