import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  @Input() searchTerm: string = '';
  @Input() placeholder: string = '';
  @Output() search: EventEmitter<string> = new EventEmitter<string>();
  @Output() clear: EventEmitter<void> = new EventEmitter<void>();

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    if (target) {
      this.searchTerm = target.value;
    }
  }
  
  onSearch(): void {
    if (this.searchTerm !== '') {
      this.search.emit(this.searchTerm);
    }
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.clear.emit();
  }
}
