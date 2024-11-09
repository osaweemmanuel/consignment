import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';

const HomeSlider = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // Small screen
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md')); // Medium screen

  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1719937050640-71cfd3d851be?q=80&w=1744&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      text: ' Beautiful Water',
    },
    {
      image: 'https://images.unsplash.com/photo-1721332155567-55d1b12aa271?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      text: 'Majestic Mountains',
    },
    {
      image: 'https://plus.unsplash.com/premium_photo-1723537622351-d3bf02716bb6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxN3x8fGVufDB8fHx8fA%3D%3D',
      text: ' Serene Forest',
    },
    {
      image: 'https://images.unsplash.com/photo-1719937050640-71cfd3d851be?q=80&w=1744&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      text: ' Sunny Beach',
    },
  ];

  // Determine the height based on screen size
  const imageHeight = isSmallScreen ? '400px' : isMediumScreen ? '600px' : '600px';

  return (
    <Swiper
      modules={[Autoplay, EffectFade]}
      spaceBetween={0}
      slidesPerView={1}
      loop={true}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      effect="fade"
      fadeEffect={{ crossFade: true }}
      style={{ width: '100vw', height: imageHeight }} // Full width and dynamic height
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index}>
         <Box
  sx={{
    position: 'relative',
    width: '100vw', // Ensure it covers the viewport width
    height: '100vh', // Full viewport height
    backgroundImage: `url(${slide.image})`, // Your background image
    backgroundSize: 'cover', // Make the background image cover the entire container
    backgroundPosition: 'center left', // Center the image within the container
    backgroundRepeat: 'no-repeat', // Avoid repeating the image
    display: 'flex',
    alignItems: 'center', // Center content vertically
    justifyContent: 'center', // Center content horizontally
    margin: 0, // Ensure no margin is applied
    padding: 0, // Ensure no padding is applied
    left: 0, // Ensure image starts from the very left
    right: 0, // Ensure it ends at the very right
    top: 0, // Ensure it starts at the top
    bottom: 0, // Ensure it covers till the bottom
    overflow: 'hidden', // Hide any overflow
  }}
>
            <Typography
              variant={isSmallScreen ? 'h5' : isMediumScreen ? 'h4' : 'h3'} // Adjust font size based on screen size
              sx={{
                color: 'white',
                padding: '10px 20px',
                borderRadius: '5px',
                textAlign: 'center', // Center text on small screens
                maxWidth: '90%', // Ensure text doesn't overflow on small screens
              }}
            >
              {slide.text}
            </Typography>
          </Box>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HomeSlider;
