export interface HetznerServer {
  id: number;
  name: string;
  status: string;
  created: string;
  public_net: {
    ipv4: {
      id?: number;
      ip: string;
      blocked: boolean;
      dns_ptr: string;
    } | null;
  };
  private_net: {
    network?: number;
    ip?: string;
    alias_ips?: string[];
    mac_address?: string;
  }[];
  server_type: {
    id: number;
    name: string;
    description: string;
    cores: number;
    memory: number;
    disk: number;
    deprecated: boolean;
    prices: {
      location: string;
      price_hourly: {
        net: string;
        gross: string;
      };
      price_monthly: {
        net: string;
        gross: string;
      };
      included_traffic: number;
      price_per_tb_traffic: {
        net: string;
        gross: string;
      };
    }[];
    storage_type: string;
    cpu_type: string;
    architecture: string;
  };
  datacenter: {
    id: number;
    name: string;
    description: string;
    location: {
      id: number;
      name: string;
      description: string;
      country: string;
      city: string;
      latitude: number;
      longitude: number;
      network_zone: string;
    };
    server_types: {
      supported: number[];
      available: number[];
      available_for_migration: number[];
    };
  };
  image: {
    id: number;
    type: string;
    status: string;
    name: string | null;
    description: string;
    image_size: number | null;
    disk_size: number;
    created: string;
    architecture: string;
  } | null;
  outgoing_traffic: number | null;
  ingoing_traffic: number | null;
  included_traffic: number | null;
  volumes: number[];
  labels: {
    [key: string]: string;
  };
}

export interface HetznerServersResponse {
  servers: HetznerServer[];
  meta: {
    pagination: {
      page: number;
      per_page: number;
      previous_page: number | null;
      next_page: number | null;
      last_page: number | null;
      total_entries: number | null;
    };
  };
}

export interface HetznerServerResponse {
  server: HetznerServer;
  meta: {
    rate_limit: {
      limit: number;
      remaining: number;
      reset: string;
    };
  };
}
