// import Image from 'next/image';
// import React from 'react';
// import yogurt from '../public/yogurt.jpg';

// type ImagePickerProps = {
//   image1: string,
//   image2: string,
//   onPick: (image: string) => void
// }

// const ImagePicker = ({ image1, image2, onPick }: ImagePickerProps) => {
//   return (
//     <div className="flex justify-center items-center">
//       <div className="w-1/2">
//         <Image
//           src={yogurt}
//           alt="image1"
//           className="rounded-full w-64 h-64 object-cover"
//           onClick={() => onPick(image1)}
//         />
//       </div>
//       <div className="w-1/2">
//         <Image
//           src={yogurt}
//           alt="image2"
//           className="rounded-full w-64 h-64 object-cover"
//           onClick={() => onPick(image2)}
//         />
//       </div>
//     </div>
//   )
// }
// export default ImagePicker;