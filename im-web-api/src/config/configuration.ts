



export enum RunMode {
  local = 'local',
  live = 'live'
}

export enum ConfigKeys {
  port = 'port',
  token = 'token',
}


const configuration = () => {
  const runMode = process.env.RUN_MODE as RunMode | null

  if(runMode) {
    switch (runMode) {
      case RunMode.local:
        return {
          [ConfigKeys.port]: 4000,
          [ConfigKeys.token]: '$1$97b32',
          runMode: runMode 
        }
      case RunMode.live:
        return {
          [ConfigKeys.port]: 5000,
          [ConfigKeys.token]: '$1$97b32',
          runMode: runMode 
        }
      default:
        throw new Error('Invalid run mode')
    }
  } else {
    throw new Error('Undefined run mode')
  }
};


export default configuration

