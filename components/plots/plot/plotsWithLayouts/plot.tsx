import * as React from 'react'
import { Tooltip } from 'antd';

import { get_overlaied_plots_urls, get_plot_url, get_plot_with_overlay_old_api } from '../../../../config/config';
import { PlotDataProps, QueryProps } from '../../../../containers/display/interfaces';
import { isPlotSelected } from '../../../../containers/display/utils';
import { PlotWrapper } from './styledComponents';
import { FormatParamsForAPI, get_plot_error, scroll, scrollToBottom } from '../singlePlot/utils'
import { PlotImage } from '../plotImage';

interface PlotProps {
  globalState: any;
  query: QueryProps;
  plot: PlotDataProps;
  onePlotWidth: number;
  onePlotHeight: number;
  selected_plots: PlotDataProps[];
  imageRef: React.RefObject<HTMLDivElement>;
  imageRefScrollDown: React.RefObject<HTMLDivElement>;
  blink: boolean;
  updated_by_not_older_than: number;
}

export const Plot = ({
  globalState,
  query,
  plot,
  onePlotHeight,
  onePlotWidth,
  selected_plots,
  imageRef,
  imageRefScrollDown,
  blink,
  updated_by_not_older_than }: PlotProps) => {
  const params_for_api = FormatParamsForAPI(
    globalState,
    query,
    encodeURI(plot.name),
    plot.path
  );
  params_for_api.width = onePlotWidth
  params_for_api.height = onePlotHeight
  const url = get_plot_url(params_for_api);
  
  // const plot_with_overlay = chooseApi(params_for_api);
  const overlaid_plots_urls = get_overlaied_plots_urls(params_for_api);
  const joined_overlaid_plots_urls = overlaid_plots_urls.join('');
  params_for_api.joined_overlaied_plots_urls = joined_overlaid_plots_urls;
  const plot_with_overlay = get_plot_with_overlay_old_api(params_for_api);
  // const plot_with_overlay = get_plot_with_overlay_old_api(params_for_api);
  plot.dataset_name = query.dataset_name
  plot.run_number= query.run_number
  const plotSelected = isPlotSelected(
    selected_plots,
    plot
  )
  const fullPlotPath = plot.path + '/' + plot.name
  return (
    <Tooltip title={fullPlotPath} color={get_plot_error(plot) ? 'red' : ''}>
      <PlotWrapper
        plotSelected={plotSelected}
        onClick={async () => {
          await plotSelected
          setTimeout(() => {
            scroll(imageRef);
            scrollToBottom(imageRefScrollDown)
          }, 500);
        }}
        ref={imageRef}
      >
        {query.overlay_data ? (
          <PlotImage
            blink={blink}
            params_for_api={params_for_api}
            plot={plot}
            plotURL={plot_with_overlay}
            updated_by_not_older_than={updated_by_not_older_than}
            query={query}
            imageRef={imageRef}
            isPlotSelected={plotSelected}
          />)
          :
          (<PlotImage
            blink={blink}
            params_for_api={params_for_api}
            plot={plot}
            plotURL={url}
            updated_by_not_older_than={updated_by_not_older_than}
            query={query}
            imageRef={imageRef}
            isPlotSelected={plotSelected}
          />)}
      </PlotWrapper>
    </Tooltip>
  )
}

