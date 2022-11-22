import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import yogurt from "../public/yogurt.jpg";

import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
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
async function getPaintings(db: any) {
  const paintingsCol = collection(db, "paintings");
  const panintingsSnapshot = await getDocs(paintingsCol);
  const paintingsList = panintingsSnapshot.docs.map((doc) => doc.data());
  return paintingsList;
}

export default function Home(props: any) {
  return (
    <div className="container mx-[5%] my-[5%] h-3/5">
      {/* Main Grid */}

      <div className="pt-[10%] flex-1 grid grid-cols-4 grid-rows-4 gap-x-[10vh] gap-y-[5vh] place-items-center">
        {/* Title / Description */}
        <div className="col-span-4 row-start-1">
          <p className="text-4xl text-center">Real Art</p>
          <p className="text-1xl text-center">
            One of these is an actual artwork in the Louvre and one of these was
            done by Dall-E.
            <br /> Select the one which you think was done by a real person.
          </p>
        </div>
        <div className="col-start-2 col-span-1 row-span-3">
          <div className="relative">
            <Image
              objectFit="contain"
              alt="yogurt"
              src={props.painting.image1}
              width="400"
              height="400"
            />
          </div>
        </div>
        <div className="col-start-3 col-span-1 row-span-3">
          <Image
            objectFit="contain"
            width="400"
            height="400"
            alt="yogurt"
            src={props.painting.image2}
          />
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const res: any = await getPaintings(db);
  const painting: any = res[Math.floor(Math.random() * res.length)];
  // const painting: any = res[0];
  return {
    props: {
      painting,
    },
  };
}
