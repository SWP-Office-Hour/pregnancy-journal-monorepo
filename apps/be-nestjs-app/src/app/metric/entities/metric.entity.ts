import { Standard } from '../../standard/entities/standard.entity';

export interface MetricDTO {
  id: string;
  title: string;
  measurementUnit: string;
  status: number;
  required: boolean;
  upperBoundMsg: string;
  lowerBoundMsg: string;
  bounds?: Standard[];
}

export class Metric {
  id: string;
  title: string;
  measurementUnit: string;
  status: number;
  required: boolean;
  upperBoundMsg: string;
  lowerBoundMsg: string;
  bounds: Standard[];

  constructor(metric: MetricDTO) {
    this.id = metric.id;
    this.title = metric.title;
    this.measurementUnit = metric.measurementUnit;
    this.status = metric.status;
    this.required = metric.required;
    this.upperBoundMsg = metric.upperBoundMsg;
    this.lowerBoundMsg = metric.lowerBoundMsg;
    this.bounds = metric.bounds || [];
  }
}
