export interface HetznerSSHKey {
  id: number;
  nme: string;
  fingerprint: string;
  public_key: string;
  labels: {
    [key: string]: string;
  };
  created: string;
}

export interface HetznerSSHKeyResponse {
  ssh_key: HetznerSSHKey;
}
