import React from 'react';

const dialogStyles = {
  overlay: 'fixed inset-0 bg-black bg-opacity-50 z-10',
  contentWrapper: 'fixed inset-0 flex justify-center items-center z-20',
  content: 'bg-white max-w-2xl w-full rounded-lg p-8 relative',
  closeButton: 'absolute top-4 right-4 text-black cursor-pointer text-xl',
  heading: 'text-2xl font-bold mb-4',
  paragraph: 'text-base leading-6 text-gray-700 mb-4',
};

export const FullScreenDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className={dialogStyles.overlay} onClick={onClose}></div>
      <div className={dialogStyles.contentWrapper}>
        <div className={dialogStyles.content}>
          <button className={dialogStyles.closeButton} onClick={onClose} aria-label="Close dialog">
            &times;
          </button>
          <h2 className={dialogStyles.heading}>Your next food adventure starts here</h2>
          <p className={dialogStyles.paragraph}>
            <strong>Find the perfect experience near you</strong>
            <br />
            From hands-on cooking classes to immersive wine tastings, search by location to discover
            unforgettable culinary adventures. Whether you’re exploring your hometown or traveling
            abroad, there’s something delicious waiting for you.
          </p>
          <p className={dialogStyles.paragraph}>
            <strong>Effortless booking with trusted support</strong>
            <br />
            We’ve partnered with our sister company, Viator, to bring you exceptional food
            experiences. Book through TheFork, and Viator will take care of the confirmation and
            details, so you can focus on what matters—enjoying your next adventure.
          </p>
        </div>
      </div>
    </>
  );
};
