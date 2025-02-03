interface Hospital {
  id: string;
  city: string;
  name: string;
}

export class HospitalEntity {
  id: string;
  city: string;
  name: string;

  constructor(hospitalData: Hospital) {
    this.id = hospitalData.id;
    this.city = hospitalData.city;
    this.name = hospitalData.name;
  }
}
