export interface Response<T> {
  message: string;
  data: T;
}

export interface PAginate {
  page: number;
  limit: number;
}

export interface Login {
  email: string;
  password: string;
}

export interface LoginResp {
  token: string;
}

export interface RegisterResp {
  user: { email: string; name: string };
  token: string;
}

export interface Register {
  email: string;
  password: string;
  name: string;
}

export interface Profile {
  email: string;
  name: string;
  roles: { name: string }[];
}

export interface AssignRole {
  name: string;
  userId: string;
}

export interface TaskData {
  details: string;
  hours: number;
  department: string;
}

export interface TaskResp {
  name: string;
  details: string;
  hours: number;
  department: string;
  edited: boolean;
  comment?: string;
}

export interface ApproveTask {
  approved: boolean;
  comment: string;
}
