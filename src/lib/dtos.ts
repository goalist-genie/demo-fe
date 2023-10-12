export interface IProjectDataResponseItem {
  id: number;
  name: string;
  overview: string;
  created_at: string;
  created_by: string;
  indexing: boolean;
}

export interface IProjectRequestBody {
  name: string;
  overview: string;
  created_by: string;
  generate_faq: boolean;
  files: any;
}

export interface IFaqResponseItem {
  id: number,
  question: string,
  answer: string,
  project_id: number,
}

export interface ICreatedProjectDataResponse {
  id: number,
  name: string,
  overview: string,
  created_at: string,
  created_by: string,
  faqs: IFaqResponseItem[]
}

export interface IFaqRequest {
  question: string,
  answer: string,
}