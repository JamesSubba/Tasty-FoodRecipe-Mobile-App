import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyCev6uoZ88s2wCTlbJzrlH1-RnIj-JlXuw",
    authDomain: "food-recipe-app-57f74.firebaseapp.com",
    projectId: "food-recipe-app-57f74",
    storageBucket: "food-recipe-app-57f74.appspot.com",
    messagingSenderId: "146136070112",
    appId: "1:146136070112:web:526a1618887e273fd41d85"
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


export {auth,db};