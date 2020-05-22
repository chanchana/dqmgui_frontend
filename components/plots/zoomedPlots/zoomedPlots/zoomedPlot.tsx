import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { get_plot_url, root_url } from '../../../../config/config';
import {
  ParamsForApiProps,
  PlotDataProps,
  QueryProps,
} from '../../../../containers/display/interfaces';
import {
  StyledCol,
  PlotNameCol,
  StyledPlotRow,
  Column,
  MinusIcon,
  ImageDiv,
  Image,
} from '../../../../containers/display/styledComponents';
import { removePlotFromSelectedPlots } from '../../plot/singlePlot/utils';


interface ZoomedPlotsProps {
  selected_plot: PlotDataProps;
  params_for_api: ParamsForApiProps;
}

export const ZoomedPlot = ({
  selected_plot,
  params_for_api,
}: ZoomedPlotsProps) => {
  const plot_url = get_plot_url(params_for_api);
  const source = `${root_url}${plot_url}`;
  const router = useRouter();
  const query: QueryProps = router.query;

  return (
    <StyledCol space={2}>
      <StyledPlotRow
        minheight={params_for_api.height}
        width={params_for_api.width}
        is_plot_selected={true.toString()}
        nopointer={true.toString()}
      >
        <PlotNameCol>{selected_plot.name}</PlotNameCol>
        <Column>
          <Link
            href={{
              pathname: '/',
              query: {
                run_number: query.run_number,
                dataset_name: query.dataset_name,
                folder_path: query.folder_path,
                overlay: query.overlay,
                overlay_data: query.overlay_data,
                selected_plots: `${removePlotFromSelectedPlots(
                  query.selected_plots,
                  selected_plot
                )}`,
              },
            }}
          >
            <MinusIcon />
          </Link>
        </Column>
        <ImageDiv id={selected_plot.name} width={params_for_api.width} height={params_for_api.height}>
          <Image src={source} width={params_for_api.width} height={params_for_api.height} />
        </ImageDiv>
      </StyledPlotRow>
    </StyledCol>
  );
};