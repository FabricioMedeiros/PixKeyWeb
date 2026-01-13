import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  @Input() initialSearchTerm: string = '';
  @Input() searchTerm: string = '';
  @Input() pageSizeOptions: number[] = [10, 30, 50];
  @Input() fieldsSearch: { label: string; field: string }[] = [];

  @Output() search = new EventEmitter<{ field: string; term: string; pageSize: number }>();
  @Output() clear = new EventEmitter<void>();

  selectedPageSize: number = 10;
  selectedField: string = ''; 

  ngOnInit(): void {
    this.searchTerm = this.initialSearchTerm;

    if (this.fieldsSearch.length > 0) {
      this.selectedField = this.fieldsSearch[0].field;
    }
  }

  onSearch(): void {
    if (!this.selectedField) return;
    this.search.emit({
      field: this.selectedField,
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