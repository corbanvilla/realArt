import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getFirestore, collection, getDocs, Firestore, DocumentData } from "firebase/firestore/lite";
import { InferGetStaticPropsType } from "next";
import { useState } from "react";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Get a list of cities from your database
interface Painting extends DocumentData {
  image1: string;
  image2: string;
  realArt: string;
  title: string;
  votes: number;
}

async function getPaintings(db: Firestore) {
  const paintingsCol = collection(db, "paintings");
  const paintingsSnapshot = await getDocs(paintingsCol);
  const paintingsList = paintingsSnapshot.docs.map((doc) => doc.data()) as Painting[];
  return paintingsList;
}

// async function incrementVote(db: Firestore, painting: Painting) {
//   const 
// }

export default function Home({ painting }: InferGetStaticPropsType<typeof getServerSideProps>) {

    const [overlayHidden, setOverlayHidden] = useState(true);
    const [overlayLeft, setOverlayLeft] = useState(0);
    const [overlayRight, setOverlayRight] = useState(0);

    const enableOverlayLeft = () => {
        setOverlayHidden(false);
        setOverlayLeft(1);
    }

    const enableOverlayRight = () => {
        setOverlayHidden(false);
        setOverlayRight(1);
    }

    const resetOverlay = () => {
        setOverlayHidden(true);
        setOverlayRight(0);
        setOverlayLeft(0);
    }

    return (
        <div className="container w-full min-w-full min-h-full">
        {/* Main Grid */}

            <div className="flex flex-row min-h-[20vh] items-center place-content-center z-10">
                <div>
                
                <p className="text-4xl text-center">Real Art</p>
                <p className="text-1xl text-center">
                    One of these is an actual artwork in the Louvre and one of these was
                    done by Dall-E.
                    <br /> Select the one which you think was done by a real person.
                </p>
                </div> 
            </div>


            <div className="flex flex-row min-h-[70vh] items-center place-content-center gap-x-16">
                <div className="hover:border-4 border-gray-100">
                <div onClick={enableOverlayLeft} style={{ zIndex: overlayLeft }} className="cursor-pointer relative box-border bg-black h-96 w-96 min-h-[380px] min-w-[380px] border-8 border-gray-200">
                    <Image
                    fill
                    alt="yogurt"
                    src={painting.image1}
                    />
                </div>
                </div>
                <div className="hover:border-4 border-gray-100">
                <div onClick={enableOverlayRight} style={{ zIndex: overlayRight }} className="cursor-pointer relative box-border bg-black h-96 w-96 min-h-[380px] min-w-[380px] border-8 border-gray-200 z-50">
                    <Image
                        fill
                        alt="yogurt"
                        src={painting.image2}
                    />
                </div>
                </div>
            </div>
            <div onClick={resetOverlay} hidden={overlayHidden} className="p-20 fixed top-0 left-0 bottom-0 right-0 w-full h-screen bg-black bg-opacity-75"></div>
        </div>
    );
}

export async function getServerSideProps() {
  const res = await getPaintings(db);
  const painting = res[Math.floor(Math.random() * res.length)];
  // const painting: any = res[0];
  return {
    props: {
      painting,
    },
  };
}
