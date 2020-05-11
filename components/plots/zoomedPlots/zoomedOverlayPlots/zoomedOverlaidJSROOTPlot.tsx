import React from 'react';
import cleanDeep from 'clean-deep';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { get_jroot_plot } from '../../../../config/config';
import {
  ParamsForApiProps,
  TripleProps,
  SizeProps,
  PlotDataProps,
  QueryProps,
} from '../../../../containers/display/interfaces';
import { useRequest } from '../../../../hooks/useRequest';
import { useEffect } from 'react';
import {
  StyledCol,
  Column,
  StyledPlotRow,
  PlotNameCol,
  MinusIcon,
  ImageDiv,
} from '../../../../containers/display/styledComponents';
import { removePlotFromSelectedPlots } from '../../plot/singlePlot/utils';

interface ZoomedJSROOTPlotsProps {
  selected_plot: PlotDataProps;
  params_for_api: ParamsForApiProps;
  size: SizeProps;
}

export const ZoomedOverlaidJSROOTPlot = ({
  selected_plot,
  params_for_api,
  size,
}: ZoomedJSROOTPlotsProps) => {
  params_for_api.height = size.h;
  params_for_api.width = size.w;
  params_for_api.plot_name = selected_plot.name;
  params_for_api.folders_path = selected_plot.dir;

  const router = useRouter();
  const query: QueryProps = router.query;

  const { data } = useRequest(get_jroot_plot(params_for_api), {}, [
    selected_plot.name,
  ]);

  const overlaid_plots_runs_and_datasets: any[] = params_for_api?.overlay_plot
    ? params_for_api.overlay_plot.map((plot: TripleProps) => {
        const copy: any = { ...params_for_api };

        if (plot.dataset_name) {
          copy.dataset_name = plot.dataset_name;
        }
        copy.run_number = plot.run_number;
        const { data } = useRequest(get_jroot_plot(copy), {}, [
          selected_plot.name,
        ]);
        return data;
      })
    : [];

  overlaid_plots_runs_and_datasets.push(data);

  let overlaidJSROOTPlot: any = {};

  //checking how many histograms are overlaid, because just separated objects
  // (i.e separate variables ) to JSROOT.CreateTHStack() func
  if (overlaid_plots_runs_and_datasets.length === 0) {
    return null;
  } else if (overlaid_plots_runs_and_datasets.length === 1) {
    const histogram1 = overlaid_plots_runs_and_datasets[0];
    //@ts-ignore
    overlaidJSROOTPlot = JSROOT.CreateTHStack(histogram1);
  } else if (overlaid_plots_runs_and_datasets.length === 2) {
    const histogram1 = overlaid_plots_runs_and_datasets[0];
    const histogram2 = overlaid_plots_runs_and_datasets[1];
    //@ts-ignore
    overlaidJSROOTPlot = JSROOT.CreateTHStack(histogram1, histogram2);
  } else if (overlaid_plots_runs_and_datasets.length === 3) {
    const histogram1 = overlaid_plots_runs_and_datasets[0];
    const histogram2 = overlaid_plots_runs_and_datasets[1];
    const histogram3 = overlaid_plots_runs_and_datasets[2];
    //@ts-ignore
    overlaidJSROOTPlot = JSROOT.CreateTHStack(
      histogram1,
      histogram2,
      histogram3
    );
  } else if (overlaid_plots_runs_and_datasets.length === 4) {
    const histogram1 = overlaid_plots_runs_and_datasets[0];
    const histogram2 = overlaid_plots_runs_and_datasets[1];
    const histogram3 = overlaid_plots_runs_and_datasets[2];
    const histogram4 = overlaid_plots_runs_and_datasets[3];
    //@ts-ignore
    overlaidJSROOTPlot = JSROOT.CreateTHStack(
      histogram1,
      histogram2,
      histogram3,
      histogram4
    );
  }

  const histogramParam = params_for_api.normalize ? 'hist' : 'nostack';
  //make sure that no null histograms are passed to draw func.
  //on first, second reneder overlaidJSROOTPlot.fHists.arr is [null, null]
  //@ts-ignore
  useEffect(() => {
    if (
      cleanDeep(overlaidJSROOTPlot.fHists.arr).length ===
      overlaidJSROOTPlot.fHists.arr.length
    ) {
      //@ts-ignore
      JSROOT.redraw(
        `${histogramParam}_${selected_plot.name}`,
        //@ts-ignore
        JSROOT.parse(JSON.stringify(overlaidJSROOTPlot)),
        `${histogramParam}`
      );
    }
  });

  return (
    <StyledCol space={2}>
      <StyledPlotRow
        minheight={params_for_api.height}
        width={params_for_api.width}
        is_plot_selected={true.toString()}
        nopointer={true.toString()}
      >
        <PlotNameCol>{selected_plot.displayedName}</PlotNameCol>
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
        <ImageDiv
          style={{ display: params_for_api.normalize ? '' : 'none' }}
          id={`hist_${selected_plot.name}`}
          width={size.w}
          height={size.h}
        />
        <ImageDiv
          style={{ display: params_for_api.normalize ? 'none' : '' }}
          id={`nostack_${selected_plot.name}`}
          width={size.w}
          height={size.h}
        />
      </StyledPlotRow>
    </StyledCol>
  );
};
