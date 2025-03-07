export class VisitRecord {
  visit_record_id: string;
  next_visit_doctor_date: Date | null;
  visit_doctor_date: Date;
  doctor_name: string;
  hospital_id: string;
  created_at: Date;
  user_id: string;
}

export class VisitRecordMetric {
  visit_record_id: string;
  created_at: Date;
  value: number;
  metric_id: string;
  updated_at: Date;
  visit_record_metric_id: string;
  tag_id: string | null;
}

export class Media {
  visit_record_id: string | null;
  created_at: Date;
  media_id: string;
  media_url: string;
  post_id: string | null;
}

export class Hospital {
  hospital_id: string;
  name: string;
  city: string;
}

export class VisitRecordIncludeOtherTables extends VisitRecord {
  media: Media[];
  hospital: Hospital;
  visit_record_metric: VisitRecordMetric[];
  week?: number;
}
