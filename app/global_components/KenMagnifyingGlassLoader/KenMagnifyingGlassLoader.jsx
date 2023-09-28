import React from 'react';
import { MagnifyingGlass } from 'react-loader-spinner';

const KenMagnifyingGlassLoader = () => {
  return (
    <MagnifyingGlass
      visible={true}
      height="80"
      width=""
      ariaLabel="MagnifyingGlass-loading"
      wrapperStyle={{}}
      wrapperClass="MagnifyingGlass-wrapper"
      glassColor="#c0efff"
      color="#090F69"
    />
  );
};

export default KenMagnifyingGlassLoader;
