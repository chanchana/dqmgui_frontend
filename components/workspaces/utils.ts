import { QueryProps } from "../../containers/display/interfaces";
import Router from 'next/router';

// export const pathToHome = (query: QueryProps) => Router.replace({
//   pathname: '/',
//   query: {
//     run_number: query.run_number,
//     dataset_name: query.dataset_name,
//     folder_path: '',
//     overlay: query.overlay,
//     overlay_data: query.overlay_data,
//     selected_plots: query.selected_plots,
//   },
// })

export const setWorkspaceToQuery = (query: QueryProps, workspace: string) => {
  console.log(workspace)
  return Router.replace({
    pathname: '/',
    query: {
      run_number: query.run_number,
      dataset_name: query.dataset_name,
      folder_path: '',
      workspace: workspace,
      overlay: query.overlay,
      overlay_data: query.overlay_data,
      selected_plots: query.selected_plots,
    },
  })

}

export const removeFirstSlash = (path: string) => {
  const firstChar = path.substring(0, 1)
  if (firstChar === "/") {
    return path.substring(1, path.length)
  } else {
    return path
  }
}