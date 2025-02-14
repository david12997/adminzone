import { JSX } from "react";

const Loading = ():JSX.Element => {
    return (
      <div className="flex flex-col items-center justify-center    w-[100%] h-[100%]">
        {/* Spinner Creativo */}
        <div className="relative w-16 h-16 mb-8">
          <div className="absolute inset-0 border-4 bg-[#4A0083] border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-4 border-white border-t-transparent rounded-full animate-spin-slow"></div>
        </div>
        
        {/* Barra de Carga Creativa */}
        <div className="w-64 h-2 bg-gray-300 rounded-full overflow-hidden">
          <div className="h-full bg-[#4A0083] animate-loading"></div>
        </div>
      </div>
    );
  };
  
  export default Loading;
  