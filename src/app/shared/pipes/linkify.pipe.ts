import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'linkify',
  standalone: true,
})
export class LinkifyPipe implements PipeTransform {
  constructor(private readonly sanitizer: DomSanitizer) {}
  transform(value: string): SafeHtml {
    let regx =
      /(?!<a[^>]*>[^<])(((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-~]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?))(?![^<]*<\/a>)/gi;

    const html = this.sanitizer.bypassSecurityTrustHtml(
      value
        .replace(regx, (match) => {
          let short = match.substring(0, 30);
          short += match.length > 30 ? '...' : '';
          return `<a href="${match}" target="_blank" rel="noreferer,noopener">${short}</a>`;
        })
        .replace(/(\\n\\r|\\n|\n|\r)/g, '<br/>')
    );
    return html;
  }
}
