import {
  Component,
  inject,
  OnInit,
  effect,
  ChangeDetectionStrategy,
  importProvidersFrom,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventFacade } from './+state/event.facade';
import { User } from './+state/event.service';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [EventFacade],
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventComponent implements OnInit {
  protected readonly eventFacade = inject(EventFacade);

  searchTerm = '';
  selectedDepartment = '';
  displayedUsers = this.eventFacade.users;

  newUser: Omit<User, 'id' | 'createdAt'> = {
    firstName: '',
    lastName: '',
    email: '',
    age: 0,
    department: '',
    isActive: true,
  };

  constructor() {
    // Effect to log user changes
    effect(() => {
      const users = this.eventFacade.users();
      console.log('Users updated:', users.length);
    });

    // Effect to log selected user changes
    effect(() => {
      const selectedUser = this.eventFacade.selectedUser();
      if (selectedUser) {
        console.log(
          'Selected user:',
          selectedUser.firstName,
          selectedUser.lastName,
        );
      }
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.eventFacade.loadUsers();
  }

  selectUser(id: number): void {
    this.eventFacade.loadUser(id);
  }

  isUserSelected(userId: number): boolean {
    return this.eventFacade.selectedUser()?.id === userId;
  }

  trackByUserId(index: number, user: User): number {
    return user.id;
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.eventFacade
        .getUsersBySearchTerm(this.searchTerm)
        .subscribe((users) => {
          // For demo purposes, we could update displayedUsers
          // In a real app, you might want to handle this differently
        });
    } else {
      this.displayedUsers = this.eventFacade.users;
    }
  }

  filterByDepartment(department: string): void {
    this.selectedDepartment = department;
    if (department) {
      this.eventFacade
        .getUsersByDepartmentName(department)
        .subscribe((users) => {
          // Handle filtered users
        });
    } else {
      this.displayedUsers = this.eventFacade.users;
    }
  }

  createUser(): void {
    if (this.isValidUser(this.newUser)) {
      const userToCreate = {
        ...this.newUser,
        createdAt: new Date().toISOString(),
      };
      this.eventFacade.createUser(userToCreate);
      this.resetForm();
    }
  }

  editUser(user: User): void {
    // Example edit - toggle active status
    this.eventFacade.updateUser(user.id, { isActive: !user.isActive });
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.eventFacade.deleteUser(id);
    }
  }

  private isValidUser(user: Omit<User, 'id' | 'createdAt'>): boolean {
    return !!(
      user.firstName &&
      user.lastName &&
      user.email &&
      user.department &&
      user.age > 0
    );
  }

  private resetForm(): void {
    this.newUser = {
      firstName: '',
      lastName: '',
      email: '',
      age: 0,
      department: '',
      isActive: true,
    };
  }
}
