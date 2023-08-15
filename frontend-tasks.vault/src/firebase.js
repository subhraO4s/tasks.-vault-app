import firebase from '../../../node_modules/firebase/compat/app';
import "../../../node_modules/firebase/compat/auth";

const firebaseConfig = {
    apiKey: '<your-api-key>',
    authDomain: '<your-auth-domain>',
    projectId: '<your-project-id>',
    storageBucket: '<your-storage-bucket>',
    messagingSenderId: '<your-messaging-sender-id>',
    appId: '<your-app-id>',
  };
  
  firebase.initializeApp(firebaseConfig);
  
  export default firebase;