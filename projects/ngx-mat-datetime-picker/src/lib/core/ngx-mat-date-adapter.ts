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
}
