import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AzureAuthenticationFlowService } from '../../security/microsoft/azure-authentication-flow.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home-container">
      <header class="header">
        <h1>Angular Authentication Demo</h1>
        <div class="user-info">
          <span *ngIf="isAuthenticated">Welcome back!</span>
          <button
            class="logout-button"
            (click)="signOut()"
            *ngIf="isAuthenticated"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main class="main-content">
        <div *ngIf="isAuthenticated; else notAuthenticated">
          <h2>You are successfully authenticated!</h2>
          <p>This is a protected area of the application.</p>

          <div class="actions">
            <button class="action-button" (click)="viewAuthExample()">
              View Authentication Example
            </button>
          </div>
        </div>

        <ng-template #notAuthenticated>
          <h2>Welcome to the Authentication Demo</h2>
          <p>Please sign in to access the protected features.</p>

          <button class="signin-button" (click)="goToSignIn()">
            Go to Sign In
          </button>
        </ng-template>
      </main>
    </div>
  `,
  styles: [
    `
      .home-container {
        min-height: 100vh;
        background-color: #f8f9fa;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 40px;
        background: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      h1 {
        color: #333;
        margin: 0;
      }

      .user-info {
        display: flex;
        align-items: center;
        gap: 15px;
      }

      .main-content {
        padding: 40px;
        max-width: 800px;
        margin: 0 auto;
        text-align: center;
      }

      h2 {
        color: #333;
        margin-bottom: 20px;
      }

      p {
        color: #666;
        margin-bottom: 30px;
        font-size: 16px;
      }

      .actions {
        margin-top: 30px;
      }

      .action-button,
      .signin-button,
      .logout-button {
        background-color: #0078d4;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 12px 24px;
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.3s;
        margin: 0 10px;
      }

      .action-button:hover,
      .signin-button:hover {
        background-color: #106ebe;
      }

      .logout-button {
        background-color: #d13438;
      }

      .logout-button:hover {
        background-color: #b12a2f;
      }
    `,
  ],
})
export class HomeComponent {
  private authService = inject(AzureAuthenticationFlowService);
  private router = inject(Router);

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  signOut() {
    this.authService.logout();
    this.router.navigate(['/signin']);
  }

  goToSignIn() {
    this.router.navigate(['/signin']);
  }

  viewAuthExample() {
    this.router.navigate(['/auth-example']);
  }
}
