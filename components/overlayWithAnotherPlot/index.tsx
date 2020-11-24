import * as React from 'react'
import Modal from 'antd/lib/modal/Modal'
import { useRouter } from 'next/router'

import { ParamsForApiProps, PlotoverlaidSeparatelyProps, QueryProps } from '../../containers/display/interfaces'
import { Icon, StyledA } from '../../containers/display/styledComponents'
import { choose_api } from '../../containers/display/utils'
import { store } from '../../contexts/leftSideContext'
import { useRequest } from '../../hooks/useRequest'
import { Button, Col, Row, Tooltip } from 'antd'
import { FolderPath } from '../../containers/display/content/folderPath'
import { PlotInterface, DirectoryInterface } from '../../containers/display/interfaces'
import cleanDeep from 'clean-deep'
import { Spinner } from '../../containers/search/styledComponents'
import { FoldersRow, ModalContent, PlotNameDiv, PlotsRow, SpinnerRow } from './styledComponents'
import { changeFolderPathByBreadcrumb, setPlot } from './utils'
import { SelectedPlotsTable } from './selectedPlotsTable'

interface OverlayWithAnotherPlotProps {
  visible: boolean;
  setOpenOverlayWithAnotherPlotModal: any
}

export const OverlayWithAnotherPlot = ({ visible, setOpenOverlayWithAnotherPlotModal }: OverlayWithAnotherPlotProps) => {
  const [overlaidPlots, setOverlaidPlots] = React.useState<PlotoverlaidSeparatelyProps>({ folder_path: '', name: '' })
  const [folders, setFolders] = React.useState<(string | undefined)[]>([])
  const [currentFolder, setCurrentFolder] = React.useState<string | undefined>('')

  const clear = () => {
    setOpenOverlayWithAnotherPlotModal(false)
    setCurrentFolder('')
    setOverlaidPlots({ folder_path: '', name: '' })
    setFolders([])
  }

  const [selectedPlots, setSelectedPlots] = React.useState<PlotoverlaidSeparatelyProps[]>([])
  const router = useRouter();
  const query: QueryProps = router.query;
  const { updated_by_not_older_than } = React.useContext(store)

  const params: ParamsForApiProps = {
    dataset_name: query.dataset_name as string,
    run_number: query.run_number as string,
    notOlderThan: updated_by_not_older_than,
    folders_path: overlaidPlots.folder_path,
  }

  const api = choose_api(params)
  const data_get_by_mount = useRequest(api,
    {},
    [overlaidPlots.folder_path]
  );

  React.useEffect(() => {
    const copy = [...folders]
    const index = folders.indexOf(currentFolder)

    if (index >= 0) {
      const rest = copy.splice(0, index + 1)
      setFolders(rest)
      const joinderFolders = rest.join('/')
      setOverlaidPlots({ folder_path: joinderFolders, name: '' })
    }
    else {
      copy.push(currentFolder)
      //we're cleaning copy array, because we want to delete empty string as an item from it. 
      // We need to remove it because when we're joining array with empty string 
      // we're getting a string with '/' in the beginning.
      const cleaned_array = cleanDeep(copy) ? cleanDeep(copy) : []
      setFolders(cleaned_array)
      const joinderFolders = copy.join('/')
      if (cleaned_array.length === 0) {
        setOverlaidPlots({ folder_path: '', name: '' })
      }
      setOverlaidPlots({ folder_path: joinderFolders, name: '' })
    }
  }, [currentFolder])

  const { data } = data_get_by_mount
  const folders_or_plots = data ? data.data : []
  const directories: string[] = []
  const plots: string[] = []

  folders_or_plots.forEach((folder_or_plot: DirectoryInterface & PlotInterface) => {
    directories.push(folder_or_plot.subdir)
    plots.push(folder_or_plot.name)
  })
  
  directories.sort()
  plots.sort()

  return (
    <Modal
      visible={visible}
      onCancel={() => clear()}
    >
      <Row gutter={16} >
        <Col style={{ padding: 8 }}>
          <FolderPath folder_path={overlaidPlots.folder_path}
            changeFolderPathByBreadcrumb={(items: any) => changeFolderPathByBreadcrumb(items)(setFolders, setCurrentFolder)} />
        </Col>
        <FoldersRow>
          <SelectedPlotsTable overlaidPlots={overlaidPlots} setSelectedPlots={setSelectedPlots} />
        </FoldersRow>
        <ModalContent>
          {
            !data_get_by_mount.isLoading &&
            <FoldersRow>
              {directories.map((directory: any) => {
                return (
                  <>
                    {directory &&
                      <Col span={8} onClick={() => setCurrentFolder(directory)}>
                        <Icon />
                        <StyledA>{directory}</StyledA>
                      </Col>
                    }
                  </>
                )
              })}
            </FoldersRow>
          }
          {data_get_by_mount.isLoading &&
            <SpinnerRow>
              <Spinner />
            </SpinnerRow>
          }
          {
            <PlotsRow gutter={16}>{
              !data_get_by_mount.isLoading && plots.map((plot: any) => {
                const current_plot = { folder_path: overlaidPlots.folder_path, name: plot }
                const disabled = selectedPlots.findIndex((selectedPlot) =>
                  selectedPlot.folder_path === current_plot.folder_path && selectedPlot.name === current_plot.name) > -1
                return (
                  <>
                    {plot &&
                      <Tooltip title={disabled ? 'This plot is already selected' : ''}>
                        <Button
                          type='text'
                          block
                          disabled={disabled}
                          onClick={() => setOverlaidPlots(setPlot(overlaidPlots, plot))}>
                          <PlotNameDiv
                          >{plot}</PlotNameDiv>
                        </Button>
                      </Tooltip>
                    }
                  </>
                )
              })
            }
            </PlotsRow>
          }
        </ModalContent>
      </Row>
    </Modal>
  )
}