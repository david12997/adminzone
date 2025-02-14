import { useEffect, useState, useRef } from 'react';
import jsQR from 'jsqr';
import { NewRequests } from '@/helpers/request';
import { io } from "socket.io-client";


const  useQrScanner = () => {

    /**
     * @description states for the scanner such as error, scanned data, selected price, is scanner active, scan attempts
     * @returns {String} error
     * @returns {Object} scannedData
     * @returns {Number} selectedPrice
     * @returns {Boolean} isScannerActive
     * @returns {Number} scanAttempts
     * 
     */
    const [error, setError] = useState<string | null>(null);
    const [scannedData, setScannedData] = useState<any | null>(null);
    const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
    const [isScannerActive, setIsScannerActive] = useState<boolean>(true);
    const [scanAttempts, setScanAttempts] = useState<number>(0);


    /**
     * @description references for the video, canvas and beep sound
     * @returns {HTMLVideoElement} videoRef
     * @returns {HTMLCanvasElement} canvasRef
     * @returns {HTMLAudioElement} beepSound
     */
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const beepSound = useRef<HTMLAudioElement | null>(null);

    const socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL); // Create a socket connection

    useEffect(() => {
        beepSound.current = new Audio(process.env.NEXT_PUBLIC_BEEP_SOUND_URL);

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


    /**
     * @description function to start the scanner
     * @returns void
     */
    const startScanner = async () => {
        try {
            const constraints = { 
                video: { 
                    facingMode: 'environment',
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                } 
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);// Get the camera stream

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.setAttribute("playsinline", "true");
                await videoRef.current.play();
            }

        } catch (err) {
            console.error('Error al acceder a la cámara:', err);
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

        let animationFrameId: number;

        const scanFrame = () => {
            if (!isScannerActive) return;

            if (videoRef.current && canvasRef.current) {
                const video = videoRef.current;
                const canvas = canvasRef.current;
                const context = canvas.getContext('2d');

                if (video.readyState === video.HAVE_ENOUGH_DATA && context) {
                    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    }

                    context.filter = 'contrast(150%) brightness(150%)';
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);
                    context.filter = 'none';

                    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                    const code = jsQR(imageData.data, imageData.width, imageData.height);

                    if (code) {
                    try {
                        const parsedData = JSON.parse(code.data);
                        setIsScannerActive(false);
                        setScanAttempts(0);

                        NewRequests([`${process.env.NEXT_PUBLIC_PROD_API_URL}/api/products/${parsedData.id}`], 'POST')
                        .then((response) => {
                            const data = response[0].data[0];
                            setScannedData(data);
                            setSelectedPrice(data.unit_price);
                            setError(null);
                        })
                        .catch(err => {
                            console.error('Error en la solicitud:', err);
                            setError('Error al obtener datos del producto.');
                        });

                        if (beepSound.current) {
                        beepSound.current.play().catch(err => console.error('Error reproduciendo el sonido:', err));
                        }
                        return;
                    } catch (e) {
                        console.error('Error parseando el contenido del QR:', e);
                        setScanAttempts(prev => prev + 1);
                        if (scanAttempts >= 3) {
                        setError('QR inválido. Reiniciando escáner...');
                        setTimeout(() => handleRestart(), 2000);
                        }
                    }
                    }
                }
            }
            animationFrameId = requestAnimationFrame(scanFrame);
        };

        animationFrameId = requestAnimationFrame(scanFrame);
        return () => cancelAnimationFrame(animationFrameId);
    }, [isScannerActive, scanAttempts]);

    const handleAddItem = async () => {
    if (scannedData && selectedPrice !== null) {
        const itemToSend = { ...scannedData, price_selected: selectedPrice, quantity_selected: 1 };
        socket.emit('add_item', itemToSend);

        if (beepSound.current) {
        beepSound.current.play().catch(err => console.error('Error reproduciendo el sonido:', err));
        }

        setScannedData(null);
        setSelectedPrice(null);
        handleRestart();
    }
    };

    const handleRestart = () => {
    setIsScannerActive(true);
    setScanAttempts(0);
    startScanner();
    };

    return {
        error,
        scannedData,
        selectedPrice,
        isScannerActive,
        handleAddItem,
        handleRestart,
        videoRef,
        canvasRef,
        setSelectedPrice
        };
}

export default useQrScanner;