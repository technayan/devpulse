export interface IIssue {
  title: string;
  description: string;
  type: string;
  status: string;
  reporter_id: number;
}

export interface IUpdateIssue {
  title?: string;
  description?: string;
  type?: string;
}
