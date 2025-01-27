interface Hosiptal {
  id: string;
  city: string;
  name: string;
}

export class HosiptalEntity {
  id: string;
  city: string;
  name: string;

  constructor(hosiptalData: Hosiptal) {
    this.id = hosiptalData.id;
    this.city = hosiptalData.city;
    this.name = hosiptalData.name;
  }
}
