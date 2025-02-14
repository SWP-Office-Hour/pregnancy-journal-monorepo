export interface Province {
  name: string;
  code: number;
  division_type: string;
  phone_code: number;
  codename: string;
  districts: District[] | null;
}

export interface District {
  name: string;
  code: number;
  division_type: string;
  phone_code: number;
  codename: string;
  province_code: number;
  wards: Ward[] | null;
}

export interface Ward {
  code: number;
  codename: string;
  district_code: number;
  division_type: string;
  name: string;
}
