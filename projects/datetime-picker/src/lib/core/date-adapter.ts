import { DateAdapter } from '@angular/material/core';

export abstract class NgxMatDateAdapter<D> extends DateAdapter<D> {
  /**
 * Gets the hour component of the given date.
 * @param date The date to extract the month from.
 * @returns The hour component.
 */
  abstract getHour(date: D): number;

  /**
* Gets the minute component of the given date.
* @param date The date to extract the month from.
* @returns The minute component.
*/
  abstract getMinute(date: D): number;

  /**
  * Gets the second component of the given date.
  * @param date The date to extract the month from.
  * @returns The second component.
  */
  abstract getSecond(date: D): number;

  /**
  * Set the hour component of the given date.
  * @param date The date to extract the month from.
  * @param value The value to set.
  */
  abstract setHour(date: D, value: number): void;

  /**
  * Set the second component of the given date.
  * @param date The date to extract the month from.
  * @param value The value to set.
  */
  abstract setMinute(date: D, value: number): void;

  /**
   * Set the second component of the given date.
   * @param date The date to extract the month from.
   * @param value The value to set.
   */
  abstract setSecond(date: D, value: number): void;

  /**
   * Check if two date have same time
   * @param a Date 1
   * @param b Date 2
   */
  isSameTime(a: D, b: D): boolean {
    if (a == null || b == null) return true;
    return this.getHour(a) === this.getHour(b)
      && this.getMinute(a) === this.getMinute(b)
      && this.getSecond(a) === this.getSecond(b);
  }

  /**
   * Copy time from a date to a another date
   * @param toDate 
   * @param fromDate 
   */
  copyTime(toDate: D, fromDate: D) {
    this.setHour(toDate, this.getHour(fromDate));
    this.setMinute(toDate, this.getMinute(fromDate));
    this.setSecond(toDate, this.getSecond(fromDate));
  }

  /**
 * Compares two dates.
 * @param first The first date to compare.
 * @param second The second date to compare.
 * @returns 0 if the dates are equal, a number less than 0 if the first date is earlier,
 *     a number greater than 0 if the first date is later.
 */
  compareDateWithTime(first: D, second: D, showSeconds?: boolean): number {
    let res = super.compareDate(first, second) ||
      this.getHour(first) - this.getHour(second) ||
      this.getMinute(first) - this.getMinute(second);
    if (showSeconds) {
      res = res || this.getSecond(first) - this.getSecond(second);
    }
    return res;
  }

  /**
   * Set time by using default values
   * @param defaultTime List default values [hour, minute, second]
   */
  setTimeByDefaultValues(date: D, defaultTime: number[]) {
    if (!Array.isArray(defaultTime)) {
      throw Error('@Input DefaultTime should be an array');
    }
    this.setHour(date, defaultTime[0] || 0);
    this.setMinute(date, defaultTime[1] || 0);
    this.setSecond(date, defaultTime[2] || 0);
  }

}
