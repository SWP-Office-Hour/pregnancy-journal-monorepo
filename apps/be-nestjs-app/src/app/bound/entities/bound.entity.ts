export interface Bound {
  id?: string;
  week: number;
  upperBound: number;
  lowerBound: number;
  metricId: number;
  whoStandard: number;
}

export class BoundEnity {
  id?: string;
  week: number;
  upperBound: number;
  lowerBound: number;
  metricId: number;
  whoStandard: number;

  constructor(bound: Bound) {
    this.id = bound.id;
    this.week = bound.week;
    this.upperBound = bound.upperBound;
    this.lowerBound = bound.lowerBound;
    this.metricId = bound.metricId;
    this.whoStandard = bound.whoStandard;
  }
}
