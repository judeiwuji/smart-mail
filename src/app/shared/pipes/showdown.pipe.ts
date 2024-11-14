import { Pipe, PipeTransform } from '@angular/core';
import { Converter } from 'showdown';
@Pipe({
  name: 'showdown',
  standalone: true,
})
export class ShowdownPipe implements PipeTransform {
  transform(value: string): string {
    const converter = new Converter();
    return converter.makeHtml(value);
  }
}
