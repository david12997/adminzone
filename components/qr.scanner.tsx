'use client';

import { FormatCurrency } from '@/helpers/format.currency';
import useQrScanner from '@/hooks/use.qr.scanner';

const ScannerQr = () => {
  
  const {isScannerActive, videoRef, canvasRef, error, scannedData, selectedPrice, handleRestart, handleAddItem, setSelectedPrice} = useQrScanner();

  return (
    <div className='w-full h-full border p-4 bg-white shadow-md rounded-md'>
      <h1 className='w-full flex items-center justify-center font-bold mb-4 text-[16px] md:text-[20px]'>
        Escanear Productos
      </h1>
      {isScannerActive ? (
        <div className='flex items-center justify-center'>
          <video
            ref={videoRef}
            className='border border-[#4A0083] rounded-md'
            style={{ width: '250px', height: '250px' }}
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
      ) : (
        <div className='flex items-center justify-center'>
          <button
            className='w-[250px] h-[50px] rounded-md bg-[#4A0083] text-white'
            onClick={handleRestart}
          >
            Reiniciar escáner
          </button>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {scannedData && (
        <div className="popup absolute w-screen h-screen bg-[#000000a9] top-0 left-0 flex items-center justify-center">
          <div className="container-data-scanned w-[270px] h-[250px] bg-white p-4 rounded-md">
            <h2 className='flex justify-center items-center font-bold mb-4 w-full truncate'>{scannedData.name}</h2>
            <p className='text-[#838383]'>Selecciona el precio:</p>
            <select className='input-reset w-[98%] ml-[1%] mb-12 bg-[#e6e6e6] p-2 rounded-md' value={selectedPrice ?? scannedData.unit_price} onChange={(e) => setSelectedPrice(Number(e.target.value))}>
              <option value={scannedData.unit_price}>Unitario: {FormatCurrency(scannedData.unit_price, 'COP')}</option>
              <option value={scannedData.combo_price}>Combo: {FormatCurrency(scannedData.combo_price, 'COP')}</option>
              <option value={scannedData.mayor_price}>Mayor: {FormatCurrency(scannedData.mayor_price, 'COP')}</option>
            </select>
            <button className='w-full h-[50px] rounded-md bg-[#4A0083] text-white' onClick={handleAddItem}>Agregar Ítem</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScannerQr;


