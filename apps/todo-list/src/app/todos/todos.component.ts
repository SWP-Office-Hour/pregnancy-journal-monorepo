import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { catchError } from 'rxjs';
import { TodoItemComponent } from '../components/todo-item/todo-item.component';
import { Todo } from '../model/todo.type';
import { FilterTodosPipe } from '../pipes/filter-todos.pipe';
import { TodosService } from '../services/todos.service';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [TodoItemComponent, FormsModule, FilterTodosPipe],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.scss',
})
export class TodosComponent implements OnInit {
  todoService = inject(TodosService);
  todoItems = signal<Array<Todo>>([]);
  searchTerm = signal('');
  newTodo = signal('');

  ngOnInit(): void {
    this.todoService
      .getTodosFromApi()
      .pipe(
        catchError((err) => {
          console.log(err);
          throw err;
        }),
      )
      .subscribe((todos) => {
        this.todoItems.set(todos);
      });
  }

  addTodoItem(todoContent: string) {
    const todoItem: Todo = {
      userId: this.todoItems().length + 1,
      id: new Date().getTime(),
      title: todoContent,
      completed: false,
    };

    this.todoItems.update((todos) => {
      return [todoItem, ...todos];
    });
  }

  deleteTodo(todo: Todo) {
    this.todoItems.update((todos) => {
      return todos.filter((_todo) => _todo == todo);
    });
  }

  updateTodoItem(todoItem: Todo) {
    this.todoItems.update((todos) => {
      return todos.map((todo) => {
        if (todo.id === todoItem.id) {
          return {
            ...todo,
            completed: !todo.completed,
          };
        }
        return todo;
      });
    });
  }
}
