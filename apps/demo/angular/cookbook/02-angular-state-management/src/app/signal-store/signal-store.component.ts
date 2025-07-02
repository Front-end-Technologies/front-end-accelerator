import { Component, effect, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UserStore } from './signal-store.store';

@Component({
  selector: 'app-signal-store',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="container">
      <h1>Signal Store Example with Search</h1>
      <p>
        This is a simple example of using Angular Signals for state management
        with search capabilities.
      </p>

      <div class="search-section">
        <div class="search-controls">
          <input
            type="text"
            [formControl]="searchControl"
            placeholder="Search users by name, email, or department..."
            class="search-input"
          />
          <button
            type="button"
            (click)="clearSearch()"
            class="clear-button"
            [disabled]="!store.searchTerm()"
          >
            Clear
          </button>
        </div>

        <div class="search-info">
          <p>
            Showing {{ store.paginatedUsers().length }} of
            {{ store.filteredUsersCount() }} users
            @if (store.searchTerm()) {
              <span class="search-term">for "{{ store.searchTerm() }}"</span>
            }
          </p>
        </div>
      </div>

      <!-- Pagination Controls -->
      @if (store.filteredUsersCount() > 0) {
        <div class="pagination-section">
          <div class="pagination-info">
            <p>
              Page {{ store.currentPage() }} of
              {{ store.totalPagesForFiltered() }} ({{
                store.itemsPerPage()
              }}
              items per page)
            </p>
          </div>

          <div class="pagination-controls">
            <button
              type="button"
              (click)="goToPreviousPage()"
              [disabled]="!store.hasPreviousPage()"
              class="pagination-button"
            >
              Previous
            </button>

            <div class="page-numbers">
              @for (page of getPageNumbers(); track page) {
                <button
                  type="button"
                  (click)="goToPage(page)"
                  [class.active]="page === store.currentPage()"
                  class="page-number"
                >
                  {{ page }}
                </button>
              }
            </div>

            <button
              type="button"
              (click)="goToNextPage()"
              [disabled]="!store.hasNextPage()"
              class="pagination-button"
            >
              Next
            </button>
          </div>

          <div class="page-size-controls">
            <label for="pageSize">Items per page:</label>
            <select
              id="pageSize"
              [value]="store.itemsPerPage()"
              (change)="changePageSize($event)"
              class="page-size-select"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
      }

      @if (store.isLoading()) {
        <div class="loading">Loading users...</div>
      }

      @if (store.error()) {
        <div class="error">Error: {{ store.error() }}</div>
      }

      <div class="users-grid">
        @for (user of store.paginatedUsers(); track user.id) {
          <div class="user-card">
            <h2>{{ user.firstName }} {{ user.lastName }}</h2>
            <p><span class="label">Email:</span> {{ user.email }}</p>
            <p><span class="label">Age:</span> {{ user.age }}</p>
            <p><span class="label">Department:</span> {{ user.department }}</p>
            <p>
              <span class="label">Active:</span>
              <span
                [class]="user.isActive ? 'status-active' : 'status-inactive'"
              >
                {{ user.isActive ? 'Yes' : 'No' }}
              </span>
            </p>
          </div>
        } @empty {
          @if (!store.isLoading()) {
            <div class="empty-state">
              @if (store.searchTerm()) {
                <p>No users found matching "{{ store.searchTerm() }}"</p>
                <button
                  type="button"
                  (click)="clearSearch()"
                  class="clear-button"
                >
                  Clear search
                </button>
              } @else {
                <p>No users available</p>
              }
            </div>
          }
        }
      </div>
    </div>
  `,
  styleUrl: './signal-store.component.scss',
  providers: [UserStore],
})
export class SignalStoreComponent {
  readonly store = inject(UserStore);
  readonly users = this.store.users;
  readonly searchControl = new FormControl('');

  constructor() {
    // Subscribe to search input changes
    this.searchControl.valueChanges.subscribe((value) => {
      this.store.updateSearchTerm(value || '');
    });

    effect(() => {
      console.log('Users updated:', this.users());
    });
    effect(() => {
      console.log('Users count:', this.store.usersCount());
    });
    effect(() => {
      console.log('Loading state:', this.store.loading());
    });
    effect(() => {
      console.log('Filtered users count:', this.store.filteredUsersCount());
    });
  }

  clearSearch(): void {
    this.searchControl.setValue('');
    this.store.clearSearch();
  }

  // Pagination methods
  goToPreviousPage(): void {
    this.store.goToPreviousPage();
  }

  goToNextPage(): void {
    this.store.goToNextPage();
  }

  goToPage(page: number): void {
    this.store.goToPage(page);
  }

  changePageSize(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newPageSize = parseInt(target.value, 10);
    this.store.changePageSize(newPageSize);
  }

  getPageNumbers(): number[] {
    const totalPages = this.store.totalPagesForFiltered();
    const currentPage = this.store.currentPage();
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const startPage = Math.max(
      1,
      currentPage - Math.floor(maxVisiblePages / 2),
    );
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i,
    );
  }
}
