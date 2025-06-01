import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center space-y-4">
      <motion.div className="h-10 bg-gray-200 animate-pulse rounded w-3/4" />
      <motion.div className="h-8 bg-gray-200 animate-pulse rounded w-1/2" />
      <motion.div className="h-10 bg-gray-200 animate-pulse rounded w-1/4" />
    </div>
  );
};

export default SkeletonLoader;
