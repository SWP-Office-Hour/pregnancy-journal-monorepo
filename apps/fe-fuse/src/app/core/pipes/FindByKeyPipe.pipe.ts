import { Pipe } from '@angular/core';
import { FuseFindByKeyPipe } from '../../../@fuse/pipes/find-by-key';

/**
 * Finds an object from given source using the given key - value pairs
 */
@Pipe({
  name: 'FindByKey',
  pure: false,
  standalone: true,
})
export class FindByKeyPipe extends FuseFindByKeyPipe {
  /**
   * Transform
   *
   * @param value A string or an array of strings to find from source
   * @param key Key of the object property to look for
   * @param source Array of objects to find from
   */
  transform<T>(value: T | T[], key: string, source: any[]): any {
    // If the given value is an array of strings...
    if (Array.isArray(value)) {
      return value.map((item) => source.find((sourceItem) => sourceItem[key] === item));
    }

    // If the value is a string...
    return source.find((sourceItem) => sourceItem[key] === value);
  }
}
