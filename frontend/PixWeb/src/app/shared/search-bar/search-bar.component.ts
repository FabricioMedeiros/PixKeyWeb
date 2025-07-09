import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  @Input() initialSearchTerm: string = '';
  @Input() searchTerm: string = '';
  @Input() placeholder: string = '';
  @Input() pageSizeOptions: number[] = [10, 30, 50];

  @Output() search: EventEmitter<{ term: string; pageSize: number }> = new EventEmitter();
  @Output() clear: EventEmitter<void> = new EventEmitter<void>();

  selectedPageSize: number = 10;

  constructor() { }

  ngOnInit(): void {
    this.searchTerm = this.initialSearchTerm;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    if (target) {
      this.searchTerm = target.value;
    }
  }

  onSearch(): void {
    this.search.emit({
      term: this.searchTerm.trim(),
      pageSize: this.selectedPageSize,
    });
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.clear.emit();
  }

  onPageSizeChange(): void {
    this.onSearch();
  }
}
