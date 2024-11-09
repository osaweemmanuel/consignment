// import React from 'react'; // Import React
// import { CloudinaryContext } from 'cloudinary-react'; // Import CloudinaryContext
// import { Button } from '@mui/material';

// const CloudinaryUploadWidget = ({ onImageUpload, onUploadSuccess, onUploadError, onUploadClose }) => {
//   const handleUpload = (error, result) => {
//     if (!error && result && result.event === "success") {
//       const imageUrl = result.info.secure_url;
//       const imagePublicId = result.info.public_id;
//       onImageUpload(imageUrl,  imagePublicId); // Pass the uploaded image's URL and public ID to the parent
//       if (onUploadSuccess) onUploadSuccess(result); // Call custom success callback
//     } else if (error) {
//       console.error('Upload Error:', error); // Log any error from Cloudinary
//       if (onUploadError) onUploadError(error); // Call custom error callback
//     }
//   };

//   const openUploadWidget = () => {
//     if (window.cloudinary) {
//       window.cloudinary.createUploadWidget(
//         {
//           cloudName: 'duuyabzjh',
//           uploadPreset: 'unSigned_parcel_upload',
//           sources: ['local', 'url', 'facebook', 'instagram', 'camera'],
//           maxFiles: 1,
//           multiple: false,
//           showAdvancedOptions: true,
//           cropping: true,
//           croppingAspectRatio: 1,
//           maxImageWidth: 400,
//           maxImageHeight: 400,
//           clientAllowedFormats: ['png', 'jpg', 'jpeg', 'gif'],
//           singleUpload: true,
//           theme: 'white',
//           // Custom callbacks for upload process
//           onClose: () => {
//             if (onUploadClose) onUploadClose(); // Call custom close callback
//           }
//         },
//         handleUpload
//       ).open();
//     } else {
//       console.error('Cloudinary script has not loaded.');
//     }
//   };

//   return (
//     <CloudinaryContext cloudName="duuyabzjh">
//       <Button variant="outlined" onClick={openUploadWidget}>
//         Upload Image
//       </Button>
//     </CloudinaryContext>
//   );
// };

// export default CloudinaryUploadWidget;


const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'your_upload_preset'); // Replace with your preset

  const response = await fetch('https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', {
      method: 'POST',
      body: formData,
  });

  const data = await response.json();
  return data.secure_url; // Assuming the URL is in `secure_url`
};