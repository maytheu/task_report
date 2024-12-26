import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ApproveTask,
  AssignRole,
  Login,
  LoginResp,
  PAginate,
  Profile,
  Register,
  RegisterResp,
  Response,
  TaskData,
  TaskResp,
} from './types';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}
  private url = 'http://localhost:30000/api/v1';

  /** Login to account */
  login(data: Login) {
    return this.http.post<Response<LoginResp>>(`${this.url}/auth/login`, data);
  }

  /**Register  */
  register(data: Register) {
    return this.http.post<Response<RegisterResp>>(
      `${this.url}/auth/register`,
      data
    );
  }

  /** Fetch logged in profile */
  profile() {
    return this.http.get<Response<Profile>>(`${this.url}/profile`);
  }

  allUsers(data: PAginate) {
    let query = '';
    if (data.page) query = `page=${data.page}&`;
    else if (data.limit) query += `limit=${data.limit}`;
    else query = 'name=1&limit=10';
    return this.http.get<Response<Profile[]>>(
      `${this.url}/profile/users?${query}`
    );
  }

  assignRolesToUser(data: AssignRole) {
    return this.http.post<Response<{}>>(`${this.url}/profile/assiign`, data);
  }

  newTask(data: TaskData) {
    return this.http.post<Response<TaskResp>>(`${this.url}/task/new`, data);
  }

  userTasks() {
    return this.http.get<Response<TaskResp[]>>(`${this.url}/task`);
  }

  allTasks() {
    return this.http.get<Response<TaskResp[]>>(`${this.url}/task/tasks`);
  }

  approveTask(data: ApproveTask, id: string) {
    return this.http.put<Response<{}>>(`${this.url}/task/assign/${id}`, data);
  }


  updateTask(data: ApproveTask, id: string) {
    return this.http.put<Response<{}>>(`${this.url}/task/${id}`, data);
  }
}
