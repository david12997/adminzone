import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  images:{
    remotePatterns:[
        {
            protocol: 'https',
            hostname:'db-adminzone.aipus.shop',
            pathname:'/inverzone/assets/**'
        },
        
    ]
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
};

export default nextConfig;
