import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safe',
  standalone: true,
})
export class SafePipe implements PipeTransform {
  constructor(private readonly sanitizer: DomSanitizer) {}

  transform(
    value: string,
    format: 'html' | 'url' | 'script' | 'style' = 'html'
  ): any {
    switch (format) {
      case 'html':
        return this.sanitizer.bypassSecurityTrustHtml(value);
      case 'url':
        return this.sanitizer.bypassSecurityTrustResourceUrl(value);
      case 'script':
        return this.sanitizer.bypassSecurityTrustScript(value);
      case 'style':
        return this.sanitizer.bypassSecurityTrustStyle(value);
      default:
        return this.sanitizer.sanitize(SecurityContext.HTML, value);
    }
  }
}
