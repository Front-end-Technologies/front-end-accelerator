import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AzureAuthenticationFlowService } from '../../security/microsoft/azure-authentication-flow.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="signin-container">
      <div class="signin-card">
        <h2>Sign In</h2>
        <p>Welcome to the Angular Authentication Demo</p>

        <div class="signin-content">
          <p>Please sign in to access the application.</p>

          <button
            class="signin-button"
            (click)="signIn()"
            [disabled]="isLoading"
          >
            {{ isLoading ? 'Signing in...' : 'Sign in with Microsoft' }}
          </button>

          <div *ngIf="error" class="error-message">
            {{ error }}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .signin-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background-color: #f5f5f5;
        padding: 20px;
      }

      .signin-card {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        padding: 40px;
        max-width: 400px;
        width: 100%;
        text-align: center;
      }

      h2 {
        color: #333;
        margin-bottom: 10px;
      }

      p {
        color: #666;
        margin-bottom: 30px;
      }

      .signin-button {
        background-color: #0078d4;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 12px 24px;
        font-size: 16px;
        cursor: pointer;
        width: 100%;
        transition: background-color 0.3s;
      }

      .signin-button:hover:not(:disabled) {
        background-color: #106ebe;
      }

      .signin-button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
      }

      .error-message {
        color: #d13438;
        margin-top: 15px;
        padding: 10px;
        background-color: #ffeaea;
        border-radius: 4px;
        border: 1px solid #f5c6c6;
      }
    `,
  ],
})
export class SigninComponent {
  private authService = inject(AzureAuthenticationFlowService);
  private router = inject(Router);

  isLoading = false;
  error: string | null = null;

  async signIn() {
    try {
      this.isLoading = true;
      this.error = null;

      await this.authService.login();

      // Navigate to home or dashboard after successful signin
      this.router.navigate(['/']);
    } catch (error) {
      this.error = 'Failed to sign in. Please try again.';
      console.error('Sign in error:', error);
    } finally {
      this.isLoading = false;
    }
  }
}
