"use client"

import Image from "next/image";
// Import the functions you need from the SDKs you need
import Typewriter from "typewriter-effect";
import { useEffect, useState } from "react";

import PaintingsDatabase from '../paintings.json';

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


export default function Home() {
  // Get local props
  const paintings = PaintingsDatabase
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

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
  };

  // Vote right
  const enableOverlayRight = () => {
    setOverlayHidden(false);
    setOverlayRight(1);

    // Our overlay is now visible, so we can show the next button
    setShowNextButton(true);
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
  };

  // Calc vote percentages
  const calcVotePercentage = () => {
    const totalVotes = painting.real.votes + painting.fake.votes;
    return Math.round((painting.real.votes / totalVotes) * 100);
  };

  return (
    <div
      style={showNextButton ? { width: "85vw" } : { width: "100vw" }}
      className="flex flex-col xl:flex-row items-center place-content-start min-h-screen p-8"
    >
      {/* Main Grid */}
      {/* <Image
        alt="wave"
        className="absolute inset-0"
        src="/wave.png"
        height={400}
        width={400}
      ></Image> */}
      {/* Title Flex Grid */}
      <div className="flex flex-col flex-row min-h-[20vh] items-center place-content-center z-10 p-8">
        {/* <h1 className="text-8xl text-center mb-4">Real Art</h1> */}
        <Typewriter
          options={{
            strings: [
              '<h1 class="text-4xl xl:text-8xl text-center mb-4">Real Art</h1>',
            ],
            autoStart: true,
            loop: true,
          }}
        />
        <h2 className="text-xl xl:text-4xl text-center">
          Can you tell human and computer-generated art apart?
        </h2>
      </div>

      {/* Flex Grid - Overall */}
      <div className="flex flex-col min-h-[70vh] items-center place-content-start xl:place-content-center">
        <p className="text-lg xl:text-2xl text-center pb-4">
          One of these is an actual artwork in the Louvre Abu Dhabi and one of
          these was created by Dall-E 2 (An artifical intelligence art
          generator)
        </p>
        <p className="text-lg xl:text-2xl text-center font-bold">
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
              <div className="flip-card-back flex flex-row place-items-center bg-gray-200 w-full">
                <div className="p-0 px-2 xl:p-8">
                  <h2 className="text-xl xl:text-4xl pb-6 text-center font-bold">
                    {leftPainting.type == "fake" ? "AI Generated" : "Real Art"}
                  </h2>
                  <p className="text-md xl:text-2xl px-4 text-center">
                    {" "}
                    {leftPainting.type == "fake"
                      ? "This painting was generated with the following prompt"
                      : "This is a real painting in the Louvre Abu Dhabi"}
                  </p>
                  <br></br>
                  <div className="text-md xl:text-2xl mx-2 bg-gray-300  p-0 xl:p-6 text-center">
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
              <div className="flip-card-back flex flex-row place-items-center bg-gray-200 w-full">
                <div className="p-0 px-2 xl:p-8">
                  <h2 className="text-xl xl:text-4xl pb-6 text-center font-bold">
                    {rightPainting.type == "fake" ? "AI Generated" : "Real Art"}
                  </h2>
                  <p className="text-md xl:text-2xl px-4 text-center">
                    {" "}
                    {rightPainting.type == "fake"
                      ? "This painting was generated with the following prompt"
                      : "This is a real painting in the Louvre Abu Dhabi"}
                  </p>
                  <br></br>
                  <div className="text-md xl:text-2xl mx-2 bg-gray-300 p-0 xl:p-6 text-center">
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
          <p
            className="text-white text-lg xl:text-2xl px-4 py-2"
            style={{ whiteSpace: "nowrap" }}
          >
            {painting.real.votes} out of{" "}
            {painting.real.votes + painting.fake.votes} votes were correct!
          </p>
        </div>
      </div>
    </div>
  );
}
