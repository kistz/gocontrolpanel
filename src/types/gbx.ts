export interface ModeScriptInfo {
  Name: string;
  CompatibleTypes: string;
  Description: string;
  Version: string;
  ParamDescs: ScriptParamDescs[];
  CommandDescs: ScriptCommandDescs[];
}

interface ScriptParamDescs {
  Name: string;
  Desc: string;
  Type: string;
  Default: string;
}

interface ScriptCommandDescs {
  Name: string;
  Desc: string;
  Type: string;
  Default: string;
}
