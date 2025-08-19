import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// TODO: Update this interface to match your actual data model
export interface <%= classify(name) %> {
  id: string;
  // Add your properties here
}

@Injectable({
  providedIn: 'root'
})
export class <%= classify(name) %>Service {
  private readonly http = inject(HttpClient);
  
  // TODO: Update this to your actual API endpoint
  private readonly apiUrl = '/api/<%= dasherize(name) %>s';

  getAll(): Observable<<%= classify(name) %>[]> {
    return this.http.get<<%= classify(name) %>[]>(this.apiUrl);
  }

  getById(id: string): Observable<<%= classify(name) %>> {
    return this.http.get<<%= classify(name) %>>(`${this.apiUrl}/${id}`);
  }

  create(<%= camelize(name) %>: Omit<<%= classify(name) %>, 'id'>): Observable<<%= classify(name) %>> {
    return this.http.post<<%= classify(name) %>>(this.apiUrl, <%= camelize(name) %>);
  }

  update(id: string, changes: Partial<<%= classify(name) %>>): Observable<<%= classify(name) %>> {
    return this.http.put<<%= classify(name) %>>(`${this.apiUrl}/${id}`, changes);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
