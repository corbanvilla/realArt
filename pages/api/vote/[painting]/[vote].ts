// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";

import { getFirestore, collection, doc, getDoc, getDocs, Firestore, DocumentData, FieldValue, updateDoc, increment, DocumentReference } from "firebase/firestore/lite";

const firebaseConfig = {
  apiKey: "AIzaSyBlOka8nYzmYlQ4PPlYYJ59_N4rJAkDXgE",
  authDomain: "realart-20aab.firebaseapp.com",
  projectId: "realart-20aab",
  storageBucket: "realart-20aab.appspot.com",
  messagingSenderId: "404959848134",
  appId: "1:404959848134:web:82881ce2d1da87a782d9c7",
  measurementId: "G-NZD45QBWQL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);

interface PaintingVote extends NextApiRequest {
  painting: string;
  vote: number;
}

export default function handler(
  req: PaintingVote,
  res: NextApiResponse,
) {
  // get the painting id from the request
  const { painting, vote } = req.query;
  // Type safety 
  if (painting === undefined)
    return res.status(400).json({ error: "No painting id provided" });

  if (vote === undefined)
    return res.status(400).json({ error: "No vote provided" });

  if (Array.isArray(painting))
    return res.status(400).json({ error: "Multiple painting ids provided" });

  if (Array.isArray(vote))
    return res.status(400).json({ error: "Multiple votes provided" });

  // get the painting document reference
  const paintingRef = doc(db, "paintings", painting);

  // Call update
  updateDoc(paintingRef, vote, increment(1));

  return res.status(200).end();
}
