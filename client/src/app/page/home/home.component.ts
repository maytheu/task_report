import { Component } from '@angular/core';
import { ProfileComponent } from '../../component/profile/profile.component';
import { TasksComponent } from '../../component/tasks/tasks.component';
import { TaskFormComponent } from "../../component/task-form/task-form.component";

@Component({
  selector: 'app-home',
  imports: [ProfileComponent, TasksComponent, TaskFormComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
