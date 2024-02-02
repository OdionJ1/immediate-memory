

export enum RunMode {
  local = 'local',
  live = 'live'
}

class GlobalConstants {
  runMode: RunMode
  baseUrl: string
}


export const globalConstants = ((): GlobalConstants => {
  const runMode = process.env.REACT_APP_RUN_MODE as RunMode | null
  
  console.log(runMode)
  if(runMode) {
    switch(runMode){
      case RunMode.local:
        return {
          baseUrl: 'http://localhost:4000',
          runMode: runMode
        }
      case RunMode.live:
        return {
          baseUrl: 'https://immediate-memory.azurewebsites.net',
          runMode: runMode
       }
      default:
        throw new Error('Invalid run mode')
    }
  } else {
    throw new Error('Undefined run mode')
  }
})()