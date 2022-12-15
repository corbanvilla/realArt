import Image from "next/image";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { PaintingVoteResponse } from "./api/vote/[painting]/getvotes";

import {
  getFirestore,
  collection,
  getDocs,
  Firestore,
} from "firebase/firestore/lite";
import { InferGetStaticPropsType } from "next";
import { useEffect, useState } from "react";
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
interface RealArt {
  real: Painting;
  fake: Painting;
  id: string;
}

interface Painting {
  url: string;
  description: string;
  votes: number;
  type: string;
}

async function getPaintings(db: Firestore) {
  const paintingsCol = collection(db, "paintings");
  const paintingsSnapshot = await getDocs(paintingsCol);
  const paintingsList = paintingsSnapshot.docs.map((doc) => {
    return { ...doc.data(), id: doc.id };
  }) as RealArt[];

  return paintingsList;
}

export default function Home({
  paintings,
}: InferGetStaticPropsType<typeof getServerSideProps>) {
  // enable / disable overlay elements
  const [overlayHidden, setOverlayHidden] = useState(true);
  const [overlayLeft, setOverlayLeft] = useState(0);
  const [overlayRight, setOverlayRight] = useState(0);
  const [showNextButton, setShowNextButton] = useState(false);

  // keep track of which painting we're on
  const [paintingIndex, setPaintingIndex] = useState(0);
  const [painting, setPainting] = useState(paintings[0]);

  // set left and right
  const [leftPainting, setLeftPainting] = useState({} as Painting);
  const [rightPainting, setRightPainting] = useState({} as Painting);

  // set which is right and wrong
  const [leftVote, setLeftVote] = useState("");
  const [rightVote, setRightVote] = useState("");

  useEffect(() => {
    setLeftRightPaintings();
  }, [painting]);

  // Vote left
  const enableOverlayLeft = () => {
    setOverlayHidden(false);
    setOverlayLeft(1);

    // Our overlay is now visible, so we can show the next button
    setShowNextButton(true);

    // Update the vote count
    if (!showNextButton) {
      leftPainting.votes++;
      fetch(`api/vote/${painting.id}/${leftVote}`);
    }
  };

  // Vote right
  const enableOverlayRight = () => {
    setOverlayHidden(false);
    setOverlayRight(1);

    // Our overlay is now visible, so we can show the next button
    setShowNextButton(true);

    // Update the vote count
    if (!showNextButton) {
      rightPainting.votes++;
      fetch(`api/vote/${painting.id}/${rightVote}`);
    }
  };

  // Disable overlays (left+right)
  const resetOverlay = () => {
    setOverlayHidden(true);
    setOverlayRight(0);
    setOverlayLeft(0);
  };

  // Set left and right paintings
  const setLeftRightPaintings = () => {
    // pick random left and right painting
    if (Math.random() > 0.5) {
      // left is real
      setLeftPainting(painting.real);
      setLeftVote("real.votes");

      // right is fake
      setRightPainting(painting.fake);
      setRightVote("fake.votes");
    } else {
      // left is fake
      setLeftPainting(painting.fake);
      setLeftVote("fake.votes");

      // right is real
      setRightPainting(painting.real);
      setRightVote("real.votes");
    }
  };

  // Iterate to next painting
  const nextPainting = async () => {
    // Disable current overlays
    resetOverlay();
    setShowNextButton(false);

    // set the next painting
    const lastPainting = paintingIndex;
    const nextIndex = (paintingIndex + 1) % paintings.length;
    setPainting(paintings[nextIndex]);
    setPaintingIndex(nextIndex);

    // try updating the vote count for our previous painting
    const vote_req = await fetch(
      `api/vote/${paintings[lastPainting].id}/getvotes`
    );
    if (vote_req.ok) {
      const votes = (await vote_req.json()) as PaintingVoteResponse;
      paintings[lastPainting].real.votes = votes.real;
      paintings[lastPainting].fake.votes = votes.fake;
    }
  };

  // Calc vote percentages
  const calcVotePercentage = () => {
    const totalVotes = painting.real.votes + painting.fake.votes;
    return Math.round((painting.real.votes / totalVotes) * 100);
  };

  return (
    <div className="flex items-center place-content-center w-screen min-h-screen p-8">
      {/* Main Grid */}
      <Image
        alt="wave"
        className="absolute inset-0"
        src="/wave.png"
        height={200}
        width={200}
      ></Image>
      {/* Title Flex Grid */}
      <div className="flex flex-col flex-row min-h-[20vh] items-center place-content-center z-10">
        <h1 className="text-8xl text-center mb-4">Real Art</h1>
        <h2 className="text-4xl text-center">
          Can you tell apart human and AI-generated art?
        </h2>
      </div>

      {/* Flex Grid - Overall */}
      <div className="flex flex-col min-h-[70vh] items-center place-content-center">
        <p className="text-2xl text-center">
          One of these is an actual artwork in the Louvre Abu Dhabi and one of
          these was created by Dall-E 2 (An artifical intelligence art
          generator)
        </p>
        <p className="text-2xl text-center font-bold">
          Click on the one which you think is in the Louvre Abu Dhabi currently
        </p>
        <div className="flex mt-8">
          {/* Left Card */}
          <div
            style={{ zIndex: overlayLeft }}
            onClick={enableOverlayLeft}
            className="flip-card cursor-pointer  mx-4"
          >
            <div
              className={
                "flip-card-inner" + (overlayLeft == 1 ? " do-flip" : "")
              }
            >
              {/* Front Side */}
              <div className="flip-card-front border-8 border-gray-200">
                <Image
                  fill
                  alt={leftPainting.description}
                  src={leftPainting.url}
                />
              </div>
              {/* Back Side */}
              <div className="flip-card-back bg-gray-200">
                <div className="p-8">
                  <p className="text-4xl pb-6 text-center">
                    {leftPainting.type == "fake" ? "AI Generated" : "Real Art"}
                  </p>
                  <p className="px-4">
                    {" "}
                    {leftPainting.type == "fake"
                      ? "This painting was generated with the following prompt"
                      : "This is a real painting in the Louvre Abu Dhabi"}
                  </p>
                  <br></br>
                  <div className="mx-2 bg-gray-300 p-6">
                    <p>{leftPainting.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Right Card */}
          <div
            style={{ zIndex: overlayRight }}
            onClick={enableOverlayRight}
            className="flip-card cursor-pointer mx-4"
          >
            <div
              className={
                "flip-card-inner" + (overlayRight == 1 ? " do-flip" : "")
              }
            >
              {/* Front Side */}
              <div className="flip-card-front border-8 border-gray-200">
                <Image
                  fill
                  alt={rightPainting.description}
                  src={rightPainting.url}
                />
              </div>
              {/* Back Side */}
              <div className="flip-card-back bg-gray-200">
                <div className="p-8">
                  <p className="text-4xl pb-6 text-center">
                    {rightPainting.type == "fake" ? "AI Generated" : "Real Art"}
                  </p>
                  <p className="px-4">
                    {" "}
                    {rightPainting.type == "fake"
                      ? "This painting was generated with the following prompt"
                      : "This is a real painting in the Louvre Abu Dhabi"}
                  </p>
                  <br></br>
                  <div className="mx-2 bg-gray-300 p-6">
                    <p>{rightPainting.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlays */}
      {/* Dark Overlay */}
      <div
        onClick={resetOverlay}
        hidden={overlayHidden}
        className="p-20 fixed top-0 left-0 bottom-0 right-0 w-full h-screen bg-black bg-opacity-50"
      ></div>
      {/* Next button */}
      <div
        onClick={nextPainting}
        style={showNextButton ? {} : { display: "none" }}
        className="fixed top-0 right-0 w-32 lg:w-32 xl:w-64 h-screen z-20 bg-gray-100"
      >
        <div className="flex flex-col place-content-center place-items-center cursor-pointer h-screen">
          <p className="text-9xl">&#8250;</p>
          <p className="text-2xl">Next</p>
        </div>
      </div>
      {/* Progress Bar */}
      <div
        style={showNextButton ? {} : { display: "none" }}
        className="fixed bottom-0 left-0 w-screen h-10 bg-red-300 z-10"
      >
        <div
          className="h-full bg-green-500"
          style={{ width: `${calcVotePercentage()}%` }}
        >
          <p className="text-white px-4 py-2" style={{ whiteSpace: "nowrap" }}>
            {painting.real.votes} out of{" "}
            {painting.real.votes + painting.fake.votes} votes were correct!
          </p>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const res = await getPaintings(db);
  // Shuffle order
  const paintings = res
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
  return {
    props: {
      paintings,
    },
  };
}
