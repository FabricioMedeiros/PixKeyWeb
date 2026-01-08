import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-button-scroll-top',
  templateUrl: './button-scroll-top.component.html',
  styleUrls: ['./button-scroll-top.component.css']
})
export class ButtonScrollTopComponent implements AfterViewInit {
  showScrollTop = false;
  private container!: HTMLElement;

  ngAfterViewInit() {
    this.container = document.getElementById('main-content')!;

    if (this.container) {
      this.container.addEventListener('scroll', () => {
        const yOffset = this.container.scrollTop;
        this.showScrollTop = yOffset > 200;
      });
    }
  }

  scrollToTop() {
    if (this.container) {
      this.container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}