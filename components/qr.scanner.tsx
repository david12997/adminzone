'use client';

import { useEffect, useState, useRef } from 'react';
import jsQR from 'jsqr';
import { io } from "socket.io-client";

const socket = io('ws://localhost:3001'); // Conexión global para evitar múltiples instancias

const ScannerQr = () => {
  const [scannedProducts, setScannedProducts] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isScannerVisible, setIsScannerVisible] = useState<boolean>(true);
  const [scanFailures, setScanFailures] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const beepSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    beepSound.current = new Audio('https://db-adminzone.aipus.shop/inverzone/assets/h2kq26r8w74004wg');

    socket.on('connect', () => {
      console.log('Conexión establecida con el servidor, ID:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Desconectado del servidor');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const startScanner = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      setError('No se pudo acceder a la cámara. Inténtalo de nuevo.');
    }
  };

  useEffect(() => {
    startScanner();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    const scan = async () => {
      if (isProcessing || !videoRef.current || !canvasRef.current) return;

      setIsProcessing(true);

      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          setScannedProducts((prevProducts) => [...prevProducts, code.data]);
          setError(null);
          setScanFailures(0);

          if (beepSound.current) {
            beepSound.current.play().catch(err => console.error('Error reproduciendo el sonido:', err));
          }

          console.log('Enviando código escaneado:', code.data);
          socket.emit('add_item', code.data); // Emitir evento
        } else {
          setScanFailures((prevFailures) => prevFailures + 1);
        }
      }

      setTimeout(() => {
        setIsProcessing(false);
      }, 2000);
    };

    const interval = setInterval(scan, 1000);

    if (scanFailures >= 3) {
      clearInterval(interval);
      setIsScannerVisible(false);
    }

    return () => clearInterval(interval);
  }, [isProcessing, scanFailures]);

  const handleRestart = () => {
    setScanFailures(0);
    setIsScannerVisible(true);
    startScanner();
  };

  return (
    <div>
      <h1>Escanear productos:</h1>
      {isScannerVisible ? (
        <>
          <video ref={videoRef} style={{ width: '250px', height: '250px' }}></video>
          <canvas ref={canvasRef} style={{ display: 'none' }} width="250" height="250"></canvas>
        </>
      ) : (
        <button onClick={handleRestart}>Reiniciar escáner</button>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <h2>Productos escaneados:</h2>
        <ul>
          {scannedProducts.map((product, index) => (
            <li key={index}>{product}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ScannerQr;
