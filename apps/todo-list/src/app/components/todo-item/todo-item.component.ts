import { UpperCasePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { HighlightCompletedTodoDirective } from '../../directives/highlight-completed-todo.directive';
import { Todo } from '../../model/todo.type';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [HighlightCompletedTodoDirective, UpperCasePipe],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss',
})
export class TodoItemComponent {
  todo = input.required<Todo>();
  todoToggled = output<Todo>();
  deleteTodo = output<Todo>();

  todoClicked() {
    this.todoToggled.emit(this.todo());
  }

  delete() {
    this.deleteTodo.emit(this.todo());
  }
}
