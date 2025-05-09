export interface ModeScriptInfo {
  Name: string;
  CompatibleMapTypes: string;
  Description: string;
  Version: string;
  ParamDescs: ScriptParamDescs[];
  CommandDescs: ScriptCommandDescs[];
}

export interface ScriptParamDescs {
  Name: string;
  Desc: string;
  Type: string;
  Default: string;
}

export interface ScriptCommandDescs {
  Name: string;
  Desc: string;
  Type: string;
  Default: string;
}

export interface Server {
  id: number;
  name: string;
  description?: string;
  host: string;
  xmlrpcPort: number;
  user: string;
  pass: string;
  fmUrl?: string;
  isLocal: boolean;
  isConnected: boolean;
}
