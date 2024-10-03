import React from 'react';
import Carousel from 'react-material-ui-carousel';

const data = [
  "https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/270640/pexels-photo-270640.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/733758/pexels-photo-733758.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
  "",
  "https://images.unsplash.com/photo-1691073112675-9685bc6779bf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1524711212733-10ef1b0bec75?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/18121582/pexels-photo-18121582/free-photo-of-green-mini-cooper.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/18285501/pexels-photo-18285501/free-photo-of-mini-cooper-on-grid.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
];

const Banner = () => {
  return (
    <div className="w-full">
      <Carousel autoPlay={true}  indicators={false} navButtonsAlwaysInvisible={true} cycleNavigation={true}>
        {data.map((image, i) => (
          image && (
            <div key={i} className="h-[500px] w-full overflow-hidden">
              <img
                src={image}
                alt={`banner-${i}`}
                className="w-full h-full object-cover"
              />
            </div>
          )
        ))}
      </Carousel>
    </div>
  );
};

export default Banner;
