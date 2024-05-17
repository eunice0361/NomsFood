const firebase = require('firebase');
import firebase from "firebase/app";

const database = firebase.firestore();

vendorsDocSnapshot = await database.collection("vendors").where('active', '==', "True").get()

vendors = vendorsDocSnapshot.docs

