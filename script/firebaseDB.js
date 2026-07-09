// firebaseDB 연결
import { state } from "./state.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";
        
const firebaseConfig = {
  apiKey: "AIzaSyDDWLYt6Yra-eMq-WIHY0lqEjrPtolRZ6A",
  authDomain: "english-wordbank-test.firebaseapp.com",
  projectId: "english-wordbank-test",
  storageBucket: "english-wordbank-test.firebasestorage.app",
  messagingSenderId: "803607814968",
  appId: "1:803607814968:web:32160e2cb40e8f2cb697cd"
};

const app = initializeApp(firebaseConfig);

export const firestoreDB = getFirestore(app);