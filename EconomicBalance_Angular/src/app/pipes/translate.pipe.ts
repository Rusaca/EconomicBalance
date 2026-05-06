import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslateService } from '../servicios/translate.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false
})
export class TranslatePipe implements PipeTransform {

  private translate = inject(TranslateService);

  transform(key: string): string {
    return this.translate.t(key);
  }
}
