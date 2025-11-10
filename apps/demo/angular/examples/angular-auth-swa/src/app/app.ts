import { Component, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { injectQuery } from "@tanstack/angular-query-experimental";
import { AuthService } from "../services/auth/auth";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, CommonModule],
  template: `
    <main class="p-4">
      <a
        class="rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        href="/.auth/login/github"
        >Login</a
      >

      <a
        class="ml-2 rounded bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
        href="/.auth/logout"
        >Logout</a
      >
    </main>

    <pre class="p-8">
      {{ me.data() | json }}
    </pre
    >
    <router-outlet />
  `,
})
export class App {
  authService = inject(AuthService);

  me = injectQuery(() => ({
    queryKey: ["me"],
    queryFn: () => this.authService.me(),
  }));
}
