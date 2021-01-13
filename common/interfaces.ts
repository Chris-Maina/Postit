export interface IUser {
  id?: number;
  first_name?: string;
  last_name?: string;
  email: string;
  posts?: [IPost];
}

export interface IPost {
  id?: number;
  title: string;
  created_at?: string;
  updated_at?: string;
  posted_by?: IUser;
  comments?: IComment[]
}

export interface IComment {
  id?: number;
  title: string;
  created_at?: string;
  updated_at?: string;
  commented_by?: IUser;
}
