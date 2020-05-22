import React from 'react';

import { ParamsForApiProps } from '../../../../containers/display/interfaces';
import { OnSideOverlaidPlots } from './onSideOverlaidPlots';
import { OverlaidPlotImage } from './overlaidPlotImage';
import { PlotDataProps } from '../../../../containers/display/interfaces';
import { useRouter } from 'next/router';

interface OverlaidPlotProps {
  plot: PlotDataProps;
  isPlotSelected: boolean;
  params_for_api: ParamsForApiProps
  imageRefScrollDown: any;
}

export const OverlaidPlot = ({
  plot,
  isPlotSelected,
  params_for_api,
  imageRefScrollDown
}: OverlaidPlotProps) => {

  return (
    <>
      {params_for_api.overlay === 'onSide' ? (
        <OnSideOverlaidPlots
          params_for_api={params_for_api}
          plot={plot}
          isPlotSelected={isPlotSelected}
          imageRefScrollDown={imageRefScrollDown}
        />
      ) : (
          <OverlaidPlotImage
            plot={plot}
            params_for_api={params_for_api}
            isPlotSelected={isPlotSelected}
            imageRefScrollDown={imageRefScrollDown}
          />
        )}
    </>
  );
};