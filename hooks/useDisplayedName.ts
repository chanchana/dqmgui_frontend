import React, { useEffect, useState } from 'react';
import cleanDeep from 'clean-deep';

import { PlotInterface } from '../containers/display/DisplayFolderAndPlot';
import { getNameAndDirectoriesFromDir } from '../containers/display/utils';
import { PlotDataProps } from '../containers/display/interfaces';

export const useDisplayedName = (contents: PlotInterface[], data: any) => {
  const [plotContent, setPlotContent] = useState<PlotDataProps[]>([{ name: '', displayedName: '', dir: '' }])

  useEffect(() => {
    if (contents.length > 0) {
      const plotsData: any = cleanDeep(
        contents.map((content: PlotInterface) => {
          const { name, directories } = getNameAndDirectoriesFromDir(content)
          //displayedName is the name which is displayed as label of plot
          //name is a plot name with which need to make a req. to api.
          // displayedName and name could be different, because "Layouts" overwrite the plot name in their own way
          // but user visible plot name should be stay the same as was (not overwritten)
          return { displayedName: content.obj, name: name, dir: content.dir && '/' + directories };
        })
      );
      const result = plotsData ? plotsData : []
      setPlotContent(result)
    }
  }, [data])


  return plotContent
}