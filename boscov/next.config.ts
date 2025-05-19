import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["upload.wikimedia.org", "image.tmdb.org", "www.themoviedb.org"],
  },
};

export default nextConfig;
