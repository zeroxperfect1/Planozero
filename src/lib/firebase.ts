import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Firebase solo se usa para Auth (Google Sign-in)
// La base de datos ahora es MySQL via PHP API
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
