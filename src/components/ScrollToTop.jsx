import React, { useState, useEffect } from 'react';
import { ArrowUpward } from '@mui/icons-material';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const ScrollToTopButton = () => {
  const [showButton, setShowButton] = useState(false);

  // Check the scroll position and show the button if scrolled down
  const handleScroll = () => {
    if (window.scrollY > 300) {
      // Adjust the value as needed
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  // Scroll to the top when the button is clicked
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Attach scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {showButton && (
        <OverlayTrigger
          delay={{ show: 250, hide: 400 }}
          overlay={<Tooltip id='button-tooltip'>{'Scroll To Top'}</Tooltip>}
        >
          <div className='scroll-to-top border-0' onClick={scrollToTop}>
            <ArrowUpward />
          </div>
        </OverlayTrigger>
      )}
    </>
  );
};

export default ScrollToTopButton;
