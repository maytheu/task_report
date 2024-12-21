import { Component } from '@angular/core';
import { TaskFormComponent } from "../../component/task-form/task-form.component";

@Component({
  selector: 'app-task',
  imports: [TaskFormComponent],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent {

}
