import React, { FC } from 'react';
import { styles } from '@/app/_components/Skeleton/styles';

interface SkeletonProps {
  height?: string | number;
  width?: string | number;
  mb?: string | number;
  mt?: string | number;
}

const Skeleton: FC<SkeletonProps> = ({ height = '20px', width = '100%', mb = 20, mt = 0 }) => {
  return (
    <div
      className={styles.root}
      style={{
        height: height,
        width: width,
        marginBottom: mb,
        marginTop: mt,
      }}
    />
  );
};

export default Skeleton;
