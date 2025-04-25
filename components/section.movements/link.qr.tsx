'use client';

import { IconScannerQR } from "../icons.client";

interface OpenQRScannerProps {
  url: string;
}

function OpenQRScanner({ url }: OpenQRScannerProps) {
  const handleClick = () => {
    window.open(url, '_blank');
  };

  return (
    <button className="absolute cursor-pointer font-semibold w-[150px] h-[40px] z-50 bg-[#E20000] top-[20px] right-[290px] text-white text-center flex justify-center items-center rounded-md" onClick={handleClick}>
       <span className="mr-2">Scanner QR</span> <IconScannerQR />
    </button>
  );
}

export default OpenQRScanner;